import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {GlassButton, GlassCard, GlassInput, GlassMenu, GlassSheet, GlassSlider, GlassSwitch} from '@zakisheriff/liquid-glass';
import '@zakisheriff/liquid-glass/styles.css';
import './layout.css';

function HeaderTools() {
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark');
  useEffect(() => {
    const sync = () => setDark(document.documentElement.dataset.theme === 'dark');
    document.addEventListener('blog-theme', sync);
    sync();
    return () => document.removeEventListener('blog-theme', sync);
  }, []);
  return <>
    <form className="bing-search" action="https://www.bing.com/search" target="_blank" rel="noopener">
      <GlassInput aria-label="搜索 Bing" type="search" name="q" placeholder="搜索 Bing" required value={query} onChange={e => setQuery(e.target.value)}/>
      <GlassButton size="sm" type="submit">搜索</GlassButton>
    </form>
    <GlassSwitch aria-label="深色主题" checked={dark} onChange={value => document.dispatchEvent(new CustomEvent('choose-theme', {detail:value}))}/>
  </>;
}

function Caller() {
  const [names,setNames] = useState(() => Array.from({length:46}, (_,i) => (i+1)+' 号'));
  const [history,setHistory] = useState([]);
  const [open,setOpen] = useState(false);
  const [draft,setDraft] = useState(names.join('\n'));
  const [message,setMessage] = useState('');
  const remaining = names.filter(name => !history.includes(name));
  function apply(event) {
    event.preventDefault();
    const next = draft.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (!next.length || next.length !== new Set(next).size) {
      setMessage(next.length ? '名单里有重复条目，请用学号区分。' : '请输入至少一位。');
      return;
    }
    setNames(next); setHistory([]); setOpen(false);
  }
  return <>
    <GlassCard className="draw-stage" padding="clamp(30px,6vw,76px) 20px">
      <h1>随机点名</h1><p>剩余 {remaining.length} / {names.length}</p>
      <output id="draw-result" aria-live="polite">{history.at(-1) || '准备抽取'}</output>
      <div className="draw-actions">
        <GlassButton variant="filled" tint="#66538c" disabled={!remaining.length} onClick={() => setHistory([...history,remaining[Math.floor(Math.random()*remaining.length)]])}>随机抽取</GlassButton>
        <GlassButton disabled={!history.length} onClick={() => setHistory([])}>开始新一轮</GlassButton>
      </div>
    </GlassCard>
    <GlassCard className="draw-settings"><h2>本轮记录</h2>
      {history.length ? <ol id="history">{history.map(name => <li key={name}>{name}</li>)}</ol> : <p>还没有抽取记录</p>}
      <GlassButton size="sm" onClick={() => {setDraft(names.join('\n'));setMessage('');setOpen(true);}}>编辑名单</GlassButton>
    </GlassCard>
    <GlassSheet open={open} onClose={() => setOpen(false)} aria-label="编辑名单">
      <form id="roster-form" onSubmit={apply}>
        <label htmlFor="roster">每行一位，同名可加学号区分。名单仅在本页使用。</label>
        <GlassCard padding="0" radius="16px" className="roster-surface"><textarea id="roster" rows="7" required value={draft} onChange={e => setDraft(e.target.value)}/></GlassCard>
        <GlassButton type="submit" variant="filled">应用名单并开始新一轮</GlassButton>
        <p role="status">{message}</p>
      </form>
    </GlassSheet>
  </>;
}

function MediaSlider({audio, volume}) {
  const read = () => volume ? audio.volume : audio.currentTime;
  const [value,setValue] = useState(read);
  const [duration,setDuration] = useState(audio.duration);
  useEffect(() => {
    const sync = () => {setValue(read());setDuration(audio.duration);};
    const events = volume ? ['volumechange'] : ['timeupdate','durationchange','loadedmetadata','emptied'];
    events.forEach(name => audio.addEventListener(name,sync));
    sync();
    return () => events.forEach(name => audio.removeEventListener(name,sync));
  },[audio,volume]);
  const ready = volume || Number.isFinite(duration) && duration > 0;
  const press = useRef(null);
  const max = volume ? 1 : ready ? duration : 1;
  function change(next) {
    if (!ready) return;
    if (volume) audio.volume = next;
    else audio.currentTime = next;
    setValue(next);
  }
  function finishTap(event) {
    const start = press.current;
    press.current = null;
    if (!start || start.id !== event.pointerId || start.moved || !ready) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    change(fraction * max);
  }
  return <div
    onPointerDownCapture={e => {if (e.isPrimary && e.button === 0) press.current = {id:e.pointerId,x:e.clientX,moved:false};}}
    onPointerMoveCapture={e => {if (press.current && Math.abs(e.clientX-press.current.x)>3) press.current.moved=true;}}
    onPointerCancel={() => {press.current=null;}} onPointerUp={finishTap}>
    <GlassSlider aria-label={volume ? '音量' : '播放进度'} value={value} min={0} max={max}
      step={volume ? 0.01 : 0.1} disabled={!ready} tint="#ec94af" onChange={change}/>
  </div>;
}

