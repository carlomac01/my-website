const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $$ = s => [...document.querySelectorAll(s)];
const hero = document.querySelector('.hero');
const pillars = document.querySelector('.pillars');
const stage = document.querySelector('.stage');
const nav = document.querySelector('.nav');
const scenes = $$('.scene'), tabs = $$('.rail button');
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const journey = document.querySelector('.journey'), jstage = document.querySelector('.jstage');
const chaps = $$('.chap'), jbtn = $$('.jrail button'), ageEl = document.getElementById('age'), yrEl = document.getElementById('yr');
const ageAnchors = [16, 18, 20, 21, 24];
let lastAge = 0;

// Split the hero name into letters so each can react on its own
let n = 0;
const letters = [];
$$('.hero h1 span').forEach(s => {
  const t = s.textContent; s.textContent = ''; s.setAttribute('aria-hidden', 'true');
  [...t].forEach(ch => { const i = document.createElement('i'); i.textContent = ch; i.style.setProperty('--i', n++); s.appendChild(i); letters.push(i); });
});

// Services: the takeover and the capability dossier
const SV_DATA = [
  [["Diagnostic Skills","M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5M7 11h2l1.5-3 2 6 1.5-3H15","I'm able to identify the cause of hardware, software, and network issues through troubleshooting, testing, and analysis."],
   ["Computer Hardware Repairs","M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4","I'm able to repair, replace, upgrade, and maintain computer components such as storage drives, memory, power supplies, cooling systems, and graphics cards."],
   ["Operating System Troubleshooting","M4 12a8 8 0 1 0 3-6.2M4 4v4h4M12 8v4l3 2","I'm able to diagnose and resolve operating system issues, including boot failures, driver conflicts, software errors, user account problems, and system recovery."],
   ["Device Repairs","M4 6h16v10H4zM2 19h20M10 11h4","I'm able to troubleshoot and repair desktops, laptops, printers, mobile devices, and peripheral equipment."],
   ["Networking Skills","M12 18h.01M8.5 14.5a5 5 0 0 1 7 0M5 11a10 10 0 0 1 14 0M2 8a15 15 0 0 1 20 0","I'm able to configure, troubleshoot, and maintain network devices and connectivity, including routers, Wi-Fi, printers, and extensive stuff like IP Connectivity, DHCP, DNS, VLANs and Switching, Routing and ACLs."],
   ["Software Installation and Configuration","M12 3v12M7 11l5 5 5-5M4 20h16","I'm able to install, configure, update, and optimize operating systems, applications, drivers, security software, and productivity tools to ensure devices are set up correctly and perform efficiently."],
   ["Customer Service and Communication","M4 5h16v11H9l-5 4zM8 9h8M8 12h5","I'm able to explain technical issues in clear, non-technical language, provide recommendations, and assist users in resolving technology-related problems, given that I've worked in the education sector, I'm able to communicate users of broad age range (younger kids to elderly parents/guardians)."],
   ["Safety and Best Practices","M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4","I'm able to follow safe repair procedures, protect user data, implement backup and recovery processes, and handle equipment using industry best practices."]],
  [["Photo Editing","M3 6h18v13H3zM8 6l1.5-2h5L16 6M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z","I'm able to edit, enhance, and retouch photos using professional tools such as Photoshop and Lightroom, including colour correction, object removal, compositing, and image optimisation."],
   ["Video Editing","M3 6h12v12H3zM15 10l6-3v10l-6-3","I'm able to create and edit video content by cutting footage, adding transitions, effects, motion graphics, subtitles, sound, and colour grading using tools such as CapCut and DaVinci Resolve."],
   ["Motion Graphics and Visual Effects","M5 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM15 4l5 8h-10zM13 14h8v6h-8z","I'm able to create animations, visual effects, titles, and motion graphics for videos, social media content, and promotional material using DaVinci Resolve."],
   ["Music Production and Audio Editing","M9 18V6l10-2v12M6.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM16.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z","I'm able to produce, edit, mix, and enhance audio and music projects using FL Studio, including recording, sequencing, mastering, and sound design."],
   ["Exporting and Media Delivery","M12 15V3M7 8l5-5 5 5M4 15v5h16v-5","I'm able to optimise and export media in appropriate formats and resolutions for social media, websites, presentations, print, and other platforms."]],
  [["Web Development","M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18","I'm able to design, build, and maintain responsive websites using HTML, CSS, JavaScript, and modern web development practices."],
   ["Desktop Application Development","M3 4h18v12H3zM8 20h8M12 16v4","I'm able to create desktop applications using Visual Studio and relevant programming frameworks, including user interfaces, data management, and application functionality."],
   ["Mobile Application Development","M7 2h10v20H7zM11 18h2","I'm able to develop and maintain mobile applications, implementing user-friendly interfaces, functionality, and integration with external services where required."],
   ["Front-End Development","M3 4h18v16H3zM3 9h18M7 13h5v4H7zM15 13h2M15 16h2","I'm able to create intuitive and visually appealing user interfaces, focusing on usability, accessibility, responsiveness, and user experience."],
   ["Back-End Development","M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01M12 7h5M12 17h5","I'm able to develop application logic, databases, APIs, and server-side functionality that support websites and applications."],
   ["Development Tools and Environments","M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16","I'm able to use professional development tools such as Visual Studio, Visual Studio Code, Git, and debugging utilities to build, test, and maintain software."],
   ["Testing and Debugging","M9 7a3 3 0 0 1 6 0v1H9zM7 11h10v4a5 5 0 0 1-10 0zM3 11l4 1M21 11l-4 1M3 19l4-2M21 19l-4-2M12 11v10","I'm able to identify, troubleshoot, and resolve software issues through testing, debugging, performance analysis, and code review."],
   ["Database Management","M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6","I'm able to design, create, and manage databases, including storing, retrieving, and organising application data efficiently, with both SQL or NoSQL."]],
  [["Microsoft 365 Administration","M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z","I'm able to utilise Microsoft 365 applications including Outlook, Word, Excel, PowerPoint, Teams, Forms, SharePoint, and Power Automate to support business operations and improve productivity."],
   ["Google Workspace Administration","M7 18a4 4 0 1 1 .9-7.9A5.5 5.5 0 0 1 18.5 11 3.5 3.5 0 0 1 18 18z","I'm able to manage and utilise Google Workspace tools including Gmail, Calendar, Drive, Docs, Sheets, Forms, and Meet for collaboration, communication, and document management."],
   ["Calendar and Inbox Management","M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h2M12 14h2M8 17h2","I'm able to manage calendars, appointments, shared inboxes, email correspondence, meeting scheduling, and follow-up activities to ensure efficient communication and organisation."],
   ["Data Entry and Record Management","M2 7h20v10H2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10","I'm able to accurately enter, maintain, validate, and organise data while ensuring information is complete, consistent, and easily accessible."],
   ["Document Control and Filing","M3 6h6l2 2h10v11H3z","I'm able to create, organise, maintain, and manage digital and physical records using structured filing systems, version control processes, and document retention practices."],
   ["Spreadsheet Management and Analysis","M3 4h18v16H3zM3 9h18M9 4v16M13 18v-5M17 18v-8","I'm able to create, maintain, and analyse spreadsheets using formulas, functions, pivot tables, charts, and data-cleaning techniques to support reporting and decision-making."],
   ["Reporting and Documentation","M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7","I'm able to prepare professional reports, meeting notes, minutes, procedures, manuals, and business documentation that communicate information clearly and accurately."],
   ["Customer and Stakeholder Support","M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H4zM17 14h3v5h-3zM17 19c0 1.5-2 2-5 2","I'm able to manage customer enquiries, follow-ups, service requests, and stakeholder communications while maintaining professional relationships and high service standards."],
   ["Workflow and Workspace Systems","M4 4h6v7H4zM14 4h6v4h-6zM14 12h6v8h-6zM4 15h6v5H4z","I'm able to design, organise, and manage digital workspaces using platforms such as Notion, Trello, Microsoft Lists, and other productivity tools to improve collaboration and task management."],
   ["Process Automation","M13 2L4 14h7l-1 8 9-12h-7z","I'm able to streamline repetitive tasks and business processes through workflow automation using tools such as Microsoft Power Automate, forms, approvals, notifications, and integrations."],
   ["Forms and Information Collection","M9 3h6v3H9zM6 5h12v16H6zM9 13l2 2 4-4","I'm able to create and manage digital forms, surveys, registrations, and data collection processes using Microsoft Forms and Google Forms."],
   ["Ticketing and Service Management","M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM14 7v10","I'm able to establish and maintain ticketing systems, shared inbox workflows, service request processes, and support procedures to improve operational efficiency."],
   ["Document Formatting and Branding","M4 4h16v4H4zM12 8v13M8 21h8","I'm able to produce professional business documents that align with organisational branding standards, including templates, styling, formatting, and publication-ready materials."],
   ["File Conversion and Content Management","M4 8h14l-3-3M20 16H6l3 3","I'm able to convert, organise, and manage documents across different formats and platforms while preserving accuracy, accessibility, and usability."],
   ["Business Process Improvement","M3 17l6-6 4 4 8-8M15 7h6v6","I'm able to identify inefficiencies, recommend improvements, and implement practical solutions that enhance productivity, organisation, and workflow effectiveness."]]
];
const sv = document.querySelector('.services'), svDark = document.querySelector('.sv-dark'), svStage = document.querySelector('.sv-stage');
const beats = $$('.beat'), dscs = $$('.dsc'), dtabs = $$('.dtabs button'), dossier = document.querySelector('.dossier');
const shutter = document.querySelector('.shutter'), flash = document.querySelector('.flash');
let flipped = false, flipBusy = false, svCat = -1, svHold = 0;
const svFocus = [0, 0, 0, 0];

