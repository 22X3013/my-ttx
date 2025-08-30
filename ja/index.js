// 参加者一覧（トップページ）
// ※ index.html では追加フォームを削除しているため、このファイルは存在しなくてもOK。
//   置いても安全（要素が無ければ早期return）。
(function () {
    const KEY = 'ttx_participants_v1';
  
    const $form = document.getElementById('participants-form');
    const $org  = document.getElementById('p-org');
    const $role = document.getElementById('p-role');
    const $list = document.getElementById('participants-list');
    if (!$form || !$org || !$role || !$list) return;
  
    const DEFAULTS = [
      { id: rid(), org: '浜松市 危機管理課', role: '被害把握・避難指示・初動調整' },
      { id: rid(), org: '浜松市 消防局',   role: '救助・消火・避難支援' },
      { id: rid(), org: '静岡県警',         role: '安否確認・交通規制' },
      { id: rid(), org: '医療・福祉',       role: '医療支援・要配慮者対応' },
      { id: rid(), org: 'ボランティア団体', role: '避難所運営支援・物資配布' },
      { id: rid(), org: 'ICT担当',          role: '情報整理・誤情報対策・共有' },
      { id: rid(), org: '恵那市（広域支援）', role: '受援調整・物資/人員派遣' },
    ];
  
    let items = load();
    render();
    $list.setAttribute('aria-busy','false');
  
    $form.addEventListener('submit', (e) => {
      e.preventDefault();
      const org  = ($org.value||'').trim();
      const role = ($role.value||'').trim();
      if (!org || !role) return;
      const id = rid();
      items.push({ id, org, role });
      save(items);
      $org.value = ''; $role.value = '';
      render(true);
    });
  
    function render(focusLast=false){
      $list.innerHTML = items.map(item => `
        <li class="person">
          <a class="person-link"
            href="participant.html?id=${encodeURIComponent(item.id)}"
            aria-label="${esc(item.org)} — ${esc(item.role)} の詳細へ">
            <span class="org">${esc(item.org)}</span>
            <span class="sep">—</span>
            <span class="role">${esc(item.role)}</span>
            <span class="chevron" aria-hidden="true">›</span>
          </a>
        </li>
      `).join('');
      if (focusLast) $list.querySelector('li:last-child .person-link')?.focus();
    }
  
    function load(){
      try{
        const raw = localStorage.getItem(KEY);
        if (!raw){
          localStorage.setItem(KEY, JSON.stringify(DEFAULTS));
          return [...DEFAULTS];
        }
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [...DEFAULTS];
      }catch{ return [...DEFAULTS]; }
    }
    function save(arr){ try{ localStorage.setItem(KEY, JSON.stringify(arr)); }catch{} }
    function esc(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
    function rid(){
      try{
        const b = new Uint8Array(8);
        (self.crypto||window.crypto).getRandomValues(b);
        return Array.from(b).map(x=>x.toString(16).padStart(2,'0')).join('');
      }catch{ return 'id-' + Math.random().toString(36).slice(2,10); }
    }
  })();
  