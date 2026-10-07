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
const SERVICE_BY_TYPE = { clinico: 'Hospitalario', corporativo: 'Corporativo', evento: 'Evento', vacio: 'Proteínas', 'vacío': 'Proteínas', muestra_carne: 'Proteínas' };

function openQuoteModal(initialType) {
  const modal = document.getElementById('quoteModal');
  const service = SERVICE_BY_TYPE[initialType] || document.body.dataset.service;
  const card = service && document.querySelector(`#step-1 .selectable-card[onclick*="'${service}'"]`);
  if (card) selectService(card, service);
  if (initialType === 'degustacion' || initialType === 'muestra_carne') document.getElementById('quoteFrequency').value = 'muestra';
  modal.classList.add('active');
  goToStep(1, false);
  if (!prefersReducedMotion.matches) {
    document.querySelectorAll('#step-1 .selectable-card').forEach((card, i) => card.animate(
      [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
      { duration: 250, delay: 60 + i * 40, easing: stepEase, fill: 'backwards' }
    ));
  }
}

function closeQuoteModal() {
  const modal = document.getElementById('quoteModal');
  modal.classList.remove('active');
}

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

async function sendLead(data, btn) {
  const label = btn.textContent;
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
    alert('No pudimos confirmar el registro de su solicitud. Por favor intente de nuevo o escríbanos por WhatsApp al 312 615 6192.');
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
  if (document.getElementById('dirHp').value) return; // bot
  if (!validateFields(['dirName', 'dirCompany', 'dirEmail', 'dirPhone'])) return;
  const val = id => document.getElementById(id).value.trim();
  const data = {
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
