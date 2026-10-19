// COTIZADOR: el mismo modal en todas las páginas. Se inserta aquí una sola vez; cada página solo necesita
// el botón que llama a openQuoteModal().
const QUOTE_MODAL_HTML = `
  <div class="modal-overlay" id="quoteModal" onclick="closeModalOnBackdrop(event)">
    <div class="modal-window">
      <button class="modal-close-btn" aria-label="Cerrar" onclick="closeQuoteModal()">✕</button>
      <div class="step-indicator-bar">
        <div class="step-tick active" id="tick-1"></div>
        <div class="step-tick" id="tick-2"></div>
        <div class="step-tick" id="tick-3"></div>
      </div>
      <!-- PASO 1 -->
      <div class="wizard-step active" id="step-1">
        <h3 style="font-size: 20px; margin-bottom: 6px;">¿Qué tipo de solución necesita?</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">Elija la línea y le asignamos un asesor técnico.</p>
        <div class="option-grid" style="margin-bottom: 24px;">
          <button type="button" class="selectable-card selected" aria-pressed="true" onclick="selectService(this, 'Hospitalario')">
            <span class="card-check" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 8.5l2.5 2.5L12 5.5"/></svg></span>
            <h5>Línea hospitalaria</h5>
            <p>Clínicas, IPS, centros de salud</p>
          </button>
          <button type="button" class="selectable-card" aria-pressed="false" onclick="selectService(this, 'Corporativo')">
            <span class="card-check" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 8.5l2.5 2.5L12 5.5"/></svg></span>
            <h5>Casino empresarial</h5>
            <p>Almuerzos y refrigerios diarios</p>
          </button>
          <button type="button" class="selectable-card" aria-pressed="false" onclick="selectService(this, 'Evento')">
            <span class="card-check" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 8.5l2.5 2.5L12 5.5"/></svg></span>
            <h5>Eventos y asados</h5>
            <p>Jornadas al aire libre y reuniones</p>
          </button>
          <button type="button" class="selectable-card" aria-pressed="false" onclick="selectService(this, 'Proteínas')">
            <span class="card-check" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M4 8.5l2.5 2.5L12 5.5"/></svg></span>
            <h5>Proteínas al vacío</h5>
            <p>Cortes porcionados para restaurantes</p>
          </button>
        </div>
        <button class="btn btn-primary" style="width: 100%;" onclick="goToStep(2)">Continuar al siguiente paso →</button>
      </div>
      <!-- PASO 2 -->
      <div class="wizard-step" id="step-2">
        <h3 style="font-size: 20px; margin-bottom: 6px;">Alcance y volumen estimado</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">Verificamos la capacidad operativa diaria requerida.</p>
        <div class="form-group">
          <label for="quoteVolume">Raciones aproximadas / personas por día:</label>
          <select class="form-select" id="quoteVolume">
            <option value="20-50">20 a 50 raciones</option>
            <option value="50-150" selected>50 a 150 raciones</option>
            <option value="150-500">150 a 500 raciones</option>
            <option value="500+">Más de 500 raciones diarias</option>
          </select>
        </div>
        <div class="form-group">
          <label for="quoteFrequency">Modalidad de contratación:</label>
          <select class="form-select" id="quoteFrequency">
            <option value="contrato">Contrato recurrente mensual</option>
            <option value="evento">Evento o fecha específica</option>
            <option value="muestra">Quiero coordinar primero una muestra o degustación</option>
          </select>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 24px;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="goToStep(1)">← Atrás</button>
          <button class="btn btn-primary" style="flex: 2;" onclick="goToStep(3)">Continuar a datos de contacto →</button>
        </div>
      </div>
      <!-- PASO 3 -->
      <div class="wizard-step" id="step-3">
        <h3 style="font-size: 20px; margin-bottom: 6px;">¿A dónde enviamos la propuesta?</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">El equipo comercial preparará el dossier y la cotización en menos de 48 horas hábiles.</p>
        <div class="form-group">
          <label for="contactName">Nombre y cargo del decisor:</label>
          <input type="text" class="form-input" id="contactName" maxlength="150" autocomplete="name" placeholder="Ej. Dra. Camila Gómez - Jefe de Nutrición" required>
        </div>
        <div class="form-group">
          <label for="contactCompany">Empresa, clínica o institución:</label>
          <input type="text" class="form-input" id="contactCompany" maxlength="150" autocomplete="organization" placeholder="Ej. Clínica San Lucas IPS" required>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label for="contactEmail">Correo corporativo:</label>
            <input type="email" class="form-input" id="contactEmail" maxlength="150" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="compras@empresa.com" required>
          </div>
          <div class="form-group">
            <label for="contactPhone">Teléfono / celular:</label>
            <input type="tel" class="form-input" id="contactPhone" maxlength="150" autocomplete="tel" placeholder="310 000 0000" required>
          </div>
        </div>
        <div class="form-group">
          <label for="contactMessage">Mensaje <span style="font-weight:400; color:var(--text-muted);">(opcional)</span>:</label>
          <textarea class="form-textarea" id="contactMessage" maxlength="1000" rows="3" placeholder="Cuéntenos horarios, tipos de dieta, fecha de inicio o cualquier detalle que debamos tener en cuenta..."></textarea>
        </div>
        <label style="display:flex; gap:8px; align-items:flex-start; font-size:12px; color:var(--text-muted); margin-top:12px; font-weight:400;">
            <input type="checkbox" id="quoteConsent" required style="margin-top:2px;">
            <span>Autorizo a Catering C.H. Pray S.A.S. a tratar mis datos para responder esta solicitud, conforme a la Ley 1581 de 2012.</span>
          </label>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button class="btn btn-secondary" style="flex: 1;" onclick="goToStep(2)">← Atrás</button>
          <button class="btn btn-primary" style="flex: 2;" id="quoteSubmitBtn" onclick="submitQuote()">Generar y enviar solicitud</button>
        </div>
      </div>
      <!-- PANTALLA ÉXITO -->
      <!-- ENVIANDO -->
      <div class="wizard-step send-state" id="step-sending" role="status" aria-live="polite">
        <svg class="send-spinner" viewBox="0 0 48 48" aria-hidden="true">
          <circle class="track" cx="24" cy="24" r="20"/>
          <circle class="arc" cx="24" cy="24" r="20"/>
        </svg>
        <h3>Enviando su solicitud…</h3>
        <p>Estamos registrando sus datos. Esto toma solo unos segundos.</p>
      </div>
      <div class="wizard-step send-state success-state" id="step-success" role="status" aria-live="polite">
        <svg class="success-mark" viewBox="0 0 56 56" aria-hidden="true">
          <circle class="disc" cx="28" cy="28" r="28"/>
          <path class="check" d="M17 29l7 7 15-15"/>
        </svg>
        <h3 class="stagger" style="font-size: 22px; margin-bottom: 8px;">Solicitud registrada exitosamente</h3>
        <p class="stagger" style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px; line-height: 1.5;">
          Ya registramos su solicitud. Un asesor comercial y nuestro equipo de nutrición se comunicarán con usted en menos de 48 horas hábiles.
        </p>
        <div class="stagger"><button class="btn btn-primary" onclick="closeQuoteModal()">Cerrar y volver al sitio</button></div>
      </div>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', QUOTE_MODAL_HTML);

let currentTabIndex = 0;
let selectedServiceName = "Hospitalario";

// 1. PESTAÑAS (FLUID SPRING TABS)
function updateTabIndicator(index) {
  const buttons = document.querySelectorAll('.tab-btn');
  const indicator = document.getElementById('tabIndicator');
  const targetBtn = buttons[index];
  if (!indicator || !targetBtn) return; // páginas sin pestañas

  buttons.forEach(btn => btn.classList.remove('active'));
  targetBtn.classList.add('active');

  indicator.style.width = `${targetBtn.offsetWidth}px`;
  indicator.style.transform = `translateX(${targetBtn.offsetLeft - 4}px)`;
}

function switchTab(index) {
  currentTabIndex = index;
  updateTabIndicator(index);

  const panels = document.querySelectorAll('.tab-panel');
  panels.forEach((p, idx) => {
    if (idx === index) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
}

window.addEventListener('load', () => {
  updateTabIndicator(0);
  calculateSavings(80);
});

window.addEventListener('resize', () => {
  updateTabIndicator(currentTabIndex);
});

// 2. CALCULADORA DE PROTEÍNAS
function calculateSavings(kg) {
  if (!document.getElementById('kgLabel')) return; // páginas sin calculadora
  document.getElementById('kgLabel').innerText = `${kg} kg`;
  const merma = (kg * 0.15).toFixed(1);
  const horas = Math.round(kg * 0.2);

  document.getElementById('mermaKg').innerText = `${merma} kg`;
  document.getElementById('horasAhorro').innerText = `${horas} h`;
}

// 3. MODAL DE COTIZACIÓN
// El botón que abre el cotizador decide la línea; si no la dice, manda la de la página (<body data-service>)
const SERVICE_BY_TYPE = { clinico: 'Hospitalario', corporativo: 'Corporativo', evento: 'Evento', vacio: 'Proteínas', 'vacío': 'Proteínas', muestra_carne: 'Proteínas', muestra_corporativo: 'Corporativo' };

function openQuoteModal(initialType) {
  const modal = document.getElementById('quoteModal');
  const service = SERVICE_BY_TYPE[initialType] || document.body.dataset.service;
  const card = service && document.querySelector(`#step-1 .selectable-card[onclick*="'${service}'"]`);
  if (card) selectService(card, service);
  if (initialType === 'degustacion' || initialType === 'muestra_carne' || initialType === 'muestra_corporativo') document.getElementById('quoteFrequency').value = 'muestra';
  modal.classList.add('active');
  goToStep(1, false);
  // Diálogo modal: lo de atrás queda inerte (no se tabula ni se lee) y el foco entra a la ventana
  quoteOpener = document.activeElement;
  [...document.body.children].forEach(el => { if (el !== modal) el.inert = true; });
  modal.querySelector('#step-1 .selectable-card.selected, #step-1 .selectable-card')?.focus({ preventScroll: true });
  if (!prefersReducedMotion.matches) {
    document.querySelectorAll('#step-1 .selectable-card').forEach((card, i) => card.animate(
      [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
      { duration: 250, delay: 60 + i * 40, easing: stepEase, fill: 'backwards' }
    ));
  }
}

