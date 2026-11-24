const themeButton = document.querySelector('#themeToggle');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
let preference = null;
try {
  preference = localStorage.getItem('darkMode');
} catch {
  // Private browsing may disable persistent storage.
}
function renderTheme() {
  const dark = preference === null ? systemTheme.matches : preference === 'true';
  document.body.classList.toggle('dark-mode', dark);
  themeButton.setAttribute('aria-pressed', String(dark));
}
renderTheme();
themeButton.hidden = false;
themeButton.onclick = () => {
  preference = String(!document.body.classList.contains('dark-mode'));
  renderTheme();
  try { localStorage.setItem('darkMode', preference); } catch { /* Keep this tab's choice. */ }
};
systemTheme.addEventListener('change', renderTheme);
window.addEventListener('storage', event => {
  if (event.key === 'darkMode' || event.key === null) {
    preference = event.newValue;
    renderTheme();
  }
});
const navigation = document.querySelector('.site-menu');
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) || event.target.closest('nav a')) navigation.open = false;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.open) {
    navigation.open = false;
    navigation.querySelector('summary').focus();
  }
});
