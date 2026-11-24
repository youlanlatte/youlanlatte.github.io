const audio = document.querySelector('audio');
const song = document.querySelector('#song');
const status = document.querySelector('#status');
const play = document.querySelector('#play');
const seek = document.querySelector('#seek');
const level = document.querySelector('#level');
function refreshPosition() {
  const available = Number.isFinite(audio.duration) && audio.duration > 0;
  seek.disabled = !available;
  if (available) {
    seek.max = audio.duration;
    seek.value = audio.currentTime;
    const seconds = Math.floor(audio.currentTime);
    seek.setAttribute('aria-valuetext', Math.floor(seconds / 60) + ' 分 ' + seconds % 60 + ' 秒');
  }
}
audio.addEventListener('durationchange', refreshPosition);
audio.addEventListener('timeupdate', refreshPosition);
seek.oninput = () => { if (!seek.disabled) audio.currentTime = Number(seek.value); };
level.oninput = () => { audio.volume = Number(level.value); };
audio.onvolumechange = () => { level.value = audio.volume; };
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
song.onclick = togglePlayback;
play.onclick = togglePlayback;
function syncPlayback() {
  const label = audio.paused ? '播放春日影' : '暂停春日影';
  song.setAttribute('aria-label', label);
  play.setAttribute('aria-label', label);
  play.textContent = audio.paused ? '▶' : 'Ⅱ';
}
audio.onplaying = () => { status.textContent = ''; syncPlayback(); };
audio.onpause = syncPlayback;
audio.onerror = recoverAudio;
audio.onended = () => { wantsPlayback = false; syncPlayback(); };
const search = document.querySelector('.searchBox');
search.oninput = () => {
  song.hidden = !'春日影 mygo!!!!!'.includes(search.value.trim().toLowerCase());
  document.querySelector('#no-results').hidden = !song.hidden;
};
const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.menu-toggle');
function menu(open) {
  sidebar.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  if (open) search.focus();
  else toggle.focus();
}
toggle.onclick = () => menu(true);
document.querySelector('.close').onclick = () => menu(false);
sidebar.querySelector('a[href="#songs"]').onclick = () => { if (sidebar.classList.contains('open')) menu(false); };
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sidebar.classList.contains('open')) menu(false);
});
