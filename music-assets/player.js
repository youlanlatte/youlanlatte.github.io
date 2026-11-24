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
async function togglePlayback() {
  if (!audio.paused) { audio.pause(); return; }
  try { await audio.play(); }
  catch { status.textContent = '播放失败，请使用顶部播放器重试。'; }
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
audio.onerror = () => { status.textContent = '音频加载失败，请刷新页面重试。'; };
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
