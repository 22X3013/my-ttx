// 共通ストップウォッチ（全ページで使用）
(function () {
    function ready(fn){
      document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
    }
  
    ready(() => {
      const root = document.getElementById('stopwatch');
      if (!root) return;
  
      const display  = root.querySelector('.time');
      const startBtn = document.getElementById('sw-start');
      const stopBtn  = document.getElementById('sw-stop');
      const resetBtn = document.getElementById('sw-reset');
      if (!display || !startBtn || !stopBtn || !resetBtn) return;
  
      let timer   = null;
      let startAt = 0;
      let elapsed = 0;
  
      function format(ms){
        const mm = Math.floor(ms/60000);
        const ss = Math.floor((ms%60000)/1000);
        const cs = Math.floor((ms%1000)/10);
        const pad = n => String(n).padStart(2,'0');
        return `${pad(mm)}:${pad(ss)}:${pad(cs)}`;
      }
      function render(){ display.textContent = format(elapsed); }
  
      startBtn.addEventListener('click', () => {
        if (timer) return;
        startAt = Date.now() - elapsed;
        timer = setInterval(() => { elapsed = Date.now() - startAt; render(); }, 80);
      });
      stopBtn.addEventListener('click', () => {
        if (!timer) return;
        clearInterval(timer); timer = null;
        elapsed = Date.now() - startAt; render();
      });
      resetBtn.addEventListener('click', () => {
        if (timer) { clearInterval(timer); timer = null; }
        elapsed = 0; render();
      });
  
      render();
    });
  })();
  