function typeInto(el, text) {
  clearInterval(el._t);
  if (reduce || sv.classList.contains('flat')) { el.textContent = text; return; }
  let n = 0; el.textContent = '';
  el._t = setInterval(() => { n += 2; el.textContent = text.slice(0, n); if (n >= text.length) clearInterval(el._t); }, 16);
}
function focusSkill(c, i, manual) {
  const d = dscs[c], it = SV_DATA[c][i]; svFocus[c] = i;
  d.querySelectorAll('.chip').forEach((b, k) => {
    b.classList.toggle('on', k === i);
    if (k === i) { b.classList.remove('run'); void b.offsetWidth; b.classList.add('run'); } else b.classList.remove('run');
  });
  d.querySelector('.dh').textContent = '> ' + it[0];
  typeInto(d.querySelector('.dtx'), it[2]);
  if (manual) svHold = performance.now() + 12000;
}
dscs.forEach((d, c) => {
  const list = d.querySelector('.dlist');
  list.innerHTML = SV_DATA[c].map(it => `<button class="chip"><svg class="ic"><path d="${it[1]}"/></svg><span>${it[0]}</span><i class="bar"></i></button>`).join('');
  list.querySelectorAll('.chip').forEach((b, i) => { b.addEventListener('mouseenter', () => focusSkill(c, i, true)); b.addEventListener('click', () => focusSkill(c, i, true)); });
  focusSkill(c, 0);
});
setInterval(() => {
  if (reduce || svCat < 0 || sv.classList.contains('flat') || performance.now() < svHold) return;
  focusSkill(svCat, (svFocus[svCat] + 1) % SV_DATA[svCat].length);
}, 7000);