let quoteOpener = null;

function closeQuoteModal() {
  const modal = document.getElementById('quoteModal');
  if (!modal.classList.contains('active')) return;
  modal.classList.remove('active');
  [...document.body.children].forEach(el => { el.inert = false; });
  quoteOpener?.focus({ preventScroll: true });
}

(() => {
  const win = document.querySelector('#quoteModal .modal-window');
  if (!win) return;
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-modal', 'true');
  win.setAttribute('aria-label', 'Solicitar cotización');
})();

function closeModalOnBackdrop(e) {
  if (e.target.id === 'quoteModal') closeQuoteModal();
}

// Transición entre pasos: avanzar sale a la izquierda y entra desde la derecha; retroceder, al revés
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const stepEase = 'cubic-bezier(0.23, 1, 0.32, 1)';
let stepTransition = null;

function swapStep(target, dir, animate = true) {
  if (stepTransition) { // interrumpible: corta la anterior sin ejecutar su final pendiente
    stepTransition.onfinish = null;
    stepTransition.cancel();
    stepTransition = null;
  }
  const current = document.querySelector('.wizard-step.active');
  const show = () => {
    document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
    target.classList.add('active');
  };
  if (!animate || !current || current === target) { show(); return; }

  const reduce = prefersReducedMotion.matches;
  const out = current.animate(
    reduce ? [{ opacity: 1 }, { opacity: 0 }]
           : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-12 * dir}px)` }],
    { duration: 120, easing: 'ease-out' }
  );
  stepTransition = out;
  out.onfinish = () => {
    show();
    stepTransition = target.animate(
      reduce ? [{ opacity: 0 }, { opacity: 1 }]
             : [{ opacity: 0, transform: `translateX(${16 * dir}px)` }, { opacity: 1, transform: 'none' }],
      { duration: 220, easing: stepEase }
    );
    stepTransition.onfinish = () => { stepTransition = null; };
  };
}

function goToStep(stepNumber, animate = true) {
  const current = document.querySelector('.wizard-step.active');
  const currentNum = parseInt((current && current.id.split('-')[1]) || '0', 10) || 0;
  const target = document.getElementById(`step-${stepNumber}`);
  if (!target) return;
  swapStep(target, stepNumber >= currentNum ? 1 : -1, animate);

  document.querySelectorAll('.step-tick').forEach((tick, i) => tick.classList.toggle('active', i < stepNumber));
}

function selectService(element, serviceName) {
  document.querySelectorAll('.selectable-card').forEach(card => {
    card.classList.toggle('selected', card === element);
    card.setAttribute('aria-pressed', card === element);
  });
  selectedServiceName = serviceName;
  setVolumeUnit(serviceName === 'Proteínas' ? 'kg' : 'raciones');
}

// Paso 2: un restaurante compra proteína por kilos a la semana, no por raciones al día
const VOLUME_OPTIONS = {
  raciones: {
    label: 'Raciones aproximadas / personas por día:',
    options: [['20-50', '20 a 50 raciones'], ['50-150', '50 a 150 raciones'], ['150-500', '150 a 500 raciones'], ['500+', 'Más de 500 raciones diarias']],
    selected: '50-150'
  },
  kg: {
    label: 'Consumo aproximado de proteína por semana:',
    options: [['20-50 kg/semana', '20 a 50 kg'], ['50-150 kg/semana', '50 a 150 kg'], ['150-400 kg/semana', '150 a 400 kg'], ['400+ kg/semana', 'Más de 400 kg semanales']],
    selected: '50-150 kg/semana'
  }
};

function setVolumeUnit(unit) {
  const select = document.getElementById('quoteVolume');
  if (!select || select.dataset.unit === unit) return;
  const cfg = VOLUME_OPTIONS[unit];
  select.dataset.unit = unit;
  document.querySelector('label[for="quoteVolume"]').textContent = cfg.label;
  select.replaceChildren(...cfg.options.map(([value, text]) => new Option(text, value, false, value === cfg.selected)));
}

// 4. ENVÍO DE SOLICITUDES
// Pegar aquí la URL de la implementación del Apps Script (ver apps-script/README.md).
// Mientras esté vacía, la solicitud se abre en WhatsApp para no perder el contacto.
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzABpnrJ8M3dhe4O5cvdX5WrZblN36VCl01jvAU70st2SI7_w18i6ug3PbxeP2Pnc-L/exec';
const WHATSAPP = '573126156192';

const SEND_ERROR = 'No pudimos confirmar el registro de su solicitud. Intente de nuevo o escríbanos por WhatsApp al 312 615 6192.';

// Error en línea, junto al botón de envío: no tapa la página como un alert() y lo leen los lectores de pantalla.
function showFormError(btn, message) {
  let box = btn.parentElement.querySelector('.form-error');
  if (!box) {
    box = document.createElement('p');
    box.className = 'form-error';
    box.setAttribute('role', 'alert');
    btn.parentElement.insertBefore(box, btn);
  }
  box.textContent = message;
}

function clearFormError(btn) {
  btn.parentElement.querySelector('.form-error')?.remove();
}

async function sendLead(data, btn) {
  const label = btn.textContent;
  clearFormError(btn);
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  try {
    if (!SHEETS_URL) {
      const text = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Solicitud desde la web\n' + text)}`, '_blank');
      return true;
    }
    // Apps Script responde "ok" solo si guardó la fila; cualquier otra respuesta es un registro perdido.
    const res = await fetch(SHEETS_URL, { method: 'POST', body: new URLSearchParams({ ...data, pagina: location.href }) });
    if ((await res.text()).trim() !== 'ok') throw new Error('La hoja no confirmó el registro');
    return true;
  } catch (err) {
    showFormError(btn, SEND_ERROR);
    return false;
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
}

