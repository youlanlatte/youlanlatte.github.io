const students = [
    { id: 1, name: '田芷妍', gender: '女' },
    { id: 2, name: '张紫依', gender: '女' },
    { id: 3, name: '肖锦鸿', gender: '男' },
    { id: 4, name: '卢诗涵', gender: '女' },
    { id: 5, name: '皮晶瑞', gender: '女' },
    { id: 6, name: '杨卿雨', gender: '女' },
    { id: 7, name: '李博宇', gender: '男' },
    { id: 8, name: '李诗钰', gender: '女' },
    { id: 9, name: '苏笑宇', gender: '女' },
    { id: 10, name: '张歆钥', gender: '女' },
    { id: 11, name: '肖茜匀', gender: '女' },
    { id: 12, name: '苏先亮', gender: '男' },
    { id: 13, name: '田芙蓉', gender: '女' },
    { id: 14, name: '丁诗涵', gender: '女' },
    { id: 15, name: '付雨昕', gender: '女' },
    { id: 16, name: '聂又琪', gender: '女' },
    { id: 17, name: '褚帅虎', gender: '男' },
    { id: 18, name: '孙哲涵', gender: '男' },
    { id: 19, name: '田青林', gender: '男' },
    { id: 20, name: '李靖宇', gender: '男' },
    { id: 21, name: '刘雨露', gender: '女' },
    { id: 22, name: '高训华', gender: '男' },
    { id: 23, name: '魏宇哲', gender: '男' },
    { id: 24, name: '丁振宇', gender: '男' },
    { id: 25, name: '张伊凡', gender: '男' },
    { id: 26, name: '胡一依', gender: '女' },
    { id: 27, name: '王俊淇', gender: '男' },
    { id: 28, name: '卢亦萱', gender: '女' },
    { id: 29, name: '田瑞', gender: '女' },
    { id: 30, name: '谭欣怡', gender: '女' },
    { id: 31, name: '杨典昭', gender: '男' },
    { id: 32, name: '高星蕊', gender: '女' },
    { id: 33, name: '罗陈龙', gender: '男' },
    { id: 34, name: '曾益蓉', gender: '女' },
    { id: 35, name: '王铭翔', gender: '男' },
    { id: 36, name: '盛艺林', gender: '女' },
    { id: 37, name: '袁子怡', gender: '女' },
    { id: 38, name: '张卉妍', gender: '女' },
    { id: 39, name: '刘响瑞', gender: '男' },
    { id: 40, name: '李泽宇', gender: '男' },
    { id: 41, name: '姚俊涵', gender: '女' },
    { id: 42, name: '熊辰逸', gender: '男' },
    { id: 43, name: '周阮航', gender: '男' },
    { id: 44, name: '徐子涵', gender: '女' },
    { id: 45, name: '邓雨泽', gender: '男' },
    { id: 46, name: '高意洋', gender: '男' }
  ];
const list = document.querySelector('#studentList');
const summary = document.querySelector('#attendance-summary');
const input = document.querySelector('#studentId');
const known = new Set(students.map(student => student.id));

function render(present) {
  const rows = students.map(student => {
    const row = document.createElement('li');
    const arrived = present.has(student.id);
    row.className = arrived ? 'present' : 'absent';
    row.textContent = student.id + '. ' + student.name + ' (' + student.gender + ') · ' + (arrived ? '已到' : '未到');
    return row;
  });
  list.replaceChildren(...rows);
}

document.querySelector('#signInForm').addEventListener('submit', event => {
  event.preventDefault();
  const tokens = input.value.trim().split(/[\s,，、]+/u).filter(Boolean);
  const present = new Set();
  const invalid = new Set();
  for (const token of tokens) {
    const id = Number(token);
    if (/^\d+$/.test(token) && known.has(id)) present.add(id);
    else invalid.add(token);
  }
  render(present);
  const absent = students.filter(student => !present.has(student.id)).map(student => student.id);
  summary.textContent = '已到 ' + present.size + ' 人，未到 ' + absent.length + ' 人。'
    + (absent.length ? '未到学号：' + absent.join('、') + '。' : '全员已到。')
    + (invalid.size ? '未识别：' + [...invalid].join('、') : '');
});
render(new Set());