// Generated artwork: equalizer bars, radar blips
(function () {
  const w = document.querySelector('.wvs');
  if (w) { let h = ''; for (let k = 0; k < 36; k++) { const hh = 14 + Math.abs(Math.sin(k * 0.7) * 50) + (k % 5) * 6; h += `<rect class="wv" style="--t:${(0.5 + (k * 37 % 10) / 12).toFixed(2)}s" x="${20 + k * 7.8}" y="${(80 - hh / 2).toFixed(1)}" width="4" height="${hh.toFixed(1)}" rx="2"/>`; } w.innerHTML = h; }
  const sh = document.querySelector('.sheet');
  if (sh) { let h = ''; for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 4; c2++) h += `<rect class="cellr${r === 0 ? ' hd' : ''}" style="--d:${((r * 4 + c2) * 0.37 % 3).toFixed(2)}s" x="${20 + c2 * 38}" y="${20 + r * 24}" width="36" height="22" rx="3"/>`; sh.innerHTML = h; }
  const b = document.querySelector('.blips');
  if (b) b.innerHTML = [[35, 55, 'g'], [100, 75, 'r'], [150, 60, 'g'], [215, 40, 'g'], [260, 68, 'r'], [310, 80, 'g']].map(([a, r, t]) => {
    const x = (160 + r * Math.sin(a * Math.PI / 180)).toFixed(1), y = (100 - r * Math.cos(a * Math.PI / 180)).toFixed(1);
    return `<circle class="bl ${t}" style="--d:${(a / 360 * 4).toFixed(2)}s" cx="${x}" cy="${y}" r="${t === 'r' ? 6 : 4.5}"/>`;
  }).join('');
})();

