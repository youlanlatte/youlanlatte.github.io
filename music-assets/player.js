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
let selection = 0;
const paintLyrics = createLyricView(lyrics,audio);
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
  renderLyrics([], '加载歌词…');
  try {
    const response = await fetch('music-assets/lyrics/'+track+'.lrc?v=7');
    if (!response.ok) throw new Error();
    const lines = parseLyrics(await response.text());
    if (request !== selection) return;
    renderLyrics(lines);
  } catch { if (request === selection) lyrics.textContent = '歌词暂时无法加载'; }
}
function renderLyrics(lines,message) {
  cues = lines;
  paintLyrics(lines,message);
  audio.dispatchEvent(new Event('lyricschange'));
}
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
    releaseLocalFiles();
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
const popup = document.querySelector('#full-player');
const expand = document.querySelector('.expand-art');
let frame;
let localUrls = [];
function releaseLocalFiles() {
  localUrls.forEach(url => URL.revokeObjectURL(url));
  localUrls = [];
}
function localUrl(file) {
  const url = URL.createObjectURL(file);
  localUrls.push(url);
  return url;
}
async function selectLocal(files) {
  const song = files.find(f => f.type.startsWith('audio/') || /\.(mp3|m4a|wav|flac|ogg)$/i.test(f.name));
  const art = files.find(f => f.type.startsWith('image/'));
  const lrc = files.find(f => /\.lrc$/i.test(f.name));
  if (song) {
    audio.pause();
    releaseLocalFiles();
    audio.dataset.track = 'local';
    const name = song.name.replace(/\.[^.]+$/, '');
    document.querySelector('.current strong').textContent = name;
    document.querySelector('.current small').textContent = '本地音乐';
    audio.setAttribute('aria-label',name+' · 本地音乐');
    document.querySelector('.mini-art').src = 'music-assets/fullscreen/default.svg';
    audio.src = localUrl(song);
    document.querySelector('a.direct-play').href = audio.src;
    ++selection;
    renderLyrics([]);
    lyrics.textContent = '暂无同步歌词';
    togglePlayback();
  }
  if (art) document.querySelector('.mini-art').src = localUrl(art);
  audio.dispatchEvent(new Event('trackchange'));
  if (lrc) {
    const request = ++selection;
    const lines = parseLyrics(await lrc.text());
    if (request === selection) renderLyrics(lines);
  }
}
function closePlayer() {
  if (document.fullscreenElement === document.documentElement) document.exitFullscreen().catch(() => {});
  if (popup.open) popup.close();
  expand.focus();
}
expand.onclick = () => {
  if (!frame) {
    frame = document.createElement('iframe');
    frame.title = '全屏播放器';
    frame.src = 'music-assets/fullscreen/view.html?v=2';
    popup.append(frame);
  }
  popup.showModal();
  document.documentElement.requestFullscreen?.().catch(() => {});
  frame.contentWindow.dispatchEvent(new Event('playeropen'));
};
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && popup.open) closePlayer();
});
popup.addEventListener('cancel', event => {event.preventDefault(); closePlayer();});
window.fullPlayer = {audio, togglePlayback, selectLocal, closePlayer, lines:() => cues,
  title:() => document.querySelector('.current strong').textContent,
  art:() => document.querySelector('.mini-art').src};
