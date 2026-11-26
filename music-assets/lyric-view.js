/* Both documents render the same timed lines against the same audio clock. */
function createLyricView(viewport, audio, visible = () => true) {
  let cues = [], active = -2, resume;
  const lines = document.createElement('div');
  lines.className = 'lyrics timed-lines';
  function center(animate) {
    const current = lines.children[Math.max(0,active)];
    if (!current || !visible()) return;
    const previous = viewport.scrollTop;
    viewport.scrollTop = current.offsetTop - viewport.clientHeight*.45 + current.offsetHeight/2;
    const shift = viewport.scrollTop-previous;
    for (const [i,row] of Array.from(lines.children).entries()) {
      row.getAnimations().forEach(animation => animation.cancel());
      const distance = i-active;
      if (!animate || !shift || Math.abs(distance)>8 || matchMedia('(prefers-reduced-motion: reduce)').matches) continue;
      row.animate([{transform:'translateY('+shift+'px)'},{transform:'translateY(0)'}],{
        duration:620, delay:Math.min(7,Math.max(0,distance+1))*60,
        easing:'cubic-bezier(.19,1,.22,1)',fill:'backwards'
      });
    }
  }
  function update(force = false) {
    if (!visible()) return;
    const next = cues.findLastIndex(([time]) => time <= audio.currentTime);
    if (!force && next === active) return;
    const adjacent = active >= -1 && Math.abs(next-active) <= 2;
    active = next;
    Array.from(lines.children).forEach((row,i) => {
      row.classList.toggle('active',i===active);
      row.style.setProperty('--blur',Math.min(3,Math.abs(i-active))+'px');
    });
    if (!resume) center(!force && adjacent);
  }
  function browse() {
    clearTimeout(resume);
    resume = setTimeout(() => { resume=null; center(true); },4000);
  }
  viewport.addEventListener('wheel',browse,{passive:true});
  viewport.addEventListener('touchmove',browse,{passive:true});
  viewport.addEventListener('keydown',e=>{if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End'].includes(e.key)) browse();});
  audio.addEventListener('timeupdate',()=>update());
  audio.addEventListener('seeked',()=>{clearTimeout(resume);resume=null;update(true);});
  new ResizeObserver(()=>update(true)).observe(viewport);
  return (next,message='暂无同步歌词') => {
    clearTimeout(resume);resume=null;active=-2;cues=next;
    lines.replaceChildren(...next.map(([,text])=>{
      const row=document.createElement('p');
      row.className='line';
      for (const part of text.split('\n')) {
        const span=document.createElement('span');span.textContent=part;row.append(span);
      }
      return row;
    }));
    viewport.replaceChildren(next.length ? lines : message);
    update(true);
  };
}