function setFlip(f, quiet) {
  if (f === flipped || flipBusy) return;
  const apply = () => { flipped = f; document.body.classList.toggle('flipped', f); };
  if (reduce || quiet) { apply(); return; }
  flipBusy = true;
  shutter.classList.remove('go'); void shutter.offsetWidth; shutter.classList.add('go');
  setTimeout(() => {
    apply();
    if (f) {
      flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');
      svStage.classList.remove('shake'); void svStage.offsetWidth; svStage.classList.add('shake');
    }
  }, 170);
  setTimeout(() => { flipBusy = false; update(); }, 950);
}
function setCat(ci) {
  if (ci === svCat) return; svCat = ci;
  document.body.dataset.th = ci >= 0 ? ci : 0;
  dscs.forEach((d, k) => d.classList.toggle('on', k === ci));
  dtabs.forEach((b, k) => b.classList.toggle('on', k === ci));
  dossier.classList.toggle('on', ci >= 0);
  if (ci >= 0) focusSkill(ci, 0);
}
function servicesUpdate(pinned, vh) {
  sv.classList.toggle('flat', !pinned);
  if (!pinned) return;
  const r = sv.getBoundingClientRect(), u = clamp(-r.top / vh, 0, 10.1);
  const ct = contact ? contact.getBoundingClientRect().top : 1e9;
  const want = u >= .7 && ct > 60;
  setFlip(want, u > 8);
  beats.forEach((b, k) => b.classList.toggle('on', want && u >= .7 + .8 * k && u < .7 + .8 * (k + 1)));
  setCat(want && u >= 3.9 ? Math.min(Math.floor((u - 3.9) / 1.3), 3) : -1);
}
dtabs.forEach((b, k) => b.addEventListener('click', () => {
  const r = sv.getBoundingClientRect();
  scrollTo({ top: scrollY + r.top + (3.9 + 1.3 * k + .65) * innerHeight });
}));
// Stacked layout: flip the page while the dark block is mid-screen
new IntersectionObserver(es => es.forEach(e => { if (sv.classList.contains('flat')) setFlip(e.isIntersecting); }), { rootMargin: '-40% 0px -40% 0px' }).observe(svDark);

// Contact: headline letters react to the cursor, spheres drift, copy button
const contact = document.querySelector('.contact'), clayers = $$('.clayer'), say = document.querySelector('.say');
const sayLetters = [];
if (say) {
  say.setAttribute('aria-label', say.textContent.replace(/\s+/g, ' ').trim());
  say.querySelectorAll('.w').forEach(w => {
    const t = w.textContent; w.textContent = ''; w.setAttribute('aria-hidden', 'true');
    [...t].forEach(ch => { const i = document.createElement('i'); i.textContent = ch; w.appendChild(i); sayLetters.push(i); });
  });
}
(function () {
  const btn = document.querySelector('.copybtn'); if (!btn) return;
  btn.addEventListener('click', () => {
    const mail = document.querySelector('.mail').textContent.trim();
    const done = () => {
      btn.textContent = 'Copied!'; btn.classList.add('done');
      setTimeout(() => { btn.textContent = 'Copy email'; btn.classList.remove('done'); }, 1900);
      if (!reduce) for (let k = 0; k < 14; k++) {
        const s = document.createElement('i'), a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 60;
        s.className = 'burst'; s.style.left = btn.offsetLeft + btn.offsetWidth / 2 + 'px'; s.style.top = btn.offsetTop + btn.offsetHeight / 2 + 'px';
        s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
        btn.parentNode.appendChild(s); setTimeout(() => s.remove(), 950);
      }
    };
    const fallback = () => { const t = document.createElement('textarea'); t.value = mail; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); done(); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(mail).then(done, fallback); else fallback();
  });
})();