async function submitQuote() {
  const val = id => document.getElementById(id).value.trim();
  const data = {
    origen: 'Cotizador',
    servicio: selectedServiceName,
    volumen: val('quoteVolume'),
    modalidad: val('quoteFrequency'),
    nombre: val('contactName'),
    empresa: val('contactCompany'),
    correo: val('contactEmail'),
    telefono: val('contactPhone'),
    mensaje: val('contactMessage')
  };

  if (!validateFields(['contactName', 'contactCompany', 'contactEmail', 'contactPhone', 'quoteConsent'])) return;

  // Anillo de carga visible al menos 700 ms para que no parpadee
  showWizardStep('step-sending');
  const [ok] = await Promise.all([
    sendLead(data, document.getElementById('quoteSubmitBtn')),
    new Promise(r => setTimeout(r, 700))
  ]);
  showWizardStep(ok ? 'step-success' : 'step-3');
}

// Validación antes de enviar: el navegador acepta "   " como nombre, "juan@clinica" como correo
// y cualquier texto como teléfono. Muestra el aviso nativo en el primer campo con problema.
function fieldError(el) {
  if (el.type === 'checkbox') return el.checked ? '' : 'Debe autorizar el tratamiento de datos para enviar la solicitud.';
  const v = el.value.trim();
  if (el.required && !v) return 'Complete este campo.';
  if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Escriba un correo válido, por ejemplo nombre@empresa.com.';
  if (el.type === 'tel' && v && (v.match(/\d/g) || []).length < 7) return 'Escriba un teléfono con al menos 7 dígitos.';
  return '';
}

