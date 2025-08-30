// 予定タイムライン（シナリオ追加・削除）+ 意見記録
document.addEventListener('DOMContentLoaded', () => {
    // ===== シナリオ =====
    const KEY   = 'ttx_scenario_v1';
    const $list = document.getElementById('scenario-list');
    const $form = document.getElementById('scenario-form');
    const $time = document.getElementById('s-time');
    const $title= document.getElementById('s-title');
    const $desc = document.getElementById('s-desc');
  
    function rid(){
      try{
        const b = new Uint8Array(8);
        (self.crypto||window.crypto).getRandomValues(b);
        return Array.from(b).map(x=>x.toString(16).padStart(2,'0')).join('');
      }catch{
        return 'id-'+Math.random().toString(36).slice(2,10);
      }
    }
  
    const DEFAULTS = [
      { id: rid(), time: 'Day1 08:00', title: '南海トラフ巨大地震発生', desc: '浜松市で震度7を想定。津波警報が発令され、沿岸地域は避難を要する。' },
      { id: rid(), time: 'Day1 09:00', title: '避難混乱・通信途絶',   desc: '避難所が定員を超え、通信手段が途絶して情報伝達が難航。' },
      { id: rid(), time: 'Day1 10:00', title: '恵那市への支援要請',   desc: '浜松市から恵那市へ広域支援要請が発出される。' },
      { id: rid(), time: 'Day1 12:00', title: '恵那市支援隊出発',     desc: '恵那市の支援隊が浜松市へ向けて出発。物資と医療チームが同行。' },
      { id: rid(), time: 'Day1 14:00', title: '避難所設置開始',       desc: '浜松市内の安全な場所で避難所の設置が開始される。' },
      { id: rid(), time: 'Day1 16:00', title: '恵那市避難者受け入れ', desc: '恵那市による受け入れ準備が進み、物資と医療支援の調整が進む。' },
      { id: rid(), time: 'Day2 08:00', title: 'SNSでの誤情報拡散',   desc: 'SNS上で誤った津波情報や支援情報が拡散しはじめる。' },
      { id: rid(), time: 'Day2 09:00', title: '正確な情報選別',       desc: 'ICT担当が誤情報を排除し、正確な情報を整理・共有する。' },
    ];
  
    let items = load();
    render();
    $list?.setAttribute('aria-busy','false');
  
    if ($form){
      $form.addEventListener('submit', (e) => {
        e.preventDefault();
        const time  = ($time.value||'').trim();
        const title = ($title.value||'').trim();
        const desc  = ($desc.value||'').trim();
        if(!time || !title || !desc) return;
  
        items.push({ id: rid(), time, title, desc });
        save(items);
        $time.value = $title.value = $desc.value = '';
        render(true);
      });
    }
  
    // 削除
    $list?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-id]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      items = items.filter(x => x.id !== id);
      save(items); render();
    });
  
    function render(focusLast=false){
      if(!$list) return;
      $list.innerHTML = items.map(ev => {
        const label = `${ev.time} ${ev.title}`;
        return `
          <li>
            <p class="timeline-date">${esc(ev.time)}</p>
            <div class="timeline-content">
              <h3>${esc(ev.title)}</h3>
              <p>${esc(ev.desc)}</p>
              <div class="tl-actions">
                <button type="button" class="btn-remove" data-id="${ev.id}" aria-label="削除: ${esc(label)}">削除</button>
              </div>
            </div>
          </li>`;
      }).join('');
      if(focusLast) $list.querySelector('li:last-child .btn-remove')?.focus();
    }
  
    function load(){
      try{
        const raw = localStorage.getItem(KEY);
        if(!raw){
          localStorage.setItem(KEY, JSON.stringify(DEFAULTS));
          return [...DEFAULTS];
        }
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [...DEFAULTS];
      }catch{ return [...DEFAULTS]; }
    }
    function save(arr){
      try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch{}
    }
    function esc(s){
      return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }
  
    // ===== 意見記録 =====
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');
    if (commentForm && commentList){
      const CKEY = 'ttx_comments';
  
      function loadComments(){
        const raw = sessionStorage.getItem(CKEY);
        const comments = raw ? JSON.parse(raw) : [];
        comments.sort((a,b)=> new Date(a.ts) - new Date(b.ts));
        commentList.innerHTML = comments.map(c => {
          const when = new Date(c.ts).toLocaleString('ja-JP');
          return `<li><div class="meta">${esc(c.name||'匿名')} ・ ${when}</div><div>${esc(c.text||'')}</div></li>`;
        }).join('');
        commentList.setAttribute('aria-busy','false');
      }
  
      function saveComment(name,text){
        const raw = sessionStorage.getItem(CKEY);
        const comments = raw ? JSON.parse(raw) : [];
        comments.push({ name, text, ts:new Date().toISOString() });
        sessionStorage.setItem(CKEY, JSON.stringify(comments));
      }
  
      loadComments();
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('comment-name')?.value||'').trim();
        const text = (document.getElementById('comment-text')?.value||'').trim();
        if(!text) return;
        saveComment(name,text);
        document.getElementById('comment-name').value='';
        document.getElementById('comment-text').value='';
        loadComments();
      });
    }
  });
  