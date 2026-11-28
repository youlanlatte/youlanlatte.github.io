/* Position each line independently, as in MusicPlayer-main's UpdateLyricsLayout. */
function createStageLyrics(viewport, audio, visible) {
  const stage = viewport.querySelector('.lyrics');
  let cues = [], active = -2;
  let resume;
  function endBrowse() {
    clearTimeout(resume);
    resume = null;
    viewport.classList.remove('browsing');
    viewport.scrollTop = 0;
  }
  function browse() {
    if (!cues.length) return;
    if (!resume) {
      const row = stage.children[Math.max(0,active)];
      const before = row.getBoundingClientRect().top;
      viewport.classList.add('browsing');
      viewport.scrollTop += row.getBoundingClientRect().top - before;
    }
    clearTimeout(resume);
    resume = setTimeout(() => { endBrowse(); position(true); },4000);
  }
  viewport.addEventListener('wheel',browse,{passive:true});
  viewport.addEventListener('touchstart',browse,{passive:true});
  viewport.addEventListener('touchmove',browse,{passive:true});
  viewport.addEventListener('keydown',event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End'].includes(event.key)) browse();
  });
  function position(snap = false) {
    if (!visible() || !cues.length) return;
    let next = cues.length - 1;
    while (next >= 0 && cues[next][0] > audio.currentTime) next--;
    if (next === active && !snap) return;
    const nodes = [...stage.children];
    const heights = nodes.map(node => node.offsetHeight + 20);
    let y = viewport.clientHeight / 3.5 - heights.slice(0,Math.max(0,next)).reduce((a,b)=>a+b,0);
    const instant = snap || matchMedia('(prefers-reduced-motion: reduce)').matches;
    nodes.forEach((node,i) => {
      const distance = i-next;
      const step = distance+1;
      const delay = step>0 && step<=10 ? step*60 : 0;
      node.style.transitionDuration = instant ? '0s' : '.7s';
      node.style.transitionDelay = instant ? '0s' : delay+'ms, 0ms, 0ms';
      node.style.transform = 'translateY('+y+'px)';
      node.style.filter = 'blur('+Math.min(3,Math.abs(distance))+'px)';
      node.classList.toggle('active',i===next);
      y += heights[i];
    });
    active = next;
  }
  audio.addEventListener('timeupdate',()=>position());
  audio.addEventListener('seeked',()=>position(true));
  if ('ResizeObserver' in window) new ResizeObserver(()=>position(true)).observe(viewport);
  return rows => {
    endBrowse();
    cues=rows; active=-2;
    stage.replaceChildren(...rows.map(([,text])=>{
      const item=document.createElement('div');
      item.className='item line';
      text.split('\n').forEach((part,index)=>{
        const line=document.createElement('p');
        if(index) line.className='translation';
        line.textContent=part; item.append(line);
      });
      return item;
    }));
    if (!rows.length) stage.textContent='暂无同步歌词';
    position(true);
  };
}