function validateFields(ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    const msg = fieldError(el);
    el.setCustomValidity(msg);
    if (msg) {
      el.reportValidity();
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => el.setCustomValidity(''), { once: true });
      return false;
    }
  }
  return true;
}

// Cambia de paso sin tocar la barra de progreso (que ya está completa en el paso 3)
function showWizardStep(id) {
  swapStep(document.getElementById(id), id === 'step-3' ? -1 : 1);
}

async function handleDirectContact(e) {
  e.preventDefault();
  if (!validateFields(['dirName', 'dirCompany', 'dirEmail', 'dirPhone'])) return;
  const val = id => document.getElementById(id).value.trim();
  const data = {
    hp_control: document.getElementById('dirHp').value, // campo trampa: el servidor descarta el envío si viene lleno
    origen: 'Formulario de contacto',
    servicio: val('dirService'),
    nombre: val('dirName'),
    empresa: val('dirCompany'),
    correo: val('dirEmail'),
    telefono: val('dirPhone'),
    mensaje: val('dirMessage')
  };
  const pane = document.querySelector('.contact-form-pane');
  pane.style.minHeight = pane.offsetHeight + 'px'; // la tarjeta conserva su alto: la página no salta
  showContactStep('contact-sending');
  const [ok] = await Promise.all([
    sendLead(data, document.getElementById('dirSubmitBtn')),
    new Promise(r => setTimeout(r, 700))
  ]);
  if (ok) {
    e.target.reset();
    showContactStep('contact-success');
  } else {
    resetContactForm(false);
  }
}

