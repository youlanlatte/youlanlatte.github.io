const rosterInput = document.querySelector('#roster');
const historyList = document.querySelector('#history');
const result = document.querySelector('#draw-result');
const remaining = document.querySelector('#remaining');
const draw = document.querySelector('#draw');
const restart = document.querySelector('#restart');
const message = document.querySelector('#roster-message');

let roster = Array.from({ length: 46 }, (_, index) => (index + 1) + ' 号');
let pool = [];
rosterInput.value = roster.join('\n');

function updateControls() {
  remaining.textContent = '剩余 ' + pool.length + ' / ' + roster.length;
  draw.disabled = pool.length === 0;
  restart.disabled = pool.length === roster.length;
  document.querySelector('#empty-history').hidden = historyList.childElementCount > 0;
}

function newRound() {
  pool = [...roster];
  historyList.replaceChildren();
  result.textContent = '准备抽取';
  message.textContent = '';
  updateControls();
}

draw.addEventListener('click', () => {
  if (!pool.length) return;
  const index = Math.floor(Math.random() * pool.length);
  const [person] = pool.splice(index, 1);
  const item = document.createElement('li');
  item.textContent = person;
  historyList.append(item);
  result.textContent = person;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    result.animate([{ opacity: 0.4, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220 });
  }
  updateControls();
  if (!pool.length) restart.focus();
});
restart.addEventListener('click', newRound);
document.querySelector('#roster-form').addEventListener('submit', event => {
  event.preventDefault();
  const names = rosterInput.value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (!names.length || new Set(names).size !== names.length) {
    message.textContent = names.length ? '名单里有重复条目，请用学号区分。' : '请输入至少一位。';
    return;
  }
  roster = names;
  newRound();
  message.textContent = '已应用 ' + names.length + ' 位。';
});
newRound();
