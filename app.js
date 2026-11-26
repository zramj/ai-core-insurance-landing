/* AI CORE｜保險業務的 LINE AI 助理 — 互動
   1. 首屏聊天示範：轉傳訊息 → 助理整理 → 確認建立（三個情境輪流）
   2. 1 分鐘檢測：6 題 → 四種類型＋一年花多少小時 → 用 LINE 領取建議／早鳥
   3. 檢測答案匿名送到 Google 表單（設定好 FORM 才會送）
*/
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const wait = (ms) => new Promise((res) => setTimeout(res, reduce.matches ? 0 : ms));
  const LINE_ID = '%40732ntowu';
  const oa = (text) => `https://line.me/R/oaMessage/${LINE_ID}/?${encodeURIComponent(text)}`;

  /* ---------------- 首屏進場 ---------------- */
  const hero = $('.hero');
  if (hero) requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-in')));

  /* ---------------- 聊天示範 ---------------- */
  const chat = $('#chat');
  const dock = $('#dock');
  const SCENES = [
    {
      who: '王', from: '來自王先生的 LINE 訊息', text: '下週三下午有空，想再聊聊之前的保障內容。', btn: '轉傳給助理',
      me: '<span class="fw">轉傳｜王先生</span>下週三下午有空，想再聊聊之前的保障內容。',
      card: '整理好了，幫你確認一下：<dl class="rows"><dt>客戶</dt><dd>王先生</dd><dt>事項</dt><dd>再聊保障內容</dd><dt>時間</dt><dd>下週三下午 <span class="pending">（時間待確認）</span></dd><dt>提醒</dt><dd>明天 09:00 提醒你回覆</dd></dl>',
      done: '已建立。明天 09:00 會提醒你回覆王先生。', next: '再試一則：見完客戶的語音'
    },
    {
      who: '錄', from: '見完陳小姐，在車上錄一段語音', text: '語音 0:42', voice: true, btn: '傳給助理',
      me: '<span class="mic" aria-hidden="true"></span>語音 0:42',
      card: '<b>會談紀錄｜陳小姐</b><dl class="rows"><dt>重點</dt><dd>想加強醫療保障</dd><dt>補件</dt><dd>還缺身分證影本</dd><dt>下一步</dt><dd>週五前提醒她補件</dd></dl>',
      done: '已存進陳小姐的紀錄，週四晚上提醒你。', next: '再試一則：見客戶前問助理'
    },
    {
      who: '問', from: '出門見王先生前，問一句', text: '王先生上次聊什麼？', btn: '問助理',
      me: '王先生上次聊什麼？',
      answer: '上次（10 月）聊到想加強醫療保障；他剛剛說下週三下午有空。<br><b>還沒處理</b>：回覆確認時間。',
      next: '重新看一次'
    }
  ];
  let scene = 0;
  let busy = false;

  const bubble = (cls, html) => {
    const el = document.createElement('div');
    el.className = `b ${cls} in`;
    el.innerHTML = html;
    chat.appendChild(el);
    while (chat.children.length > 8) chat.removeChild(chat.firstChild);
    return el;
  };
  const greet = () => {
    bubble('b--bot', '<b>早安，今天 2 件事</b><br>・提醒陳小姐補件（已 3 天）<br>・張太太週六生日');
    bubble('b--bot', '客戶交代的新事情，轉傳給我就好。');
  };
  const steps = () => `<div class="dock__steps" aria-hidden="true">${SCENES.map((_, i) => `<span class="${i === scene ? 'on' : ''}"></span>`).join('')}</div>`;

  const showDock = () => {
    const s = SCENES[scene];
    dock.innerHTML = `
      <div class="share"><span class="share__icon" aria-hidden="true">${s.who}</span><p><small>${s.from}</small>${s.voice ? '<span class="b--voice"><span class="mic" aria-hidden="true"></span>語音 0:42</span>' : s.text}</p></div>
      <button class="dock__btn${scene === 0 ? ' dock__btn--first' : ''}" type="button" data-act="send">${s.btn}</button>`;
  };
  const showHint = (text) => { dock.innerHTML = `<p class="dock__hint">${text}</p>${steps()}`; };
  const showNext = () => {
    const s = SCENES[scene];
    dock.innerHTML = `<button class="dock__btn dock__btn--ghost" type="button" data-act="next">${s.next}</button>${steps()}`;
  };

  const typing = async (ms) => {
    const t = document.createElement('div');
    t.className = 'typing in';
    t.setAttribute('aria-label', '助理正在輸入');
    t.innerHTML = '<i></i><i></i><i></i>';
    chat.appendChild(t);
    await wait(ms);
    t.remove();
  };

  const send = async () => {
    if (busy) return;
    busy = true;
    const s = SCENES[scene];
    bubble(`b--me${s.voice ? ' b--voice' : ''}`, s.me);
    showHint('助理整理中…');
    await typing(1000);
    if (s.answer) {
      bubble('b--bot', s.answer);
      showNext();
      busy = false;
      $('[data-act="next"]', dock).focus({ preventScroll: true });
      return;
    }
    const card = bubble('b--bot b--card', `${s.card}<button class="cbtn" type="button" data-act="confirm">確認建立</button>`);
    showHint('按「確認建立」，才會存下來。');
    busy = false;
    $('.cbtn', card).focus({ preventScroll: true });
  };

  const confirm = async (btn) => {
    if (busy) return;
    busy = true;
    btn.disabled = true;
    btn.textContent = '已確認';
    await typing(600);
    bubble('b--bot', SCENES[scene].done);
    showNext();
    busy = false;
    $('[data-act="next"]', dock).focus({ preventScroll: true });
  };

  const next = () => {
    scene = (scene + 1) % SCENES.length;
    if (scene === 0) { chat.innerHTML = ''; greet(); }
    showDock();
    $('[data-act="send"]', dock).focus({ preventScroll: true });
  };

  if (chat && dock) {
    greet();
    showDock();
    dock.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'send') send();
      if (b.dataset.act === 'next') next();
    });
    chat.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act="confirm"]');
      if (b && !b.disabled) confirm(b);
    });
  }

  /* ---------------- 1 分鐘檢測 ---------------- */
  // 匿名記錄：拿到「預先填入連結」後填入 action 與 entry 代碼；留空則不送出
  const FORM = {
    action: '',
    entries: { where: '', pain: '', hours: '', miss: '', worry: '', price: '', type: '', version: '' }
  };
  const VERSION = 'insurance-v3';

  const QUESTIONS = [
    { k: 'where', q: '客戶的資料和約定，主要記在哪裡？', o: ['大多在 LINE 對話裡', '紙本或手機備忘錄', 'Excel 或公司系統', '主要靠記憶'] },
    { k: 'pain', q: '最困擾你的是哪一件？', o: ['見完客戶要補紀錄', 'LINE 訊息太多，找不到之前說過的事', '補件追蹤', '生日、保單週年的提醒', '見客戶前要翻找資料'] },
    { k: 'hours', q: '每週大概花多少時間整理客戶資料和提醒？', o: ['1 小時內', '1–3 小時', '3–5 小時', '5 小時以上'] },
    { k: 'miss', q: '最近三個月，有沒有因為忘記，影響到客戶？', o: ['沒有', '1–2 次', '3 次以上', '不確定'] },
    { k: 'worry', q: '把客戶資料交給 AI 整理，你最擔心什麼？', o: ['個資安全', '公司規定不允許', 'AI 弄錯', '操作麻煩', '費用'] },
    { k: 'price', q: '這樣的 LINE AI 助理，每月多少你覺得合理？', o: ['要免費才會用', '300 元以內', '300–800 元', '800–1,500 元', '1,500 元以上'] }
  ];
  const TYPES = [
    { key: 'line-archaeology', name: 'LINE 考古型', diag: '客戶說過的事都在 LINE 裡，要找就得一直往上滑。訊息一多，約好的事就被洗掉了。' },
    { key: 'sticky-notes', name: '便條紙滿天飛型', diag: '記在紙本、備忘錄、行事曆，散在好幾個地方。要找的時候，得先想起來記在哪。' },
    { key: 'overtime', name: '下班還在整理型', diag: '你有認真用表格或系統記，但整理很花時間，常常要下班後再補。' },
    { key: 'memory', name: '記憶力硬撐型', diag: '大部分都記在腦子裡。平常沒問題，一忙起來就容易漏。' }
  ];
  const TIPS = [
    '見完客戶，在車上先錄一段 1 分鐘語音，回家再整理也不怕忘。',
    '建一個只有自己的 LINE 群組，客戶交代的事當下就轉傳進去，之後只看那裡。',
    '每一筆補件都寫上期限，每週一早上看一次還沒收到的。',
    '把生日和保單週年一次輸入手機行事曆，設成提前 3 天提醒。',
    '每次見完客戶，留一句「下次要聊什麼」，下次見面前看這一句就好。'
  ];
  const SAFE = [
    'AI 助理只處理你主動轉傳的內容，不會讀取你的 LINE；資料放在哪裡，導入前會先跟你確認。',
    '導入前會先確認你所屬公司的規定，必要時只記錄代稱或必要資訊。',
    '助理整理的每一筆，都要你確認後才會建立。',
    '就是在 LINE 轉傳或傳語音，不用學新的 App。',
    '早鳥方案會依你需要的功能報價，先聊清楚再決定。'
  ];
  const HOURS = [0.5, 2, 4, 6];

  const q = {
    step: $('#qStep'), result: $('#qResult'), count: $('#qCount'), bar: $('#qBar'), title: $('#qTitle'),
    opts: $('#qOpts'), back: $('#qBack'), restart: $('#qRestart'),
    rType: $('#rType'), rDiag: $('#rDiag'), rHours: $('#rHours'), rMiss: $('#rMiss'), rTip: $('#rTip'), rSafe: $('#rSafe'), rLine: $('#rLine'), rQr: $('#rQr')
  };
  if (!q.step) return;
  let idx = 0;
  let answers = [];
  let locked = false;

  const render = (animate) => {
    const item = QUESTIONS[idx];
    q.count.textContent = `第 ${idx + 1} 題／共 ${QUESTIONS.length} 題`;
    q.bar.style.setProperty('--p', (idx + 1) / QUESTIONS.length);
    q.title.textContent = item.q;
    q.opts.innerHTML = item.o.map((o, n) =>
      `<button class="qopt${answers[idx] === n ? ' is-on' : ''}" type="button" data-n="${n}" aria-pressed="${answers[idx] === n}">${o}</button>`).join('');
    q.back.hidden = idx === 0;
    if (animate && !reduce.matches) { q.step.classList.remove('is-swap'); void q.step.offsetWidth; q.step.classList.add('is-swap'); }
  };

  const record = (type) => {
    if (!FORM.action) return;
    try {
      const body = new URLSearchParams();
      QUESTIONS.forEach((item, i) => { if (FORM.entries[item.k]) body.append(FORM.entries[item.k], item.o[answers[i]]); });
      if (FORM.entries.type) body.append(FORM.entries.type, type);
      if (FORM.entries.version) body.append(FORM.entries.version, VERSION);
      fetch(FORM.action, { method: 'POST', mode: 'no-cors', body }).catch(() => {});
    } catch (e) { /* 記錄失敗不影響頁面 */ }
  };

  const showResult = () => {
    const t = TYPES[answers[0]];
    q.rType.textContent = t.name;
    q.rDiag.textContent = t.diag;
    q.rHours.textContent = String(Math.round(HOURS[answers[2]] * 50));
    q.rMiss.hidden = answers[3] !== 2;
    q.rMiss.textContent = '最近三個月漏掉 3 次以上，代表現在的方法已經不太夠用了。';
    q.rTip.textContent = TIPS[answers[1]];
    q.rSafe.textContent = SAFE[answers[4]];
    q.rLine.href = oa(t.name);
    q.rQr.src = `assets/qr/qr-${t.key}.svg`;
    q.step.hidden = true;
    q.result.hidden = false;
    const top = $('#qcard').getBoundingClientRect().top;
    if (top < 0) window.scrollBy({ top: top - 16, behavior: reduce.matches ? 'auto' : 'smooth' });
    q.rType.focus({ preventScroll: true });
    record(t.name);
  };

  q.opts.addEventListener('click', (e) => {
    const b = e.target.closest('.qopt');
    if (!b || locked) return;
    locked = true;
    answers[idx] = Number(b.dataset.n);
    $$('.qopt', q.opts).forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    setTimeout(() => {
      locked = false;
      if (idx < QUESTIONS.length - 1) { idx += 1; render(true); q.title.focus({ preventScroll: true }); }
      else showResult();
    }, reduce.matches ? 0 : 260);
  });
  q.back.addEventListener('click', () => { if (idx > 0) { idx -= 1; render(true); q.title.focus({ preventScroll: true }); } });
  q.restart.addEventListener('click', () => {
    idx = 0; answers = [];
    q.result.hidden = true; q.step.hidden = false;
    render(true); q.title.focus({ preventScroll: true });
  });
  render(false);
})();