function showContactStep(id) {
  const pane = document.querySelector('.contact-form-pane');
  pane.querySelectorAll('.flow-step').forEach(step => step.classList.toggle('active', step.id === id));
  pane.classList.add('is-status');
}

function resetContactForm(focus = true) {
  const pane = document.querySelector('.contact-form-pane');
  pane.querySelectorAll('.flow-step').forEach(step => step.classList.remove('active'));
  pane.classList.remove('is-status');
  pane.style.minHeight = '';
  if (focus) document.getElementById('dirName').focus();
}

// 7. ETIQUETAS CON DESCRIPCIÓN (dietas, modalidades y cortes)
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.diet-badge-group').forEach(group => {
    const desc = group.nextElementSibling;
    const tags = [...group.querySelectorAll('button.diet-tag')];
    const show = (tag, animate) => {
      tags.forEach(t => {
        const on = t === tag;
        t.classList.toggle('highlight', on);
        t.setAttribute('aria-pressed', on);
      });
      desc.textContent = tag.dataset.desc;
      if (animate) {
        desc.animate(
          reduce ? [{ opacity: 0 }, { opacity: 1 }]
                 : [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }],
          { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
        );
      }
    };
    tags.forEach(t => t.addEventListener('click', () => { if (t.getAttribute('aria-pressed') !== 'true') show(t, true); }));
    show(group.querySelector('.highlight') || tags[0], false);
  });
})();

