// Botão "Me ofereça um café": um clique por pessoa, contador público permanente.
const LS = 'lg-cafe-offered';
const API = '/api/cafe';

const fmt = (n) => new Intl.NumberFormat('pt-BR').format(Math.max(0, Number(n) || 0));

function localOffered() {
  try {
    return localStorage.getItem(LS) === '1' || document.cookie.split(';').some((p) => p.trim().startsWith('lg_cafe='));
  } catch {
    return false;
  }
}

function markLocal() {
  try { localStorage.setItem(LS, '1'); } catch { /* private mode */ }
}

function paint(root, { count, offered }) {
  const n = root.querySelector('[data-cafe-count]');
  const btn = root.querySelector('[data-cafe-offer]');
  const label = root.querySelector('[data-cafe-label]');
  if (n) n.textContent = fmt(count);
  if (label) label.textContent = count === 1 ? 'café oferecido' : 'cafés oferecidos';
  if (!btn) return;
  if (offered) {
    btn.disabled = true;
    btn.textContent = 'Café anotado. Valeu.';
    btn.setAttribute('aria-pressed', 'true');
    root.classList.add('cafe--done');
  } else {
    btn.disabled = false;
    btn.textContent = 'Me ofereça um café';
    btn.setAttribute('aria-pressed', 'false');
    root.classList.remove('cafe--done');
  }
}

export function cafeHtml() {
  return `<section class="cafe" id="cafe" aria-labelledby="cafe-h">
  <div class="cafe__card">
    <h2 class="cafe__h" id="cafe-h">Um café</h2>
    <p class="cafe__count"><strong data-cafe-count>0</strong> <span data-cafe-label>cafés oferecidos</span></p>
    <button type="button" class="cafe__btn" data-cafe-offer aria-pressed="false">Me ofereça um café</button>
    <p class="cafe__note">É só um clique, não custa nada. Cada clique é um café que eu tomo.</p>
  </div>
</section>`;
}

export function initCafe(root = document) {
  const el = root.querySelector?.('#cafe') || root;
  if (!el || !el.querySelector?.('[data-cafe-offer]')) return;
  const btn = el.querySelector('[data-cafe-offer]');
  let offered = localOffered();
  paint(el, { count: 0, offered });

  const sync = async () => {
    try {
      const r = await fetch(API, { credentials: 'same-origin' });
      if (!r.ok) return;
      const data = await r.json();
      offered = Boolean(data.offered) || localOffered();
      if (offered) markLocal();
      paint(el, { count: data.count, offered });
    } catch { /* offline / preview static */ }
  };
  sync();

  btn.addEventListener('click', async () => {
    if (btn.disabled || offered) return;
    btn.disabled = true;
    btn.textContent = 'Anotando…';
    try {
      const r = await fetch(API, { method: 'POST', credentials: 'same-origin' });
      const data = await r.json().catch(() => ({}));
      if (r.status === 429) {
        btn.disabled = false;
        btn.textContent = 'Me ofereça um café';
        return;
      }
      offered = true;
      markLocal();
      paint(el, { count: data.count ?? 0, offered: true });
    } catch {
      // Sem API (build local): registra só no aparelho e sobe o número visível.
      offered = true;
      markLocal();
      const n = el.querySelector('[data-cafe-count]');
      const next = (Number(String(n?.textContent || '0').replace(/\D/g, '')) || 0) + 1;
      paint(el, { count: next, offered: true });
    }
  });
}
