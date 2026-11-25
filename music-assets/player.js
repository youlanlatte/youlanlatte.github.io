const audio = document.querySelector('audio');
const status = document.querySelector('#status');
async function togglePlayback() {
  if (!audio.paused) { audio.pause(); return; }
  if (audio.error) audio.load();
  status.textContent = '正在加载…';
  try { await audio.play(); }
  catch (error) {
    if (error.name !== 'AbortError') status.textContent = '请再次点播放，或使用下方的直接播放入口。';
  }
}
const lyrics = document.querySelector('#lyrics');
let cues = [];
let activeLine = -1;
let selection = 0;
let resumeScroll;
function centerLine() {
  const line = lyrics.children[activeLine];
  if (!line) return;
  lyrics.scrollTo({top:line.offsetTop-(lyrics.clientHeight-line.offsetHeight)/2,
    behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}
function browseLyrics() {
  clearTimeout(resumeScroll);
  resumeScroll = setTimeout(() => { resumeScroll = null; centerLine(); }, 4000);
}
lyrics.addEventListener('wheel', browseLyrics, {passive:true});
lyrics.addEventListener('touchmove', browseLyrics, {passive:true});
lyrics.addEventListener('keydown', event => {
  if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End'].includes(event.key)) browseLyrics();
});
function parseLyrics(text) {
  const groups = new Map();
  const offset = Number(text.match(/\[offset:([+-]?\d+)\]/i)?.[1] || 0) / 1000;
  for (const raw of text.split(/\r?\n/)) {
    const stamps = /\[(\d+):(\d+(?:\.\d+)?)\]/g;
    const line = raw.replace(stamps, '').trim();
    if (!line) continue;
    for (const match of raw.matchAll(stamps)) {
      const time = Number(match[1]) * 60 + Number(match[2]) - offset;
      if (!groups.has(time)) groups.set(time, new Set());
      groups.get(time).add(line);
    }
  }
  return [...groups].sort(([a], [b]) => a-b).map(([time, lines]) => [time,[...lines].join('\n')]);
}
async function loadLyrics(track) {
  const request = ++selection;
  clearTimeout(resumeScroll);
  resumeScroll = null;
  lyrics.scrollTop = 0;
  cues = [];
  activeLine = -1;
  lyrics.textContent = '加载歌词…';
  try {
    const response = await fetch('music-assets/lyrics/'+track+'.lrc?v=7');
    if (!response.ok) throw new Error();
    const lines = parseLyrics(await response.text());
    if (request !== selection) return;
    cues = lines;
    lyrics.replaceChildren(...lines.map(([,text]) => {
      const node = document.createElement('p');
      for (const part of text.split('\n')) {
        const row = document.createElement('span');
        row.textContent = part;
        node.append(row);
      }
      return node;
    }));
    syncLyrics();
  } catch { if (request === selection) lyrics.textContent = '歌词暂时无法加载'; }
}
function syncLyrics() {
  const index = cues.findLastIndex(([time]) => time <= audio.currentTime);
  if (index === activeLine) return;
  lyrics.children[activeLine]?.classList.remove('active');
  activeLine = index;
  const line = lyrics.children[index];
  if (line) {
    line.classList.add('active');
    if (!resumeScroll) centerLine();
  } else lyrics.scrollTop = 0;
}
audio.addEventListener('timeupdate',syncLyrics);
audio.addEventListener('seeked',syncLyrics);
document.addEventListener('toggle-playback', event => {
  const track = event.detail;
  if (track && track !== (audio.dataset.track || 'haruhikage')) {
    const tile = document.querySelector('[data-glass-ui="song"][data-track="'+track+'"]');
    if (!tile) return;
    audio.pause();
    audio.dataset.track = track;
    audio.setAttribute('aria-label',tile.dataset.title+' · '+tile.dataset.artist);
    document.querySelector('.mini-art').src = 'music-assets/'+track+'.jpg';
    document.querySelector('.current strong').textContent = tile.dataset.title;
    document.querySelector('.current small').textContent = tile.dataset.artist;
    const mp3 = 'music-assets/audio/'+track+'.mp3';
    document.querySelector('a.direct-play').href = mp3;
    audio.src = mp3;
    audio.dispatchEvent(new Event('trackchange'));
    loadLyrics(track);
  }
  togglePlayback();
});
audio.onplaying = () => { status.textContent = ''; };
audio.onerror = () => { status.textContent = '音频加载失败，可重新点播放或直接打开音频。'; };
loadLyrics('haruhikage');
const sidebar = document.querySelector('.sidebar');
function menu(open) {
  sidebar.classList.toggle('open', open);
  const toggle = document.querySelector('[data-glass-ui="open-menu"] button');
  toggle?.setAttribute('aria-expanded', String(open));
  if (open) sidebar.querySelector('input')?.focus();
  else toggle?.focus();
}
document.addEventListener('music-menu', event => menu(event.detail));
sidebar.addEventListener('click', event => {
  if (event.target.closest('a[href="#songs"]') && sidebar.classList.contains('open')) menu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sidebar.classList.contains('open')) menu(false);
});
