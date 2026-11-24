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
  if (!usingBackup) {
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
document.addEventListener('toggle-playback', togglePlayback);
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
