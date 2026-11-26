const player = parent.fullPlayer;
const audio = player.audio;
const $ = selector => document.querySelector(selector);
const cover = $('.svgcontainer');
const input = $('.audiofile');
const seek = $('.processbar');
let active = -1;
function metadata() {
  $('.name').textContent = player.title();
  const image = 'url("' + player.art() + '")';
  cover.style.backgroundImage = image;
  document.body.style.setProperty('--cover',image);
}
function drawLyrics() {
  const nodes = player.lines().map(([,text]) => {
    const p = document.createElement('p');
    p.className = 'line'; p.textContent = text; return p;
  });
  $('.lyrics').replaceChildren(...(nodes.length ? nodes : ['暂无同步歌词']));
  active = -1;
  update();
}
function time(value) {
  const seconds = Math.max(0,Math.floor(value || 0));
  return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
}
function update() {
  if (!parent.document.querySelector('#full-player').open) return;
  const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  seek.disabled = !duration; seek.max = duration || 1; seek.value = audio.currentTime;
  $('.start').textContent = time(audio.currentTime);
  $('.end').textContent = '-'+time(duration-audio.currentTime);
  $('.controls').setAttribute('aria-label',audio.paused ? '播放' : '暂停');
  $('.play').style.display = audio.paused ? 'block' : 'none';
  $('.pause').style.display = audio.paused ? 'none' : 'block';
  const next = player.lines().findLastIndex(([t]) => t<=audio.currentTime);
  if (next!==active) {
    $('.lyrics').children[active]?.classList.remove('active');
    const line = $('.lyrics').children[next];
    line?.classList.add('active');
    line?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    active = next;
  }
}
cover.onclick = () => input.click();
cover.onkeydown = e => {if (e.key==='Enter'||e.key===' ') {e.preventDefault();input.click();}};
input.onchange = () => {player.selectLocal([...input.files]);input.value='';};
$('.controls').onclick = player.togglePlayback;
$('.collapse').onclick = player.closePlayer;
window.addEventListener('keydown',e=>{if(e.key==='Escape')player.closePlayer();});
seek.oninput = () => {if (!seek.disabled) audio.currentTime=Number(seek.value);};
audio.addEventListener('trackchange',metadata);
audio.addEventListener('lyricschange',drawLyrics);
for (const event of ['play','pause','timeupdate','loadedmetadata','seeked','ended']) audio.addEventListener(event,update);
window.addEventListener('playeropen',()=>{metadata();drawLyrics();});
metadata();drawLyrics();