// Scroll-driven state
let cur = -1;
function play(sc) {
  sc.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, d = +(el.dataset.dec || 0);
    if (reduce) { el.textContent = to.toFixed(d); return; }
    const t0 = performance.now();
    (function f(t) { const k = Math.min((t - t0) / 1700, 1); el.textContent = (to * (1 - Math.pow(1 - k, 3))).toFixed(d); if (k < 1) requestAnimationFrame(f); })(t0);
  });
}
function setScene(i) {
  if (i === cur) return; cur = i;
  scenes.forEach((s, k) => { const on = k === i; if (on && !s.classList.contains('on')) play(s); s.classList.toggle('on', on); });
  tabs.forEach((b, k) => b.classList.toggle('on', k === i));
}
function update() {
  nav.classList.toggle('scrolled', scrollY > 20);
  const vh = innerHeight;
  if (!reduce) hero.style.setProperty('--p', Math.min(Math.max(scrollY / (vh * 0.9), 0), 1).toFixed(3));
  const pinned = !reduce && matchMedia('(min-width: 821px)').matches;
  pillars.classList.toggle('flat', !pinned);
  journeyUpdate(pinned, vh);
  servicesUpdate(pinned, vh);
  if (!pinned) { cur = -1; return; }
  const r = pillars.getBoundingClientRect();
  const q = Math.min(Math.max(-r.top / (r.height - vh), 0), 0.999);
  stage.style.setProperty('--q', q.toFixed(3));
  setScene(r.top > vh * 0.4 || r.bottom < vh * 0.6 ? -1 : Math.floor(q * scenes.length));
}
let ticking = false;
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); } }, { passive: true });
addEventListener('resize', update);
update();

// Reveals and nav highlight
const reveal = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); }
}), { threshold: 0.3 });
$$('.rv, .row, .say').forEach(el => reveal.observe(el));

