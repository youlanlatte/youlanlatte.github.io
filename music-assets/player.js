const audio = document.querySelector('audio');
const song = document.querySelector('#song');
const status = document.querySelector('#status');
song.onclick = async () => {
  if (!audio.paused) { audio.pause(); return; }
  try { await audio.play(); }
  catch { status.textContent = '播放失败，请使用顶部播放器重试。'; }
};
function syncPlayback() {
  song.setAttribute('aria-label', audio.paused ? '播放春日影' : '暂停春日影');
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
