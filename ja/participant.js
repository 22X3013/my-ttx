// 参加者詳細（編集・削除）
(function(){
    const KEY = 'ttx_participants_v1';
  
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
  
    const $form = document.getElementById('detail-form');
    const $org  = document.getElementById('d-org');
    const $role = document.getElementById('d-role');
    const $saved = document.getElementById('saved');
    const $nf    = document.getElementById('notfound');
    const $del   = document.getElementById('delete-btn');
  
    if(!$form || !$org || !$role || !$saved || !$nf || !$del) return;
  
    let items = load();
    const item = items.find(x => x.id === id);
  
    if(!id || !item){
      $nf.hidden = false;
      return;
    }
  
    $org.value  = item.org;
    $role.value = item.role;
    $form.hidden = false;
  
    $form.addEventListener('submit', e=>{
      e.preventDefault();
      const org  = ($org.value||'').trim();
      const role = ($role.value||'').trim();
      if(!org || !role) return;
  
      items = items.map(x => x.id === id ? ({...x, org, role}) : x);
      save(items);
      $saved.hidden = false;
      setTimeout(()=>($saved.hidden = true), 1200);
    });
  
    $del.addEventListener('click', ()=>{
      if(!confirm('この参加者を削除しますか？')) return;
      items = items.filter(x => x.id !== id);
      save(items);
      location.href = 'index.html';
    });
  
    function load(){
      try{
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
      }catch{ return []; }
    }
    function save(arr){
      try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch{}
    }
  })();
  