const links = $$('.nav ul a');
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  links.forEach(a => a.getAttribute('href') === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

// Continuous motion: parallax, word band, cursor, magnets, letter weight
if (!reduce) {
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, gx = mx, gy = my, px = 0, py = 0;
  let lastY = scrollY, skew = 0;
  const layers = $$('.layer'), jarts = $$('.jart');
  const track = document.querySelector('.track');
  const band = document.querySelector('.band');
  const mags = fine ? $$('.nav a, .mail, .links a, .copybtn').map(el => (el.classList.add('mag'), { el, x: 0, y: 0 })) : [];
  let dot, ring, glow;

  if (fine) {
    document.body.classList.add('has-cursor');
    [dot, ring, glow] = ['cur', 'ring', 'glow'].map(c => { const d = document.createElement('div'); d.className = c; document.body.appendChild(d); return d; });
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      const row = e.target.closest('.row');
      if (row) { const b = row.getBoundingClientRect(); row.style.setProperty('--mx', e.clientX - b.left + 'px'); row.style.setProperty('--my', e.clientY - b.top + 'px'); }
    });
    document.addEventListener('mouseover', e => ring.classList.toggle('big', !!e.target.closest('a,button')));
  }

  (function loop() {
    const vh = innerHeight;
    // Hero spheres: scroll parallax everywhere, plus mouse parallax with a pointer
    px += ((mx / innerWidth - .5) * 2 - px) * .06;
    py += ((my / vh - .5) * 2 - py) * .06;
    layers.forEach(l => { const d = +l.dataset.d; l.style.transform = `translate3d(${-px * d * 300}px,${-py * d * 300 - scrollY * d * 1.6}px,0)`; });

    jarts.forEach(a => { a.style.transform = `perspective(900px) rotateY(${(px * 5).toFixed(2)}deg) rotateX(${(-py * 4).toFixed(2)}deg)`; });
    // Word band slides with scroll and leans into fast scrolling
    const vel = scrollY - lastY; lastY = scrollY;
    skew += (Math.max(-10, Math.min(10, -vel * .25)) - skew) * .12;
    track.style.transform = `translateX(${(band.getBoundingClientRect().top - vh) * .6}px) skewX(${skew.toFixed(2)}deg)`;

    if (fine) {
      rx += (mx - rx) * .18; ry += (my - ry) * .18; gx += (mx - gx) * .07; gy += (my - gy) * .07;
      dot.style.transform = `translate(${mx}px,${my}px)`;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      glow.style.transform = `translate(${gx}px,${gy}px)`;
      if (flipped) { svDark.style.setProperty('--mx', gx + 'px'); svDark.style.setProperty('--my', gy + 'px'); }
      if (contact) { const cr = contact.getBoundingClientRect(); if (cr.top < vh && cr.bottom > 0) {
        clayers.forEach(l => { const d = +l.dataset.d; l.style.transform = `translate3d(${(-px * d * 300).toFixed(1)}px,${(-py * d * 300 + cr.top * d * .5).toFixed(1)}px,0)`; });
        sayLetters.forEach(l => { const r = l.getBoundingClientRect(); l.style.setProperty('--w', Math.max(0, 1 - Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2)) / 300).toFixed(2)); });
      } }
      mags.forEach(m => {
        const r = m.el.getBoundingClientRect();
        const dx = mx - (r.left + r.width / 2 - m.x), dy = my - (r.top + r.height / 2 - m.y);
        const near = Math.hypot(dx, dy) < 110;
        m.x += ((near ? dx * .3 : 0) - m.x) * .15; m.y += ((near ? dy * .3 : 0) - m.y) * .15;
        m.el.style.transform = `translate(${m.x.toFixed(1)}px,${m.y.toFixed(1)}px)`;
      });
      if (scrollY < vh) letters.forEach(l => {
        const r = l.getBoundingClientRect();
        l.style.setProperty('--w', Math.max(0, 1 - Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2)) / 300).toFixed(2));
      });
    }
    requestAnimationFrame(loop);
  })();
}


// Pillars: tabs jump to a scene; scenes play on arrival when stacked
tabs.forEach((b, i) => b.addEventListener('click', () => {
  const r = pillars.getBoundingClientRect();
  scrollTo({ top: scrollY + r.top + (r.height - innerHeight) * ((i + .5) / scenes.length) });
}));
const sceneIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting && pillars.classList.contains('flat') && !e.target.classList.contains('on')) { e.target.classList.add('on'); play(e.target); }
}), { threshold: 0.2 });
scenes.forEach(s => sceneIO.observe(s));
dscs.forEach(d => sceneIO.observe(d));

// Generated artwork: camera aperture, mini keyboard with pads
(function () {
  const hole = document.querySelector('.hole');
  if (hole) {
    let pts = '', ln = '';
    for (let k = 0; k < 8; k++) {
      const a = (22.5 + 45 * k) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      pts += `${(80 + 30 * c).toFixed(1)},${(80 + 30 * s).toFixed(1)} `;
      ln += `<line x1="${(80 + 30 * c).toFixed(1)}" y1="${(80 + 30 * s).toFixed(1)}" x2="${(80 + 72 * c).toFixed(1)}" y2="${(80 + 72 * s).toFixed(1)}"/>`;
    }
    hole.innerHTML = `<polygon points="${pts}" fill="url(#gl)"/><g stroke="#0a121a" stroke-width="1.6">${ln}</g>`;
  }
  const kb = document.querySelector('.kb');
  if (kb) {
    let h = ''; const wx = 112, ww = 12.4;
    for (let i = 0; i < 15; i++) h += `<rect class="wk" x="${wx + i * ww}" y="14" width="${ww - 1}" height="58" rx="1.5"/>`;
    [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].forEach(i => h += `<rect class="bk" x="${wx + (i + 1) * ww - 4}" y="14" width="8" height="34" rx="1.5"/>`);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) h += `<rect class="pad" style="--d:${(r * 4 + c) * .25}s" x="${8 + c * 25}" y="${26 + r * 25}" width="21" height="21" rx="4"/>`;
    for (let k = 0; k < 4; k++) h += `<circle class="knob" cx="${19 + k * 25}" cy="14" r="5"/>`;
    kb.innerHTML = h;
  }
})();