// 8. PREGUNTAS FRECUENTES: la tarjeta crece o se encoge en vez de saltar
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(0.23, 1, 0.32, 1)';
  document.querySelectorAll('.faq-list details').forEach(item => {
    const summary = item.querySelector('summary');
    const answer = item.querySelector('p');
    let anim = null;

    summary.addEventListener('click', e => {
      if (reduce.matches) return; // comportamiento nativo, sin movimiento
      e.preventDefault();
      const opening = !item.open || item.classList.contains('closing');
      const from = item.offsetHeight; // interrumpible: parte de la altura actual
      if (anim) anim.cancel();

      item.classList.toggle('closing', !opening);
      if (opening) item.open = true;
      const to = opening ? item.scrollHeight + 2 : summary.offsetHeight + 2; // + bordes

      anim = item.animate([{ height: from + 'px' }, { height: to + 'px' }], {
        duration: opening ? 300 : 220,
        easing: opening ? ease : 'ease-out'
      });
      item.style.overflow = 'hidden';
      if (opening) {
        answer.animate(
          [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }],
          { duration: 260, delay: 60, easing: ease, fill: 'backwards' }
        );
      }
      anim.onfinish = () => {
        anim = null;
        item.style.overflow = '';
        if (!opening) { item.open = false; item.classList.remove('closing'); }
      };
    });
  });
})();

