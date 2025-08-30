// シナリオシミュレーション
(function () {
    const KEY = 'ttx_scenario_v1';
  
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
  
    document.addEventListener('DOMContentLoaded', () => {
      const timelineEl     = document.getElementById('sim-timeline');
      const currentDateEl  = document.querySelector('#current-event .timeline-date');
      const currentTitleEl = document.querySelector('#current-event .timeline-content h3');
      const currentDescEl  = document.querySelector('#current-event .timeline-content p');
  
      const btnStart  = document.getElementById('sim-start');
      const btnPrev   = document.getElementById('sim-prev');
      const btnNext   = document.getElementById('sim-next');
      const btnReset  = document.getElementById('sim-reset');
      const progress  = document.getElementById('sim-progress-bar');
      const counterEl = document.getElementById('sim-counter');
  
      if (!timelineEl || !currentDateEl || !currentTitleEl || !currentDescEl ||
          !btnStart || !btnPrev || !btnNext || !btnReset || !progress || !counterEl) return;
  
      let items = loadScenario();
      let currentIndex = -1;
  
      progress.max = items.length;
      renderList();
      updateDisplay();
      timelineEl.setAttribute('aria-busy','false');
  
      btnStart.addEventListener('click', () => {
        if (!items.length) return;
        currentIndex = 0;
        updateDisplay();
      });
      btnNext.addEventListener('click', () => {
        if (currentIndex < items.length - 1){
          currentIndex++;
          updateDisplay();
        }
      });
      btnPrev.addEventListener('click', () => {
        if (currentIndex > 0){
          currentIndex--;
          updateDisplay();
        }
      });
      btnReset.addEventListener('click', () => {
        currentIndex = -1;
        updateDisplay();
      });
  
      function updateDisplay(){
        if (currentIndex >= 0 && currentIndex < items.length){
          const ev = items[currentIndex];
          currentDateEl.textContent  = ev.time;
          currentTitleEl.textContent = ev.title;
          currentDescEl.textContent  = ev.desc;
  
          btnPrev.disabled  = currentIndex === 0;
          btnNext.disabled  = currentIndex === items.length - 1;
          btnReset.disabled = false;
  
          progress.value = currentIndex + 1;
          counterEl.textContent = `${currentIndex+1} / ${items.length}`;
        }else{
          currentDateEl.textContent  = '';
          currentTitleEl.textContent = '開始ボタンを押して下さい';
          currentDescEl.textContent  = '';
  
          btnPrev.disabled  = true;
          btnNext.disabled  = true;
          btnReset.disabled = true;
  
          progress.value = 0;
          counterEl.textContent = `0 / ${items.length}`;
        }
  
        // ミニTLのハイライト
        timelineEl.querySelectorAll('li').forEach((li, i)=>{
          li.classList.toggle('active', i === currentIndex);
        });
  
        // 開始後は開始ボタンを無効化
        btnStart.disabled = currentIndex >= 0;
      }
  
      function renderList(){
        timelineEl.innerHTML = items.map(ev => `
          <li>
            <p class="timeline-date">${esc(ev.time)}</p>
            <div class="timeline-content">
              <h3>${esc(ev.title)}</h3>
            </div>
          </li>
        `).join('');
      }
  
      function loadScenario(){
        try{
          const raw = localStorage.getItem(KEY);
          if (!raw){
            localStorage.setItem(KEY, JSON.stringify(DEFAULTS));
            return [...DEFAULTS];
          }
          const arr = JSON.parse(raw);
          return Array.isArray(arr) ? arr : [...DEFAULTS];
        }catch{
          return [...DEFAULTS];
        }
      }
  
      function esc(s){
        return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
      }
    });
  })();
  