// Camera aperture steps through f-stops while the Media Arts scene is on screen
const stops = [['f/1.4', 1.5], ['f/2', 1.3], ['f/2.8', 1.1], ['f/4', .9], ['f/5.6', .7], ['f/8', .5], ['f/11', .38]];
let si = 0;
const iris = document.querySelector('.iris'), fstop = document.querySelector('.fstop');
if (!reduce) setInterval(() => {
  if (!iris || !document.querySelector('.s-creative.on')) return;
  si = (si + 1) % stops.length;
  iris.style.setProperty('--s', stops[si][1]); fstop.textContent = stops[si][0];
}, 1100);


// Journey: horizontal timeline driven by scroll, with a running age
function journeyUpdate(pinned, vh) {
  journey.classList.toggle('flat', !pinned);
  if (!pinned) return;
  const r = journey.getBoundingClientRect();
  const u = clamp(-r.top / (r.height - vh), 0, 1) * 5;
  let pos = 0;
  for (let k = 0; k < 4; k++) { const t = clamp((u - (k + .75)) / .5, 0, 1); pos += t * t * (3 - 2 * t); }
  const i = Math.min(Math.floor(pos), 3), age = ageAnchors[i] + (ageAnchors[i + 1] - ageAnchors[i]) * (pos - i), a = Math.round(age);
  jstage.style.setProperty('--pos', pos.toFixed(3));
  jstage.style.setProperty('--f', (pos / 4).toFixed(3));
  if (a !== lastAge) {
    lastAge = a; ageEl.textContent = a; yrEl.textContent = a + 2002;
    ageEl.classList.remove('bump'); void ageEl.offsetWidth; ageEl.classList.add('bump');
  }
  const visible = r.top < vh * .5 && r.bottom > vh * .5;
  chaps.forEach((c, k) => {
    c.style.setProperty('--d', (pos - k).toFixed(3));
    const on = visible && Math.abs(pos - k) < .45;
    if (on && !c.classList.contains('on')) play(c);
    c.classList.toggle('on', on);
  });
  jbtn.forEach((b, k) => { b.classList.toggle('done', pos >= k - .05); b.classList.toggle('on', Math.round(pos) === k); });
}
jbtn.forEach((b, k) => b.addEventListener('click', () => {
  const r = journey.getBoundingClientRect(), total = r.height - innerHeight;
  const u = k === 0 ? .35 : k === 4 ? 4.6 : k + .5;
  scrollTo({ top: scrollY + r.top + total * (u / 5) });
}));
chaps.forEach(c => sceneIO.observe(c));

// Orbit of 2020 milestones
(function () {
  const o = document.querySelector('.orbit'); if (!o) return;
  const items = [['i-cap', 'Graduated school'], ['i-mail', 'RMIT offer'], ['i-brief', 'First job'], ['i-card', 'Driver’s licence'], ['i-house', 'Surviving COVID']];
  o.innerHTML = items.map((it, k) => {
    const a = (-90 + 72 * k) * Math.PI / 180, x = (230 + 112 * Math.cos(a)).toFixed(1), y = (170 + 112 * Math.sin(a)).toFixed(1);
    return `<g transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="48s" repeatCount="indefinite"/><circle r="28" class="bub"/><use href="#${it[0]}" x="-15" y="-15" width="30" height="30"/><text y="46" text-anchor="middle">${it[1]}</text></g></g>`;
  }).join('');
})();