// 6. WHATSAPP FLOTANTE
(() => {
  const btn = document.getElementById('waFloat');
  const heroCtas = document.querySelector('.hero-ctas');
  const form = document.querySelector('.contact-form-pane');
  if (!btn) return;
  // Visible después de pasar los botones del inicio (o 400 px en páginas sin ellos, como las guías);
  // oculto mientras el formulario ocupa la pantalla
  function update() {
    const pastHero = heroCtas ? heroCtas.getBoundingClientRect().bottom < 0 : window.scrollY > 400;
    const f = form && form.getBoundingClientRect();
    const onForm = !!f && f.top < window.innerHeight * 0.75 && f.bottom > window.innerHeight * 0.25;
    btn.classList.toggle('visible', pastHero && !onForm);
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// 5. MENÚ: RESALTA LA SECCIÓN EN PANTALLA
(() => {
  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = links.map(a => document.getElementById(decodeURIComponent(a.hash.slice(1))));
  const indicator = document.querySelector('.nav-indicator');
  if (!indicator || !links.length) return;
  let current = null;
  let lockUntil = 0;

  function setActive(link) {
    if (link === current) return;
    current = link;
    links.forEach(a => a === link ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
    place();
  }

  function place() {
    if (!current) { indicator.style.opacity = '0'; return; }
    indicator.style.transform = `translateX(${current.offsetLeft}px) scaleX(${current.offsetWidth / 100})`;
    indicator.style.opacity = '1';
  }

  function onScroll() {
    if (Date.now() < lockUntil) return;
    const line = window.innerHeight * 0.35;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let active = null;
    sections.forEach((sec, i) => { if (sec && sec.getBoundingClientRect().top <= line) active = links[i]; });
    setActive(atBottom ? links[links.length - 1] : active);
  }

  // Al hacer clic se marca de inmediato, sin pasar por las secciones intermedias
  links.forEach(a => a.addEventListener('click', () => {
    lockUntil = Date.now() + 1000;
    setActive(a);
  }));
  window.addEventListener('scrollend', () => { lockUntil = 0; onScroll(); });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', place);

  onScroll();
  document.fonts.ready.then(() => {
    place();
    requestAnimationFrame(() => indicator.classList.add('ready'));
  });
})();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeQuoteModal();
});

// MENÚ EN MÓVIL: en ≤900 px el nav se oculta; este botón lo despliega bajo la cabecera
(() => {
  const header = document.querySelector('header');
  const nav = header?.querySelector('nav');
  const actions = header?.querySelector('.header-actions');
  if (!nav || !actions) return;
  nav.id = 'site-nav';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'nav-toggle';
  btn.setAttribute('aria-label', 'Menú');
  btn.setAttribute('aria-controls', 'site-nav');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  actions.prepend(btn);
  const setOpen = open => {
    header.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => setOpen(!header.classList.contains('nav-open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', e => { if (!header.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.classList.contains('nav-open')) { setOpen(false); btn.focus(); }
  });
})();

// 9. BARRA DE PROGRESO AL CAMBIAR DE PÁGINA
// La transición la hace el CSS (@view-transition). Esto solo da señal de vida
// cuando la siguiente página tarda: si carga en menos de 150 ms, la barra no aparece.
(() => {
  const bar = document.createElement('div');
  bar.className = 'nav-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let timer = null;

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return; // WhatsApp, correo, teléfono
    if (url.pathname === location.pathname && url.search === location.search) return; // ancla en la misma página
    clearTimeout(timer);
    timer = setTimeout(() => bar.classList.add('active'), 150);
  });

  // Al volver con el botón atrás la página sale de la caché: la barra debe estar apagada
  window.addEventListener('pageshow', () => {
    clearTimeout(timer);
    bar.classList.remove('active');
  });
})();


// 5. LA BANDEJA QUE SE ROTULA SOLA (página de alimentación hospitalaria)
// Al entrar la foto en pantalla, cada dato del rótulo se "escribe" solo, uno tras otro; si sale de pantalla se borra
// y vuelve a escribirse al regresar. Sin JS o con movimiento reducido el rótulo se ve completo.
(function () {
  const figure = document.getElementById('trayFigure');
  if (!figure || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const values = [...figure.querySelectorAll('.tray-row dd span')];
  const WRITE_MS = 750;  // lo que tarda en escribirse cada dato
  const GAP_MS = 550;    // pausa entre un dato y el siguiente
  let frame = 0;

  const setAll = t => values.forEach(el => el.style.setProperty('--t', t));

  function play() {
    cancelAnimationFrame(frame);
    const start = performance.now();
    const total = (values.length - 1) * GAP_MS + WRITE_MS;
    (function tick(now) {
      const elapsed = now - start;
      values.forEach((el, i) => {
        const t = Math.min(Math.max((elapsed - i * GAP_MS) / WRITE_MS, 0), 1);
        el.style.setProperty('--t', (1 - Math.pow(1 - t, 2)).toFixed(3));
      });
      if (elapsed < total) frame = requestAnimationFrame(tick);
    })(start);
  }

  setAll(0);
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { play(); } else { cancelAnimationFrame(frame); setAll(0); }
  }, { threshold: 0.6 }).observe(figure);
})();


// 6. TERMÓMETROS DE LA CADENA TÉRMICA (página de alimentación hospitalaria)
// Al entrar en pantalla el mercurio sube hasta el límite de cada rango (65 °C mínimo en caliente, 4 °C máximo en frío);
// no son lecturas, son los límites que la página promete. Sin JS o con movimiento reducido se ven completos.
(function () {
  const pair = document.getElementById('thermoPair');
  if (!pair || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const nums = [...pair.querySelectorAll('.thermo')].map(t => ({ el: t.querySelector('.thermo-num'), level: Number(t.dataset.level) }));
  const RISE_MS = 1600;
  let frame = 0;

  function setProgress(p) {
    pair.style.setProperty('--p', p.toFixed(3));
    nums.forEach(n => { n.el.textContent = Math.round(n.level * p); });
  }

  function play() {
    cancelAnimationFrame(frame);
    const start = performance.now();
    (function tick(now) {
      const t = Math.min((now - start) / RISE_MS, 1);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    })(start);
  }

  setProgress(0);
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { play(); } else { cancelAnimationFrame(frame); setProgress(0); }
  }, { threshold: 0.6 }).observe(pair);
})();
