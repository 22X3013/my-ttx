// スクロール表示アニメーション（IntersectionObserver）
(function(){
    document.addEventListener('DOMContentLoaded', () => {
      const targets = document.querySelectorAll('.reveal');
      if (!('IntersectionObserver' in window) || targets.length === 0) return;
  
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
  
      targets.forEach(el => observer.observe(el));
    });
  })();
  