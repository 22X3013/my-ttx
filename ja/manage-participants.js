// 参加者の管理（追加・削除 + 詳細編集への導線）
(function(){
    const KEY = 'ttx_participants_v1';
  
    const $form = document.getElementById('manage-form');
    const $org  = document.getElementById('m-org');
    const $role = document.getElementById('m-role');
    const $list = document.getElementById('manage-list');
  
    if(!$form || !$org || !$role || !$list) return;
  
    let items = load();
    render();
    $list.setAttribute('aria-busy','false');
  
    // 追加
    $form.addEventListener('submit', e=>{
      e.preventDefault();
      const org  = ($org.value||'').trim();
      const role = ($role.value||'').trim();
      if(!org || !role) return;
  
      items.push({ id: rid(), org, role });
      save(items);
  
      $org.value = '';
      $role.value = '';
      render(true);
    });
  
    // 削除（行のボタン）
    $list.addEventListener('click', e=>{
      const btn = e.target.closest('button[data-id]');
      if(!btn) return;
      const id = btn.dataset.id;
      items = items.filter(x => x.id !== id);
      save(items);
      render();
    });
  
    function render(focusLast=false){
      $list.innerHTML = items.map(x => `
        <li class="person">
          <a class="person-link"
             href="participant.html?id=${encodeURIComponent(x.id)}"
             aria-label="${esc(x.org)} — ${esc(x.role)} の詳細編集へ">
            <span class="org">${esc(x.org)}</span>
            <span class="sep">—</span>
            <span class="role">${esc(x.role)}</span>
            <span class="chevron" aria-hidden="true">›</span>
          </a>
          <div class="tl-actions" style="margin-top:8px;">
            <a class="btn outline" href="participant.html?id=${encodeURIComponent(x.id)}">編集</a>
            <button class="btn-remove" data-id="${x.id}">削除</button>
          </div>
        </li>
      `).join('');
      if (focusLast) $list.querySelector('li:last-child a.person-link')?.focus();
    }
  
    function load(){
      try{
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
      }catch{
        return [];
      }
    }
    function save(arr){
      try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch{}
    }
    function esc(s){
      return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }
    function rid(){
      try{
        const b = new Uint8Array(8);
        (self.crypto||window.crypto).getRandomValues(b);
        return Array.from(b).map(x=>x.toString(16).padStart(2,'0')).join('');
      }catch{
        return 'id-' + Math.random().toString(36).slice(2,10);
      }
    }
  })();
  