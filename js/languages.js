/* Each entry keeps the original interface string alongside its two translations. */
(function () {
  var phrases = `
幽兰拿铁|Youlan Latte|幽蘭ラテ
幽兰拿铁的博客|Youlan Latte’s Blog|幽蘭ラテのブログ
跳到正文|Skip to content|本文へ
导航菜单|Navigation menu|ナビゲーション
站点导航|Site navigation|サイトナビ
首页|Home|ホーム
个人主页|Home|ホーム
个人介绍|About me|自己紹介
最近项目|Recent projects|最近のプロジェクト
音乐|Music|音楽
随机点名|Random name picker|ランダム指名
版本档案|Version archive|バージョン履歴
搜索 Bing|Search Bing|Bing で検索
搜索|Search|検索
深色主题|Dark mode|ダークモード
切换深色主题|Toggle dark mode|ダークモード切替
Python 开发者|Python developer|Python 開発者
我的 GitHub|My GitHub|私の GitHub
加载中…|Loading…|読み込み中…
公开仓库|Public repositories|公開リポジトリ
累计星标|Total stars|スター合計
技术栈|Technologies|技術スタック
GitHub 活跃度|GitHub activity|GitHub の活動
查看贡献记录 ↗|View contributions ↗|活動履歴を見る ↗
你好，我是幽兰拿铁。|Hi, I’m Youlan Latte.|こんにちは、幽蘭ラテです。
我用 Python 写小工具，也喜欢手绘和 Vocaloid 音乐。这里放着我的代码实践、听歌收藏，还有偶尔记下的旅行见闻。|I build small tools with Python and enjoy drawing and Vocaloid music. This is where I share my projects, favorite songs and occasional travel notes.|Python で小さなツールを作っています。絵とボカロが好きで、ここには制作記録やお気に入りの曲、ときどき旅の話を載せています。
想看看我最近在做什么，可以翻翻下面的项目。想一起听歌，就从《春日影》开始吧。|Browse my latest projects below, or start listening with Haruhikage.|最近の制作物は下の一覧からどうぞ。音楽は「春日影」から聴いてみてください。
常用入口|Quick links|ショートカット
去听歌|Listen to music|音楽を聴く
打开随机点名器|Open name picker|ランダム指名を開く
前往 GitHub 查看项目|View projects on GitHub|GitHub で見る
项目数据暂时无法加载。|Projects are temporarily unavailable.|プロジェクトを読み込めません。
暂无公开项目。|No public projects yet.|公開プロジェクトはまだありません。
准备抽取|Ready to draw|抽選の準備完了
随机抽取|Pick a name|抽選する
开始新一轮|Start a new round|新しいラウンド
本轮记录|This round|今回の履歴
抽中的名字会显示在这里。|Selected names appear here.|選ばれた名前がここに表示されます。
编辑名单|Edit names|名簿を編集
每行输入一个名字，同名可加学号区分。刷新页面后恢复默认名单。|Enter one name per line. Reloading restores the default list.|1 行に 1 人ずつ入力してください。再読み込みで既定の名簿に戻ります。
每行输入一个名字，同名可加学号。刷新页面后恢复默认名单。|Enter one name per line. Add an ID for duplicate names. Reloading restores the default list.|1 行に 1 人ずつ入力し、同姓同名には番号を付けてください。再読み込みで既定の名簿に戻ります。
名单里有重复条目，请用学号区分。|Use IDs to distinguish duplicate names.|同名の人は番号で区別してください。
请输入至少一位。|Enter at least one name.|少なくとも 1 人入力してください。
应用名单并开始新一轮|Apply list and start a round|名簿を適用して開始
共|Total|合計
位 · 待抽|· remaining|名 · 残り
位|people|名
欢迎|Welcome|ようこそ
欢迎来到幽兰拿铁的博客|Welcome to Youlan Latte’s blog|幽蘭ラテのブログへようこそ
进入博客 →|Enter blog →|ブログへ →
音乐主页|Music home|ミュージックホーム
跳到音乐播放器|Skip to music player|プレーヤーへ
博客首页|Blog home|ブログホーム
歌曲资料库|Music library|ライブラリ
搜索歌曲或艺人|Search songs or artists|曲やアーティストを検索
最近播放|Recently played|最近再生した曲
歌词|Lyrics|歌詞
同步歌词|Synced lyrics|同期歌詞
显示歌词|Show lyrics|歌詞を表示
加载歌词…|Loading lyrics…|歌詞を読み込み中…
暂无同步歌词|No synced lyrics|同期歌詞はありません
歌词暂时无法加载|Lyrics unavailable|歌詞を読み込めません
没有找到匹配的歌曲。试试歌名或艺人名。|No matches. Try a song or artist name.|曲が見つかりません。曲名やアーティスト名で検索してください。
直接打开当前音频 ↗|Open audio file ↗|音声ファイルを開く ↗
展开全屏播放器|Expand player|プレーヤーを拡大
全屏音乐播放器|Fullscreen music player|全画面プレーヤー
全屏播放器|Fullscreen player|全画面プレーヤー
收起播放器|Close player|プレーヤーを閉じる
随机播放|Shuffle|シャッフル
上一首|Previous track|前の曲
下一首|Next track|次の曲
单曲循环|Repeat track|リピート
静音|Mute|ミュート
播放进度|Playback position|再生位置
音量|Volume|音量
播放|Play|再生
暂停|Pause|一時停止
打开导航|Open navigation|メニューを開く
关闭导航|Close navigation|メニューを閉じる
本地音乐|Local music|ローカル音楽
选择本地音频、歌词或封面|Choose audio, lyrics or artwork|音声・歌詞・画像を選択
点击音乐图标选择音频和 lrc 文件|Choose an audio or LRC file|音声または LRC ファイルを選択
正在加载…|Loading…|読み込み中…
请再次点播放，或使用下方的直接播放入口。|Try playing again or open the audio file below.|もう一度再生するか、下のリンクから音声を開いてください。
音频加载失败，可重新点播放或直接打开音频。|Audio could not load. Retry or open the audio file.|音声を読み込めません。再生し直すか音声ファイルを開いてください。
点击提交编号可以浏览当时的代码，点击「下载 ZIP」可以保存该版本。|Select a commit to browse its source or download a ZIP to keep a copy.|コミットから当時のコードを閲覧できます。ZIP で保存することもできます。
全屏播放器的进度条缩短 10%，专辑封面放大 10%。滚轮浏览歌词时，普通和全屏模式都会清晰显示文字。站内锚点会避开吸顶导航，音乐页新增键盘直达播放器入口。|The expanded player has a shorter seek bar and larger artwork. Lyrics stay clear while scrolling. Anchors clear the header, and a keyboard shortcut leads to the player.|拡大表示のシークバーを短くし、ジャケットを拡大しました。スクロール中も歌詞が読みやすくなり、ページ内リンクとキーボード操作も改善しました。
手机打开主页时，肖像名片排在最前面。自我介绍标题进入视野时逐字显示，开启「减少动态效果」后会直接显示整句。|The profile comes first on mobile. The greeting types itself when visible and appears immediately with reduced motion.|スマートフォンではプロフィールを最初に表示します。挨拶は一文字ずつ表示され、動きを減らす設定では全文がすぐ表示されます。
点名器使用不重复抽取，支持自定义名单和本轮记录。音乐播放器移至首屏，站点导航与卡片更新为浮动玻璃样式。|The picker draws without repeats and supports custom lists and round history. The music player moved into view, with glass navigation and cards.|指名は重複なしで、名簿の編集と履歴表示に対応しました。プレーヤーの位置を変更し、ナビとカードにガラス調のデザインを採用しました。
主页、音乐、签到、欢迎页和版本档案使用同一套页面模板。签到支持批量学号、重复项去重和未识别输入反馈。|The home, music, attendance, welcome and archive pages adopted a shared template. Attendance gained bulk IDs, deduplication and input feedback.|各ページのテンプレートを統一し、出席確認は番号の一括入力、重複除去、入力エラーの通知に対応しました。
界面升级提交为|Interface update commit|UI 更新のコミット
。首页、班级签到及音乐页共用主题设置，修正了项目统计、无效导航和签到学号解析。|. Home, attendance and music shared a theme, with fixes for statistics, navigation and student ID parsing.|。テーマを共通化し、プロジェクト統計、ナビ、学籍番号の解析を修正しました。
记录按日期从新到旧排列。同一次提交只列一行，最后一栏标明它出现在哪些分支。|Commits are listed newest first. Each appears once, with branches in the final column.|新しい順に各コミットを一度ずつ掲載しています。最後の列はブランチです。
下载 ZIP|Download ZIP|ZIP をダウンロード
查看本版发布记录|Release notes|リリースノート
版本|Version|バージョン
提交|Commit|コミット
源码|Source|ソース
升级前主站|Original site|旧サイト
随机点名与播放器布局|Name picker and player layout|ランダム指名とプレーヤーの配置
页面重构|Page redesign|ページの再設計
早期界面升级|Early interface updates|初期の UI 更新
历史提交|Commit history|コミット履歴
日期（UTC）|Date (UTC)|日付（UTC）
原始说明|Original message|元の説明
分支|Branch|ブランチ
`.trim().split('\n');
  var dictionary = Object.create(null);
  phrases.forEach(function (line) { var cells=line.split('|'); dictionary[cells[0]]=cells.slice(1); });
  var originals=new WeakMap(), lang='zh-CN';
  try { lang=localStorage.getItem('site-language') || lang; } catch (_) {}
  function translate(source) {
    if (lang==='zh-CN') return source;
    var key=source.trim(), i=lang==='ja'?1:0;
    if(dictionary[key]) return source.replace(key,dictionary[key][i]);
    if (/^\d+ 号$/.test(key)) return lang==='ja'?key.replace(' 号',' 番'):'#'+parseInt(key,10);
    if (/^(播放|暂停).+/.test(key)) return key.replace(/^(播放|暂停)/,function (s){return dictionary[s][i]+' ';});
    if(key.indexOf(' · 幽兰拿铁')>0) return key.split(' · ').map(translate).join(' · ');
    return source;
  }
  function field(node,key) {
    var value=key==='text'?node.nodeValue:node.getAttribute(key);
    if(!value) return;
    var fields=originals.get(node)||{}, prev=fields[key];
    var source=prev && prev.output===value ? prev.source : value, output=translate(source);
    if(output===value && !prev) return;
    fields[key]={source:source,output:output}; originals.set(node,fields);
    if(output!==value) { if(key==='text') node.nodeValue=output; else node.setAttribute(key,output); }
  }
  function visit(node) {
    if(node.nodeType===3) { if(node.parentElement && !node.parentElement.closest('script,style,textarea,.timed-lines,.lyrics,.repo-item p')) field(node,'text'); return; }
    if(node.nodeType!==1 || /^(SCRIPT|STYLE|TEXTAREA)$/.test(node.tagName)) return;
    ['aria-label','placeholder','title','alt'].forEach(function(k){field(node,k);});
    for(var child=node.firstChild;child;child=child.nextSibling) visit(child);
  }
  function apply(code) {
    lang=['en','ja'].indexOf(code)>=0?code:'zh-CN';
    document.documentElement.lang=lang;
    var picker=document.querySelector('.language-picker');
    if(picker) picker.value=lang;
    visit(document.documentElement);
  }
  var observer=new MutationObserver(function(records){
    records.forEach(function(r){
      if(r.type==='attributes') field(r.target,r.attributeName);
      else if(r.type==='characterData') visit(r.target);
      else Array.prototype.forEach.call(r.addedNodes,visit);
    });
  });
  apply(lang);
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title','alt']});
  window.siteLanguage={apply:apply,get:function(){return lang;}};
  if(parent!==window && parent.siteLanguage) apply(parent.siteLanguage.get());
  document.addEventListener('change',function(e){
    if(!e.target.classList.contains('language-picker')) return;
    apply(e.target.value);
    try {localStorage.setItem('site-language',lang);} catch(_) {}
    if(parent!==window && parent.siteLanguage) parent.siteLanguage.apply(lang);
    var frame=document.querySelector('#full-player iframe');
    if(frame && frame.contentWindow.siteLanguage) frame.contentWindow.siteLanguage.apply(lang);
  });
  window.addEventListener('storage',function(e){if(e.key==='site-language') apply(e.newValue);});
})();