function PlayButton({audio, tile=false}) {
  const [paused,setPaused] = useState(audio.paused);
  useEffect(() => {
    const sync = () => setPaused(audio.paused);
    const events = ['play','pause','ended','emptied'];
    events.forEach(name => audio.addEventListener(name,sync));
    return () => events.forEach(name => audio.removeEventListener(name,sync));
  },[audio]);
  const toggle = () => document.dispatchEvent(new Event('toggle-playback'));
  const label = paused ? '播放春日影' : '暂停春日影';
  if (tile) return <GlassButton className="song-tile" aria-label={label} onClick={toggle}>
    <span className="art"><img src="music-assets/icons/trackIcon.svg" alt=""/></span>
    <strong className="cardTitle">春日影</strong><span className="cardDesc">MyGO!!!!!</span>
  </GlassButton>;
  return <GlassButton size="sm" aria-label={label} icon={paused ? '▶' : 'Ⅱ'} onClick={toggle}/>;

}

function LibrarySearch() {
  const [query,setQuery] = useState('');
  useEffect(() => {
    const found = '春日影 mygo!!!!!'.includes(query.trim().toLowerCase());
    document.querySelector('#song').hidden = !found;
    document.querySelector('#no-results').hidden = found;
  },[query]);
  return <GlassInput type="search" aria-label="搜索歌曲或艺人" placeholder="搜索歌曲或艺人" value={query} onChange={e => setQuery(e.target.value)}/>;
}

// Enhance the links emitted by Jekyll and the asynchronous project list.
function mountLinks(container) {
  for (const link of container.querySelectorAll('a[href]')) {
    if (link.closest('[data-glass-ui], [data-glass-link]')) continue;
    const host = document.createElement('span');
    host.dataset.glassLink = '';
    const icon = link.querySelector('img');
    const variant = link.matches('.github-btn') ? 'tinted-filled' : 'clear';
    link.replaceWith(host);
    createRoot(host).render(<GlassButton href={link.getAttribute('href')} target={link.target || undefined}
      rel={link.rel || undefined} id={link.id || undefined} className={link.className}
      size="sm" variant={variant} icon={icon && <img src={icon.src} alt=""/>}>
      {link.textContent.trim()}
    </GlassButton>);
  }
}
mountLinks(document);
document.addEventListener('links-ready', event => mountLinks(event.target));

for (const element of document.querySelectorAll('[data-glass-ui]')) {
  const audio = document.querySelector('audio');
  const type = element.dataset.glassUi;
  const root = createRoot(element);
  if (type === 'navigation') {
    const items = Array.from(element.querySelectorAll('nav a'), a => ({
      label:a.textContent, onSelect:() => window.location.assign(a.href)
    }));
    root.render(<GlassMenu aria-label="导航菜单" icon="☰" size="sm" align="start" items={items}/>);
  }
  if (type === 'open-menu' || type === 'close-menu') {
    const open = type === 'open-menu';
    root.render(<GlassButton size="sm" icon={open ? '☰' : '×'} aria-label={open ? '打开导航' : '关闭导航'}
      aria-controls="library-nav" aria-expanded={open ? false : undefined}
      onClick={() => document.dispatchEvent(new CustomEvent('music-menu',{detail:open}))}/>);
  }
  if (type === 'song') root.render(<PlayButton audio={audio} tile/>);
  if (type === 'header') root.render(<HeaderTools/>);
  if (type === 'play') root.render(<PlayButton audio={audio}/>);
  if (type === 'music-search') root.render(<LibrarySearch/>);
  if (type === 'caller') root.render(<Caller/>);
  if (type === 'volume' || type === 'seek') root.render(<MediaSlider audio={audio} volume={type==='volume'}/>);
}
