/* AI CORE｜Insurance Landing Page V1 — 互動腳本
   - Hero：進場一次
   - #clarity：整理過程（進入畫面自動播放一次；可點步驟、可重播）
   - #workbench：保戶工作台概念展示（預設資料，不連線、不儲存）
*/
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const wait = (ms) => new Promise((res) => setTimeout(res, reduce.matches ? 0 : ms));

  /* ---------------- Hero 進場 ---------------- */
  const hero = $('.hero[data-enter]');
  if (hero) requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-in')));

  /* ---------------- 02 整理過程 ---------------- */
  // 每個物件在各階段的位置：[x(cqw), y(cqh), 旋轉, 縮放, 透明度, z, 延遲(ms)]
  const H = null; // 隱藏用占位
  const WIDE = {
    0: { f1: [2, 5, 0, 1, 1, 3], f2: [56, 0, 0, .9, .75, 1], f3: [36, 27, 0, 1.04, 1, 4], f4: [6, 47, 0, .92, .8, 2], f5: [60, 44, 0, 1, 1, 3], f6: [34, 71, 0, 1.06, 1, 5] },
    1: { f1: [5, 3], f2: [53, 3], f3: [5, 33], f4: [53, 33], f5: [5, 63], f6: [53, 63] },
    2: { f1: [5, 3], f2: [53, 3], f3: [5, 33], f4: [53, 33], f5: [5, 63], f6: [53, 63] },
    3: { L1: [0, 0], L2: [34.5, 0], L3: [69, 0], f1: [0, 11, 0, .84], f2: [0, 31, 0, .84], f3: [34.5, 11, 0, .84], f4: [34.5, 30, 0, .84], f5: [69, 11, 0, .84], f6: [69, 34, 0, .9] },
    4: { L1: [0, 0], L2: [34.5, 0], L3: [69, 0],
         f1: [0, 11, 0, .84, .36], f2: [0, 31, 0, .84, .36], f3: [34.5, 11, 0, .84, .36], f4: [34.5, 30, 0, .84, .36], f5: [69, 11, 0, .84, .36], f6: [69, 74, 0, .9, 1, 3],
         T1: [0, 52, 0, 1, 1, 6, 250], T2: [34.5, 52, 0, 1, 1, 6, 350], T3: [69, 52, 0, 1, 1, 6, 450] }
  };
  const TALL = {
    0: { f1: [0, 2, 0, 1, 1, 3], f2: [46, 14, 0, .9, .75, 1], f3: [4, 33, 0, 1.02, 1, 4], f4: [44, 50, 0, .9, .8, 2], f5: [2, 68, 0, 1, 1, 3], f6: [62, 78, 0, 1.04, 1, 5] },
    1: { f1: [0, 2, 0, .8], f2: [51, 2, 0, .8], f3: [0, 33, 0, .8], f4: [51, 33, 0, .8], f5: [0, 64, 0, .8], f6: [51, 64, 0, .8] },
    2: { f1: [0, 2, 0, .8], f2: [51, 2, 0, .8], f3: [0, 33, 0, .8], f4: [51, 33, 0, .8], f5: [0, 64, 0, .8], f6: [51, 64, 0, .8] },
    3: { L1: [0, 0], L2: [0, 33.5], L3: [0, 67], f1: [0, 10, 0, .7], f2: [51, 10, 0, .74], f3: [0, 43.5, 0, .74], f4: [51, 43.5, 0, .7], f5: [0, 77, 0, .68], f6: [53, 77, 0, .8] },
    4: { L1: [0, 0], L2: [0, 33.5], L3: [0, 67],
         f1: [0, 10, 0, .7, 0], f2: [51, 10, 0, .74, 0], f3: [0, 43.5, 0, .74, 0], f4: [51, 43.5, 0, .7, 0], f5: [0, 77, 0, .68, 0], f6: [53, 77, 0, .8, 0],
         T1: [0, 10.5, 0, 1, 1, 6, 200], T2: [0, 44, 0, 1, 1, 6, 300], T3: [0, 77.5, 0, 1, 1, 6, 400] }
  };
  const DESC = [
    '平常的樣子：資訊散在各處，只能靠記憶。',
    '訊息、筆記、行事曆，集中到同一個地方。',
    '找出是哪位客戶、什麼時間、要處理什麼。',
    '依保戶歸檔，每個人的服務紀錄一目了然。',
    '每位保戶，都有一件清楚的下一步。'
  ];

  const clarity = $('#clarity');
  const stage = $('#stage');
  if (clarity && stage) {
    const items = $$('[data-k]', stage);
    const steps = $$('.step', clarity);
    const desc = $('#clarityDesc');
    let current = -1;
    let layout = '';

    const hiddenSpec = (k, s, table) => {
      // 尚未出現的車道與待辦：停在它們第一次出現的位置附近，透明
      for (let i = s; i <= 4; i++) if (table[i][k]) { const v = table[i][k]; return [v[0], v[1] + 3, 0, .97, 0, 1]; }
      for (let i = s; i >= 0; i--) if (table[i][k]) { const v = table[i][k]; return [v[0], v[1], 0, .97, 0, 1]; }
      return [0, 0, 0, 1, 0, 1];
    };

    const apply = (s) => {
      const table = layout === 'tall' ? TALL : WIDE;
      items.forEach((el) => {
        const k = el.dataset.k;
        let v = table[s][k];
        if (!v) v = (k[0] === 'f') ? table[0][k] : hiddenSpec(k, s, table);
        const [x, y, r = 0, sc = 1, o = 1, z = 1, dl = 0] = v;
        el.style.setProperty('--x', x);
        el.style.setProperty('--y', y);
        el.style.setProperty('--r', r);
        el.style.setProperty('--s', sc);
        el.style.setProperty('--o', o);
        el.style.setProperty('--z', z);
        el.style.transitionDelay = reduce.matches ? '0ms' : `${dl}ms`;
      });
    };

    const setStage = (s) => {
      if (s === current) return;
      const prev = current;
      current = s;
      stage.dataset.s = s;
      apply(s);
      if (s === 2 && prev < 2 && !reduce.matches) {
        stage.classList.remove('scan'); void stage.offsetWidth; stage.classList.add('scan');
      }
      steps.forEach((b, i) => {
        const n = i + 1;
        b.classList.toggle('is-on', n === s);
        b.classList.toggle('is-past', n < s);
        if (n === s) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      if (desc) desc.textContent = DESC[s];
    };

    const measure = () => {
      const w = stage.clientWidth, h = stage.clientHeight;
      const next = (w / Math.max(h, 1)) >= 0.95 ? 'wide' : 'tall';
      if (next !== layout) {
        layout = next;
        stage.dataset.layout = layout;
        if (current >= 0) apply(current);
      }
    };

    // 進入畫面時自動播放一次；可點步驟跳轉，可重播；不鎖定、不改變捲動
    const replay = $('#clarityReplay');
    let timers = [];
    const stop = () => { timers.forEach(clearTimeout); timers = []; };
    const play = () => {
      stop();
      if (reduce.matches) { setStage(4); return; }
      setStage(0);
      [1, 2, 3, 4].forEach((n, i) => timers.push(setTimeout(() => setStage(n), 700 + i * 1800)));
    };
    steps.forEach((b) => b.addEventListener('click', () => { stop(); setStage(Number(b.dataset.step)); }));
    if (replay) replay.addEventListener('click', play);
    measure();
    setStage(reduce.matches ? 4 : 0);
    let played = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !played) { played = true; play(); io.disconnect(); }
      });
    }, { threshold: 0.45 });
    io.observe(clarity);
    new ResizeObserver(measure).observe(stage);
  }

  /* ---------------- 03 保戶工作台 ---------------- */
  const app = $('#app');
  if (!app) return;

  const CHECK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l2.8 2.7L12.5 5" fill="none" stroke="#191B1D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const CLIENTS = [
    {
      id: 'wang', name: '王先生', initial: '王', meta: '會談邀約',
      frag: '<div class="frag frag--msg"><div class="frag__head"><span class="av">王</span><b>王先生</b><span class="src">訊息</span><time>21:47</time></div><p><span class="hl">下週三</span>有空，想再聊聊之前的<span class="hl">保障內容</span>。</p><span class="tag">王先生・會談邀約</span></div>',
      pos: [2, 4, 0],
      past: { time: '上次會談', text: '會談筆記：想多了解醫療保障。' },
      src: { time: '今天 21:47', label: '訊息' },
      ai: ['會談邀約', '時間：下週三'],
      todo: '確認下週三會談時間', remind: '明天 10:00', basis: '訊息提到「下週三有空」', done: '已確認會談時間'
    },
    {
      id: 'chen', name: '陳小姐', initial: '陳', meta: '補件追蹤',
      frag: '<div class="frag frag--note"><span class="src">工作筆記</span><p>陳小姐　<span class="hl">補件資料</span><span class="hl">還沒收到</span>。</p><span class="tag">陳小姐・補件追蹤</span></div>',
      pos: [44, 22, 0],
      past: { time: '上週', text: '寄出補件清單給陳小姐。' },
      src: { time: '昨天 18:20', label: '工作筆記' },
      ai: ['補件追蹤', '狀態：資料未收到'],
      todo: '明天確認資料提供進度', remind: '明天 14:00', basis: '筆記記錄「補件資料還沒收到」', done: '已確認補件進度'
    },
    {
      id: 'lin', name: '林先生', initial: '林', meta: '定期服務',
      frag: '<div class="frag frag--cal"><div class="cal__top"><span>行事曆</span><span>14:00</span></div><div class="cal__day"><b>週五</b><small>下週</small></div><p><span class="hl">林先生</span>｜<span class="hl">定期保單檢視</span></p><span class="tag">林先生・定期服務</span></div>',
      pos: [8, 54, 0],
      past: { time: '去年', text: '完成年度保單檢視。' },
      src: { time: '行事曆', label: '下週五 14:00' },
      ai: ['定期服務', '時間：下週五 14:00'],
      todo: '準備定期服務會談', remind: '下週四 17:00', basis: '行事曆排定「定期保單檢視」', done: '會談資料已準備好'
    }
  ];

  const el = {
    clients: $('#clients'), tray: $('#tray'), trayCards: $('#trayCards'), detail: $('#detail'),
    who: $('#who'), timeline: $('#timeline'), actStart: $('#actStart'),
    actNext: $('#actNext'), actFinish: $('#actFinish'), organize: $('#organize'), reset: $('#reset'),
    replay: $('#replay'), ticks: $$('#ticks li'), sideCount: $('#sideCount'), sideProgress: $('#sideProgress'),
    barFill: $('#barFill'), doneCount: $('#doneCount'), steps: $$('.app__steps li', app), live: $('#live')
  };

  let st;
  const fresh = () => ({
    phase: 'tray', sel: 0,
    status: CLIENTS.map(() => 'new'),
    log: CLIENTS.map(() => [])
  });

  const say = (msg) => { el.live.textContent = ''; setTimeout(() => { el.live.textContent = msg; }, 30); };

  function renderTray() {
    el.trayCards.innerHTML = CLIENTS.map((c, i) =>
      `<div class="tray__card" data-i="${i}" style="--x:${c.pos[0]};--y:${c.pos[1]};--r:${c.pos[2]}">${c.frag}</div>`).join('');
  }

  function statusChip(s) {
    if (s === 'done') return '<span class="status status--done">已完成</span>';
    if (s === 'todo') return '<span class="status status--todo">待辦中</span>';
    return '<span class="status">待確認</span>';
  }

  function renderClients(reveal = true) {
    if (st.phase === 'tray' || st.phase === 'working') {
      el.clients.innerHTML = CLIENTS.map(() =>
        '<div class="client client--ph" aria-hidden="true"><span class="av"></span><span><span class="ph-bar"></span><span class="ph-bar"></span></span></div>').join('');
      el.sideCount.textContent = '尚未整理';
      el.sideProgress.hidden = true;
      return;
    }
    el.clients.innerHTML = CLIENTS.map((c, i) =>
      `<button class="client" type="button" data-i="${i}" aria-pressed="${i === st.sel}" ${reveal ? '' : 'style="opacity:0"'}>
        <span class="av">${c.initial}</span>
        <span><span class="client__name">${c.name}</span><span class="client__meta">${c.meta}</span></span>
        ${statusChip(st.status[i])}
      </button>`).join('');
    el.sideCount.textContent = '3 位';
    el.sideProgress.hidden = false;
    const done = st.status.filter((s) => s === 'done').length;
    el.doneCount.textContent = done;
    el.barFill.style.setProperty('--p', done / 3);
  }

  function renderSteps() {
    const anyNew = st.status.some((s) => s === 'new');
    const allDone = st.status.every((s) => s === 'done');
    const organized = st.phase === 'review' || st.phase === 'finish';
    const state = [
      organized ? 'done' : 'on',
      !organized ? '' : (anyNew ? 'on' : 'done'),
      !organized || anyNew ? '' : (allDone ? 'done' : 'on')
    ];
    el.steps.forEach((li, i) => {
      li.classList.toggle('is-on', state[i] === 'on');
      li.classList.toggle('is-done', state[i] === 'done');
      if (state[i] === 'on') li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
  }

  function renderDetail(animateLast = false) {
    const i = st.sel, c = CLIENTS[i];
    el.who.innerHTML = `<span class="av">${c.initial}</span><span><b>${c.name}</b><small>既有保戶・示範資料</small></span>`;
    const base = [
      `<li class="tl"><p class="tl__time"><span>${c.past.time}</span></p><p class="tl__text">${c.past.text}</p></li>`,
      `<li class="tl tl--new"><p class="tl__time"><span>${c.src.time}・${c.src.label}</span></p>${c.frag}<div class="ai-row"><span>AI 整理</span>${c.ai.map((a) => `<span>${a}</span>`).join('')}</div></li>`
    ];
    const extra = st.log[i].map((e, n) =>
      `<li class="tl ${e.cls}${animateLast && n === st.log[i].length - 1 ? ' tl-in' : ''}"><p class="tl__time"><span>剛剛</span></p><p class="tl__text">${e.text}</p></li>`);
    el.timeline.innerHTML = base.concat(extra).join('');
  }

  function renderAction() {
    const i = st.sel, c = CLIENTS[i], s = st.status[i];
    el.actStart.hidden = !(st.phase === 'tray' || st.phase === 'working');
    el.organize.textContent = st.phase === 'working' ? '整理中…' : '開始 AI 整理';
    el.actFinish.hidden = st.phase !== 'finish';
    el.actNext.hidden = st.phase !== 'review';
    if (st.phase !== 'review') return;

    if (s === 'new') {
      el.actNext.innerHTML = `
        <p class="next__label">建議下一步</p>
        <p class="next__title">${c.todo}</p>
        <dl class="next__meta">
          <div><dt>保戶</dt><dd>${c.name}</dd></div>
          <div><dt>提醒</dt><dd>${c.remind}</dd></div>
          <div><dt>依據</dt><dd>${c.basis}</dd></div>
        </dl>
        <p class="act__lead">確認無誤後，才會建立成待辦。</p>
        <div class="next__spacer"></div>
        <button class="btn btn--gold btn--block" type="button" data-act="confirm">確認並建立待辦</button>`;
    } else {
      const done = s === 'done';
      const nextI = st.status.findIndex((x, n) => x !== 'done' && n !== i);
      el.actNext.innerHTML = `
        <p class="next__label">${done ? '已完成' : '服務待辦'}</p>
        <label class="check">
          <input type="checkbox" data-act="toggle" ${done ? 'checked' : ''}>
          <span class="check__box">${CHECK_SVG}</span>
          <span class="check__text"><b>${c.todo}</b><small>提醒：${c.remind}</small></span>
        </label>
        <p class="done-note">${done ? `${c.done}，已記錄到 ${c.name} 的時間軸。` : '完成後打勾，紀錄會加到時間軸。'}</p>
        <div class="next__spacer"></div>
        ${nextI > -1 ? `<button class="btn btn--line btn--block" type="button" data-act="next" data-to="${nextI}">下一位：${CLIENTS[nextI].name}</button>` : ''}`;
    }
  }

  function renderAll(opts = {}) {
    app.dataset.phase = st.phase;
    const organized = st.phase === 'review' || st.phase === 'finish';
    el.tray.hidden = organized;
    el.detail.hidden = !organized;
    el.reset.hidden = st.phase === 'tray';
    renderClients(opts.reveal !== false);
    renderSteps();
    if (organized) renderDetail(opts.animateLast);
    renderAction();
  }

  function reset(focus) {
    st = fresh();
    app.classList.remove('is-working');
    el.ticks.forEach((t) => t.classList.remove('is-done'));
    el.organize.disabled = false;
    renderTray();
    renderAll();
    if (focus) el.organize.focus({ preventScroll: true });
  }

  async function organize() {
    if (st.phase !== 'tray') return;
    st.phase = 'working';
    el.organize.disabled = true;
    renderAll();
    app.classList.add('is-working');
    say('AI 整理中：辨識客戶、擷取時間與事項、建議下一步。');
    for (const t of el.ticks) { await wait(420); t.classList.add('is-done'); }
    await wait(380);

    // 手機：先把工作台頂端帶回畫面，讓訪客看見資訊飛進保戶清單
    const top = app.getBoundingClientRect().top;
    if (top < 0) {
      window.scrollTo({ top: window.scrollY + top - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 64) - 8, behavior: reduce.matches ? 'auto' : 'smooth' });
      await wait(520);
    }
    // FLIP：資訊卡飛進保戶清單
    const cards = $$('.tray__card .frag', el.trayCards);
    const first = cards.map((c) => c.getBoundingClientRect());
    st.phase = 'review';
    renderAll({ reveal: reduce.matches });
    const rows = $$('.client', el.clients);
    if (!reduce.matches) {
      const flights = cards.map((card, n) => {
        const a = first[n], row = rows[n];
        if (!row) return Promise.resolve();
        const b = row.getBoundingClientRect();
        const ghost = card.cloneNode(true);
        ghost.classList.add('fly');
        Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, fontSize: getComputedStyle(card).fontSize });
        document.body.appendChild(ghost);
        const sc = Math.min(b.width / a.width, b.height / a.height);
        const dx = b.left + (b.width - a.width * sc) / 2 - a.left;
        const dy = b.top + (b.height - a.height * sc) / 2 - a.top;
        const anim = ghost.animate([
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px,${dy}px) scale(${sc})`, opacity: 0 }
        ], { duration: 720, delay: n * 90, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
        return anim.finished.then(() => {
          ghost.remove();
          row.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill: 'forwards' }).finished.then(() => { row.style.opacity = ''; });
        });
      });
      await Promise.all(flights);
    }
    rows.forEach((r) => { r.style.opacity = ''; });
    say('已整理成 3 位保戶，各有一件建議的下一步。目前顯示王先生。');
  }

  function confirmTodo() {
    const i = st.sel;
    st.status[i] = 'todo';
    st.log[i].push({ cls: 'tl--new', text: `建立待辦：${CLIENTS[i].todo}（${CLIENTS[i].remind} 提醒）` });
    renderAll({ animateLast: true });
    say(`已為${CLIENTS[i].name}建立待辦：${CLIENTS[i].todo}。`);
    const box = $('input[data-act="toggle"]', el.actNext);
    if (box) box.focus({ preventScroll: true });
  }

  function toggleTodo(checked) {
    const i = st.sel;
    if (checked) {
      st.status[i] = 'done';
      st.log[i].push({ cls: 'tl--done', text: `完成：${CLIENTS[i].done}` });
    } else {
      st.status[i] = 'todo';
      st.log[i] = st.log[i].filter((e) => e.cls !== 'tl--done');
    }
    const allDone = st.status.every((s) => s === 'done');
    renderAll({ animateLast: checked });
    say(checked ? `${CLIENTS[i].name}的下一步已完成。` : `已取消完成：${CLIENTS[i].todo}。`);
    const box = $('input[data-act="toggle"]', el.actNext);
    if (box) box.focus({ preventScroll: true });
    if (allDone) {
      setTimeout(() => {
        if (!st.status.every((s) => s === 'done')) return;
        st.phase = 'finish';
        renderAll();
        say('三位保戶，都有清楚的下一步了。');
        $('.btn--gold', el.actFinish).focus({ preventScroll: true });
      }, reduce.matches ? 0 : 900);
    }
  }

  function select(i) {
    if (st.phase !== 'review' && st.phase !== 'finish') return;
    st.sel = i;
    if (st.phase === 'finish') st.phase = 'review';
    renderAll();
    say(`目前顯示${CLIENTS[i].name}。`);
  }

  el.organize.addEventListener('click', organize);
  el.reset.addEventListener('click', () => reset(true));
  el.replay.addEventListener('click', () => reset(true));
  el.clients.addEventListener('click', (e) => {
    const b = e.target.closest('button.client');
    if (b) select(Number(b.dataset.i));
  });
  el.actNext.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'confirm') confirmTodo();
    if (b.dataset.act === 'next') {
      select(Number(b.dataset.to));
      const btn = $('[data-act="confirm"], input[data-act="toggle"]', el.actNext);
      if (btn) btn.focus({ preventScroll: true });
    }
  });
  el.actNext.addEventListener('change', (e) => {
    if (e.target.matches('input[data-act="toggle"]')) toggleTodo(e.target.checked);
  });

  reset(false);
})();
