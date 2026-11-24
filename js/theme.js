const theme = document.querySelector('#themeToggle');
function applyTheme(dark) {
  document.body.classList.toggle('dark-mode', dark);
  theme.setAttribute('aria-pressed', String(dark));
}
const saved = localStorage.getItem('darkMode');
applyTheme(saved === null ? matchMedia('(prefers-color-scheme: dark)').matches : saved === 'true');
theme.onclick = () => {
  const dark = !document.body.classList.contains('dark-mode');
  applyTheme(dark);
  localStorage.setItem('darkMode', dark);
};
