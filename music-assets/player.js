const audio = document.querySelector('audio');
const status = document.querySelector('#status');
const backup = audio.querySelector('source[type="audio/mpeg"]').src;
let usingBackup = false;
let wantsPlayback = false;

async function tryPlayback() {
  try {
    await audio.play();
  } catch (error) {
    if (error.name === 'AbortError') return;
    if (error.name === 'NotSupportedError' && !usingBackup) {
      recoverAudio();
      return;
    }
    wantsPlayback = false;
    status.textContent = '请再次点播放，或使用下方的直接播放入口。';
  }
}
function recoverAudio() {
  if (!usingBackup && audio.dataset.track !== 'killkiss') {
    usingBackup = true;
    audio.src = backup;
    audio.load();
    if (wantsPlayback) tryPlayback();
  } else {
    wantsPlayback = false;
    status.textContent = '音频加载失败，可重新点播放或直接打开音频。';
  }
}
async function togglePlayback() {
  if (!audio.paused) { wantsPlayback = false; audio.pause(); return; }
  wantsPlayback = true;
  if (audio.error) audio.load();
  status.textContent = '正在加载春日影…';
  await tryPlayback();
}
const lyrics = document.querySelector('#lyrics');
let cues = [];
let activeLine = -1;
let selection = 0;
async function loadLyrics(track) {
  const request = ++selection;
  cues = [];
  activeLine = -1;
  lyrics.textContent = track === 'killkiss' ? '加载歌词…' : '暂无同步歌词';
  if (track !== 'killkiss') return;
  try {
    const response = await fetch('music-assets/killkiss-lyrics.json');
    if (!response.ok) throw new Error();
    const lines = await response.json();
    if (request !== selection) return;
    cues = lines;
    lyrics.replaceChildren(...lines.map(([,text]) => {
      const node = document.createElement('p');
      node.textContent = text;
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
    lyrics.scrollTo({top:line.offsetTop-(lyrics.clientHeight-line.offsetHeight)/2,
      behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
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
    document.querySelector('.current strong').textContent = tile.dataset.title;
    document.querySelector('.current small').textContent = tile.dataset.artist;
    const mp3 = 'music-assets/'+track+'.mp3';
    document.querySelector('a.direct-play').href = mp3;
    usingBackup = false;
    audio.src = track === 'haruhikage' && audio.canPlayType('audio/mp4') ? 'music-assets/haruhikage.m4a' : mp3;
    audio.dispatchEvent(new Event('trackchange'));
    loadLyrics(track);
  }
  togglePlayback();
});
audio.onplaying = () => { status.textContent = ''; };
audio.onerror = recoverAudio;
audio.onended = () => { wantsPlayback = false; };
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
