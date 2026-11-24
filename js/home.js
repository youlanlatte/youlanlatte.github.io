const menu = document.querySelector('#sideMenu');
const toggle = document.querySelector('#menuToggle');
const overlay = document.querySelector('#overlay');
function showMenu(open) {
  menu.hidden = !open;
  overlay.hidden = !open;
  menu.setAttribute('aria-hidden', String(!open));
  toggle.setAttribute('aria-expanded', String(open));
}
showMenu(false);
toggle.onclick = () => showMenu(menu.hidden);
overlay.onclick = () => showMenu(false);
menu.onclick = () => showMenu(false);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) {
    showMenu(false);
    toggle.focus();
  }
});
