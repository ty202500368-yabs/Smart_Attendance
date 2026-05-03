const pageMap = {
  'teachers':               'page-teachers',
  'students':               'page-students',
  'students-subject-verify':'page-students-subject-verify',
  'rooms':                  'page-rooms',
  'prospectus':             'page-prospectus',
  'pros-bscs':              'page-pros-bscs',
  'pros-bsit':              'page-pros-bsit',
  'settings':               'page-settings',
};

function gotoPage(key) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(pageMap[key]);
  if (target) target.classList.add('active');

  const navMap = {
    teachers: 'nav-teachers',
    students: 'nav-students', 'students-subject-verify': 'nav-students',
    rooms: 'nav-rooms',
    prospectus: 'nav-prospectus', 'pros-bscs': 'nav-prospectus', 'pros-bsit': 'nav-prospectus',
    settings: 'nav-settings',
  };
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navId = navMap[key];
  if (navId) document.getElementById(navId)?.classList.add('active');
}

function toggleSub(el, subId) {
  const sub = document.getElementById(subId);
  const isOpen = sub.classList.toggle('open');
  el.classList.toggle('open', isOpen);
}

function setSubActive(el) {
  el.closest('.nav-sub').querySelectorAll('.nav-sub-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

function setTab(el) {
  el.closest('.tab-bar').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function setSettings(el, contentId) {
  document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.settings-content').forEach(c => c.classList.remove('active'));
  document.getElementById(contentId).classList.add('active');
}

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

/* ── Teacher search ── */
function filterTeachers() {
  const q = document.getElementById('teacher-search').value.toLowerCase();
  document.querySelectorAll('#teacher-tbody tr').forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

/* ── Student search ── */
function filterStudents() {
  const q = document.getElementById('student-search')?.value.toLowerCase() || '';
  document.querySelectorAll('.student-row').forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

/* ── Dept tabs — students ── */
function switchDept(el, panelId) {
  document.querySelectorAll('.dept-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#page-students .dept-panel').forEach(p => p.style.display = 'none');
  document.getElementById(panelId).style.display = 'block';
}

function switchDeptSV(el, panelId) {
  el.closest('.card').querySelectorAll('.dept-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#page-students-subject-verify .dept-panel').forEach(p => p.style.display = 'none');
  document.getElementById(panelId).style.display = 'block';
}

/* ── Student detail modal ── */
function openStudentModal(data) {
  document.getElementById('modal-student-title').textContent = 'Student — ' + data.name;
  document.getElementById('sd-name').value    = data.name;
  document.getElementById('sd-id').value      = data.id;
  document.getElementById('sd-program').value = data.program;
  document.getElementById('sd-section').value = data.section;
  document.getElementById('sd-email').value   = data.email;
  document.getElementById('sd-status').value  = data.status;
  document.getElementById('sd-pw').value  = '';
  document.getElementById('sd-pw2').value = '';
  const subEl = document.getElementById('sd-subjects');
  subEl.innerHTML = data.subjects.map(s =>
    `<span class="subject-pill">${s} <span class="sp-units">3 u</span></span>`
  ).join('');
  openModal('modal-student-detail');
}

function saveStudentDetail() {
  const pw  = document.getElementById('sd-pw').value;
  const pw2 = document.getElementById('sd-pw2').value;
  if (pw && pw !== pw2) { alert('Passwords do not match.'); return; }
  closeModal('modal-student-detail');
  alert('Student details saved successfully!');
}

/* ── COR Viewer ── */
function openCorModal(name, id, fileRef) {
  document.getElementById('cor-name-display').textContent = name;
  document.getElementById('cor-id-display').textContent = id;
  document.getElementById('cor-modal-title').innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> COR — ${name}`;
  document.getElementById('cor-file-label').innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> COR_${id}.pdf`;
  openModal('modal-cor-viewer');
}

function approveVerifyCard(btn) {
  const card = btn.closest('.verify-card');
  card.style.opacity = '.45';
  card.style.pointerEvents = 'none';
  const label = card.querySelector('.cor-status-badge');
  if (label) { label.textContent = 'VERIFIED'; label.style.background = 'var(--green)'; label.style.color = '#fff'; }
}

function rejectVerifyCard(btn) {
  const card = btn.closest('.verify-card');
  const reason = prompt('Reason for rejection (optional):');
  card.style.opacity = '.4';
  card.style.pointerEvents = 'none';
  const label = card.querySelector('.cor-status-badge');
  if (label) { label.textContent = 'REJECTED'; label.style.background = 'var(--red)'; label.style.color = '#fff'; }
}

/* ── Room Schedule (Active Schedules Panel) ── */
const activeRoomSchedules = [];

function submitRoomSchedule() {
  const room    = document.getElementById('rs-room').value;
  const subject = document.getElementById('rs-subject').value;
  const title   = document.getElementById('rs-title').value.trim() || subject;
  const teacher = document.getElementById('rs-teacher').value.trim() || '—';
  const section = document.getElementById('rs-section').value.trim() || '—';
  const from    = document.getElementById('rs-from').value;
  const to      = document.getElementById('rs-to').value;
  const days    = document.getElementById('rs-days').value;

  const entry = { room, subject, title, teacher, section, from, to, days, id: Date.now() };
  activeRoomSchedules.push(entry);
  renderActiveSchedules();
  closeModal('modal-add-room-sched');
  // clear
  document.getElementById('rs-title').value = '';
  document.getElementById('rs-teacher').value = '';
  document.getElementById('rs-section').value = '';
}

function removeRoomSchedule(id) {
  const idx = activeRoomSchedules.findIndex(e => e.id === id);
  if (idx > -1) activeRoomSchedules.splice(idx, 1);
  renderActiveSchedules();
}

function renderActiveSchedules() {
  const container = document.getElementById('active-sched-list');
  const noMsg = document.getElementById('no-sched-msg');
  document.getElementById('active-sched-count').textContent = activeRoomSchedules.length;
  if (activeRoomSchedules.length === 0) {
    container.innerHTML = '';
    container.appendChild(noMsg);
    noMsg.style.display = '';
    return;
  }
  noMsg.style.display = 'none';
  container.innerHTML = '';
  activeRoomSchedules.forEach(e => {
    const card = document.createElement('div');
    card.className = 'room-sched-card';
    card.innerHTML = `
      <div class="rsc-header">
        <span class="rsc-room">${e.room}</span>
        <button class="icon-btn icon-btn-red" style="margin-left:auto;width:22px;height:22px;" title="Remove" onclick="removeRoomSchedule(${e.id})">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="rsc-subject">${e.subject}</div>
      <div class="rsc-detail">${e.title}</div>
      <div class="rsc-meta"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${e.from} – ${e.to}</div>
      <div class="rsc-meta"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${e.days}</div>
      <div class="rsc-meta" style="color:var(--maroon)"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${e.teacher} · ${e.section}</div>
    `;
    container.appendChild(card);
  });
}

/* ── Time options helper ── */
const TIME_OPTS_FROM = ['7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM'];
const TIME_OPTS_TO   = ['7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM'];
const SUBJECT_OPTS   = ['CC 100','CC 101','CC 102','CC 103','CC 104','CC 105','CS 111','CS 121','CS 122','CS 124','CS 126','CS 128','CS 130','CS 131','CS 132','CS 133','CS 134','CS 135','CS 136','CS 137','CS 138','CS 139','CS 140','CS 141','CS 142','CS 143','MATH 100','MATH 101','GE 1','GE 3','PE 1','PE 2','NSTP 1','NSTP 2','ETHICS 101','HIST 100','HIST 101','LIT 101','FIL 101','FIL 102','STS 100'];
function makeTimeSelect(opts, def) { return `<select style="border:1px solid var(--border);border-radius:6px;font-size:12px;padding:4px 5px;width:90px">${opts.map(o=>`<option${o===def?' selected':''}">${o}</option>`).join('')}</select>`; }
function makeSubjectSelect(def) { return `<select style="border:1px solid var(--border);border-radius:6px;font-size:12px;padding:4px 6px;min-width:80px">${SUBJECT_OPTS.map(o=>`<option${o===def?' selected':''}">${o}</option>`).join('')}</select>`; }

/* ── Add subject row ── */
function addSubjectRow(containerId) {
  const container = document.getElementById(containerId);
  const div = document.createElement('div');
  div.className = 'form-grid-3';
  div.style.marginBottom = '10px';
  div.innerHTML = `
    <div class="field"><label>Subject Code</label>${makeSubjectSelect('CC 100')}</div>
    <div class="field"><label>Room</label><select style="padding:9px 13px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-family:DM Sans,sans-serif;font-size:13.5px;color:var(--text);background:#faf8f5"><option>LR1</option><option>LR2</option><option>LR3</option><option>LR4</option><option>LR5</option><option>LAB1</option><option>LAB2</option></select></div>
    <div class="field"><label>Day(s)</label><select><option>MWF</option><option>TTH</option><option>Daily</option><option>Saturday</option></select></div>
    <div class="field"><label>Time From</label>${makeTimeSelect(TIME_OPTS_FROM,'8:00 AM')}</div>
    <div class="field"><label>Time To</label>${makeTimeSelect(TIME_OPTS_TO,'9:00 AM')}</div>
    <div class="field" style="justify-content:flex-end;padding-top:20px"><button class="btn btn-danger btn-sm" onclick="this.closest('.form-grid-3').remove()">Remove</button></div>
  `;
  container.appendChild(div);
}

/* ── Add schedule row in teacher detail ── */
function addScheduleRow() {
  const tbody = document.querySelector('#modal-teacher-detail .schedule-mini-table tbody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${makeSubjectSelect('CS 111')}</td>
    <td><input style="border:none;background:transparent;font-family:DM Sans,sans-serif;font-size:13px;width:160px" placeholder="Subject Title"/></td>
    <td><select style="border:1px solid var(--border);border-radius:6px;font-size:12px;padding:4px 8px"><option>LR1</option><option>LR2</option><option>LR3</option><option>LR4</option><option>LR5</option><option>LAB1</option><option>LAB2</option></select></td>
    <td><select style="border:1px solid var(--border);border-radius:6px;font-size:12px;padding:4px 8px"><option>MWF</option><option>TTH</option><option>Daily</option><option>Saturday</option></select></td>
    <td style="white-space:nowrap">${makeTimeSelect(TIME_OPTS_FROM,'8:00 AM')}<span style="font-size:11px;color:var(--muted);margin:0 2px">–</span>${makeTimeSelect(TIME_OPTS_TO,'9:00 AM')}</td>
    <td><button class="icon-btn icon-btn-red btn-sm" onclick="this.closest('tr').remove()" title="Remove"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg></button></td>
  `;
  tbody.appendChild(tr);
}

/* ── Room Schedule Grid ── */
const rooms = ['LR1','LR2','LR3','LR4','LR5','LAB1','LAB2'];
let currentDay = 'SUN';

// slot index: 0=7:00, 1=7:30, 2=8:00, 3=8:30 ... 22=18:00, 23=18:30
// days: SUN MON TUE WED THU FRI SAT
const allSchedules = {
  SUN: [
    { room:'LR1',  startSlot:0,  endSlot:3,  subject:'GE 1',        teacher:'Ms. Gomez',     section:'BSCS 1A', isLab:false },
    { room:'LR1',  startSlot:6,  endSlot:9,  subject:'HIST 100',    teacher:'Mr. Santos',    section:'BSCS 4A', isLab:false },
    { room:'LR2',  startSlot:0,  endSlot:3,  subject:'CAS 101',     teacher:'Ms. Reyes',     section:'BSCS 1B', isLab:false },
    { room:'LR2',  startSlot:8,  endSlot:11, subject:'ETHICS 101',  teacher:'Mr. Lim',       section:'BSCS 3A', isLab:false },
    { room:'LR3',  startSlot:2,  endSlot:5,  subject:'CW 101',      teacher:'Ms. Mendoza',   section:'BSIT 1A', isLab:false },
    { room:'LR3',  startSlot:10, endSlot:13, subject:'STS 100',     teacher:'Mr. Santos',    section:'BSIT 2B', isLab:false },
    { room:'LR4',  startSlot:0,  endSlot:3,  subject:'LIT 101',     teacher:'Ms. Cruz',      section:'BSCS 2A', isLab:false },
    { room:'LR4',  startSlot:8,  endSlot:11, subject:'HIST 101',    teacher:'Mr. Santos',    section:'BSCS 4B', isLab:false },
    { room:'LR5',  startSlot:4,  endSlot:7,  subject:'A&H 100',     teacher:'Ms. Cruz',      section:'BSIT 4A', isLab:false },
    { room:'LAB1', startSlot:0,  endSlot:4,  subject:'CC 100',      teacher:'Ms. Reyes',     section:'BSCS 1A', isLab:true  },
    { room:'LAB1', startSlot:8,  endSlot:12, subject:'CC 102',      teacher:'Ms. Gomez',     section:'BSIT 1B', isLab:true  },
    { room:'LAB2', startSlot:2,  endSlot:6,  subject:'CS 125',      teacher:'Mr. Dela Cruz', section:'BSCS 2A', isLab:true  },
    { room:'LAB2', startSlot:10, endSlot:14, subject:'CS 127',      teacher:'Mr. Lim',       section:'BSCS 2B', isLab:true  },
  ],
  MON: [
    { room:'LR1',  startSlot:0,  endSlot:3,  subject:'CS 111',      teacher:'Ms. Reyes',     section:'BSCS 1A', isLab:false },
    { room:'LR1',  startSlot:6,  endSlot:9,  subject:'CS 131',      teacher:'Mr. Dela Cruz', section:'BSCS 3A', isLab:false },
    { room:'LR1',  startSlot:14, endSlot:17, subject:'CS 134',      teacher:'Ms. Gomez',     section:'BSCS 3B', isLab:false },
    { room:'LR2',  startSlot:2,  endSlot:5,  subject:'MATH 100',    teacher:'Mr. Santos',    section:'BSCS 1B', isLab:false },
    { room:'LR2',  startSlot:8,  endSlot:11, subject:'MATH 104',    teacher:'Mr. Santos',    section:'BSCS 2A', isLab:false },
    { room:'LR3',  startSlot:0,  endSlot:3,  subject:'CC 101',      teacher:'Ms. Reyes',     section:'BSIT 1A', isLab:false },
    { room:'LR3',  startSlot:6,  endSlot:9,  subject:'CS 122',      teacher:'Mr. Dela Cruz', section:'BSCS 2B', isLab:false },
    { room:'LR4',  startSlot:4,  endSlot:7,  subject:'CS 136',      teacher:'Ms. Mendoza',   section:'BSCS 3A', isLab:false },
    { room:'LR4',  startSlot:10, endSlot:13, subject:'CS 142',      teacher:'Ms. Cruz',      section:'BSCS 4A', isLab:false },
    { room:'LR5',  startSlot:2,  endSlot:5,  subject:'FIL 101',     teacher:'Ms. Cruz',      section:'BSCS 1A', isLab:false },
    { room:'LR5',  startSlot:8,  endSlot:11, subject:'US 101',      teacher:'Ms. Mendoza',   section:'BSIT 1B', isLab:false },
    { room:'LAB1', startSlot:0,  endSlot:4,  subject:'CC 101',      teacher:'Ms. Reyes',     section:'BSCS 1A', isLab:true  },
    { room:'LAB1', startSlot:8,  endSlot:12, subject:'CS 135',      teacher:'Mr. Dela Cruz', section:'BSCS 3A', isLab:true  },
    { room:'LAB2', startSlot:4,  endSlot:8,  subject:'CC 103',      teacher:'Ms. Gomez',     section:'BSCS 2A', isLab:true  },
    { room:'LAB2', startSlot:12, endSlot:16, subject:'CS 139',      teacher:'Mr. Lim',       section:'BSCS 3B', isLab:true  },
  ],
  TUE: [
    { room:'LR1',  startSlot:0,  endSlot:3,  subject:'CS 123',      teacher:'Ms. Reyes',     section:'BSCS 2A', isLab:false },
    { room:'LR1',  startSlot:8,  endSlot:11, subject:'CS 133',      teacher:'Mr. Lim',       section:'BSCS 3A', isLab:false },
    { room:'LR2',  startSlot:2,  endSlot:5,  subject:'MATH 103',    teacher:'Mr. Santos',    section:'BSCS 1A', isLab:false },
    { room:'LR2',  startSlot:10, endSlot:13, subject:'CS 120',      teacher:'Mr. Dela Cruz', section:'BSCS 2B', isLab:false },
    { room:'LR3',  startSlot:0,  endSlot:3,  subject:'FIL 102',     teacher:'Ms. Cruz',      section:'BSCS 1B', isLab:false },
    { room:'LR3',  startSlot:6,  endSlot:9,  subject:'CS 126',      teacher:'Ms. Reyes',     section:'BSCS 2A', isLab:false },
    { room:'LR3',  startSlot:14, endSlot:17, subject:'CS 132',      teacher:'Ms. Gomez',     section:'BSCS 3B', isLab:false },
    { room:'LR4',  startSlot:4,  endSlot:7,  subject:'CS 124',      teacher:'Mr. Dela Cruz', section:'BSCS 2B', isLab:false },
    { room:'LR4',  startSlot:12, endSlot:15, subject:'CS 143',      teacher:'Ms. Mendoza',   section:'BSCS 4A', isLab:false },
    { room:'LR5',  startSlot:0,  endSlot:3,  subject:'CW 101',      teacher:'Mr. Santos',    section:'BSIT 1A', isLab:false },
    { room:'LR5',  startSlot:8,  endSlot:11, subject:'STS 100',     teacher:'Ms. Mendoza',   section:'BSIT 1B', isLab:false },
    { room:'LAB1', startSlot:2,  endSlot:6,  subject:'CS 121',      teacher:'Ms. Reyes',     section:'BSCS 2A', isLab:true  },
    { room:'LAB1', startSlot:10, endSlot:14, subject:'CS 137',      teacher:'Mr. Dela Cruz', section:'BSCS 3A', isLab:true  },
    { room:'LAB2', startSlot:0,  endSlot:4,  subject:'CC 102',      teacher:'Ms. Gomez',     section:'BSIT 1A', isLab:true  },
    { room:'LAB2', startSlot:14, endSlot:18, subject:'CC 105',      teacher:'Mr. Lim',       section:'BSCS 3B', isLab:true  },
  ],
  WED: [
    { room:'LR1',  startSlot:0,  endSlot:3,  subject:'CS 111',      teacher:'Ms. Reyes',     section:'BSCS 1A', isLab:false },
    { room:'LR1',  startSlot:6,  endSlot:9,  subject:'CS 131',      teacher:'Mr. Dela Cruz', section:'BSCS 3A', isLab:false },
    { room:'LR1',  startSlot:14, endSlot:17, subject:'CS 134',      teacher:'Ms. Gomez',     section:'BSCS 3B', isLab:false },
    { room:'LR2',  startSlot:2,  endSlot:5,  subject:'MATH 100',    teacher:'Mr. Santos',    section:'BSCS 1B', isLab:false },
    { room:'LR2',  startSlot:10, endSlot:13, subject:'MATH 104',    teacher:'Mr. Santos',    section:'BSCS 2A', isLab:false },
    { room:'LR3',  startSlot:0,  endSlot:3,  subject:'CC 101',      teacher:'Ms. Reyes',     section:'BSIT 1A', isLab:false },
    { room:'LR3',  startSlot:8,  endSlot:11, subject:'CS 122',      teacher:'Mr. Dela Cruz', section:'BSCS 2B', isLab:false },
    { room:'LR4',  startSlot:4,  endSlot:7,  subject:'CS 136',      teacher:'Ms. Mendoza',   section:'BSCS 3A', isLab:false },
    { room:'LR4',  startSlot:12, endSlot:15, subject:'CS 142',      teacher:'Ms. Cruz',      section:'BSCS 4A', isLab:false },
    { room:'LR5',  startSlot:2,  endSlot:5,  subject:'FIL 101',     teacher:'Ms. Cruz',      section:'BSCS 1A', isLab:false },
    { room:'LR5',  startSlot:10, endSlot:13, subject:'US 101',      teacher:'Ms. Mendoza',   section:'BSIT 1B', isLab:false },
    { room:'LAB1', startSlot:0,  endSlot:4,  subject:'CC 101',      teacher:'Ms. Reyes',     section:'BSCS 1B', isLab:true  },
    { room:'LAB1', startSlot:8,  endSlot:12, subject:'CS 135',      teacher:'Mr. Dela Cruz', section:'BSCS 3B', isLab:true  },
    { room:'LAB2', startSlot:4,  endSlot:8,  subject:'CC 103',      teacher:'Ms. Gomez',     section:'BSCS 2B', isLab:true  },
    { room:'LAB2', startSlot:14, endSlot:18, subject:'CS 139',      teacher:'Mr. Lim',       section:'BSCS 3A', isLab:true  },
  ],
  THU: [
    { room:'LR1',  startSlot:0,  endSlot:3,  subject:'CS 123',      teacher:'Ms. Reyes',     section:'BSCS 2B', isLab:false },
    { room:'LR1',  startSlot:8,  endSlot:11, subject:'CS 133',      teacher:'Mr. Lim',       section:'BSCS 3B', isLab:false },
    { room:'LR2',  startSlot:2,  endSlot:5,  subject:'MATH 103',    teacher:'Mr. Santos',    section:'BSCS 1B', isLab:false },
    { room:'LR2',  startSlot:10, endSlot:13, subject:'CS 120',      teacher:'Mr. Dela Cruz', section:'BSCS 2A', isLab:false },
    { room:'LR3',  startSlot:0,  endSlot:3,  subject:'FIL 102',     teacher:'Ms. Cruz',      section:'BSCS 1A', isLab:false },
    { room:'LR3',  startSlot:6,  endSlot:9,  subject:'CS 126',      teacher:'Ms. Reyes',     section:'BSCS 2B', isLab:false },
    { room:'LR4',  startSlot:4,  endSlot:7,  subject:'CS 124',      teacher:'Mr. Dela Cruz', section:'BSCS 2A', isLab:false },
    { room:'LR4',  startSlot:12, endSlot:15, subject:'CS 143',      teacher:'Ms. Mendoza',   section:'BSCS 4B', isLab:false },
    { room:'LR5',  startSlot:0,  endSlot:3,  subject:'CW 101',      teacher:'Mr. Santos',    section:'BSIT 1B', isLab:false },
    { room:'LR5',  startSlot:8,  endSlot:11, subject:'LIT 101',     teacher:'Ms. Cruz',      section:'BSCS 2B', isLab:false },
    { room:'LAB1', startSlot:2,  endSlot:6,  subject:'CS 121',      teacher:'Ms. Reyes',     section:'BSCS 2B', isLab:true  },
    { room:'LAB1', startSlot:10, endSlot:14, subject:'CS 137',      teacher:'Mr. Dela Cruz', section:'BSCS 3B', isLab:true  },
    { room:'LAB2', startSlot:0,  endSlot:4,  subject:'CC 102',      teacher:'Ms. Gomez',     section:'BSIT 1B', isLab:true  },
    { room:'LAB2', startSlot:14, endSlot:18, subject:'CC 105',      teacher:'Mr. Lim',       section:'BSCS 3A', isLab:true  },
  ],
  FRI: [
    { room:'LR1',  startSlot:0,  endSlot:3,  subject:'CS 111',      teacher:'Ms. Reyes',     section:'BSCS 1B', isLab:false },
    { room:'LR1',  startSlot:6,  endSlot:9,  subject:'CS 131',      teacher:'Mr. Dela Cruz', section:'BSCS 3B', isLab:false },
    { room:'LR2',  startSlot:0,  endSlot:3,  subject:'MATH 100',    teacher:'Mr. Santos',    section:'BSIT 1A', isLab:false },
    { room:'LR2',  startSlot:8,  endSlot:11, subject:'ETHICS 101',  teacher:'Mr. Lim',       section:'BSCS 3B', isLab:false },
    { room:'LR3',  startSlot:2,  endSlot:5,  subject:'CS 130',      teacher:'Ms. Mendoza',   section:'BSCS 3A', isLab:false },
    { room:'LR3',  startSlot:10, endSlot:13, subject:'CS 132',      teacher:'Ms. Gomez',     section:'BSCS 3A', isLab:false },
    { room:'LR4',  startSlot:0,  endSlot:3,  subject:'MATH 100',    teacher:'Mr. Santos',    section:'BSCS 1A', isLab:false },
    { room:'LR4',  startSlot:8,  endSlot:11, subject:'CS 136',      teacher:'Ms. Mendoza',   section:'BSCS 3B', isLab:false },
    { room:'LR5',  startSlot:4,  endSlot:7,  subject:'FIL 101',     teacher:'Ms. Cruz',      section:'BSIT 1A', isLab:false },
    { room:'LR5',  startSlot:12, endSlot:15, subject:'US 101',      teacher:'Ms. Mendoza',   section:'BSIT 2A', isLab:false },
    { room:'LAB1', startSlot:0,  endSlot:4,  subject:'CS 125',      teacher:'Mr. Dela Cruz', section:'BSCS 2B', isLab:true  },
    { room:'LAB1', startSlot:8,  endSlot:12, subject:'CS 139',      teacher:'Mr. Lim',       section:'BSCS 3A', isLab:true  },
    { room:'LAB2', startSlot:4,  endSlot:8,  subject:'CC 100',      teacher:'Ms. Reyes',     section:'BSIT 1A', isLab:true  },
    { room:'LAB2', startSlot:12, endSlot:16, subject:'CS 140',      teacher:'Ms. Gomez',     section:'BSCS 3B', isLab:true  },
  ],
  SAT: [
    { room:'LR1',  startSlot:0,  endSlot:3,  subject:'GE 1',        teacher:'Ms. Gomez',     section:'BSIT 1A', isLab:false },
    { room:'LR1',  startSlot:6,  endSlot:9,  subject:'GE 3',        teacher:'Mr. Santos',    section:'BSIT 2A', isLab:false },
    { room:'LR2',  startSlot:0,  endSlot:3,  subject:'CAS 101',     teacher:'Ms. Cruz',      section:'BSIT 1B', isLab:false },
    { room:'LR2',  startSlot:8,  endSlot:11, subject:'LIT 101',     teacher:'Ms. Cruz',      section:'BSCS 2B', isLab:false },
    { room:'LR3',  startSlot:2,  endSlot:5,  subject:'STS 100',     teacher:'Ms. Mendoza',   section:'BSIT 2A', isLab:false },
    { room:'LR3',  startSlot:10, endSlot:13, subject:'A&H 100',     teacher:'Ms. Cruz',      section:'BSCS 4A', isLab:false },
    { room:'LR4',  startSlot:0,  endSlot:3,  subject:'HIST 100',    teacher:'Mr. Santos',    section:'BSIT 4A', isLab:false },
    { room:'LR4',  startSlot:8,  endSlot:11, subject:'HIST 101',    teacher:'Mr. Santos',    section:'BSCS 4A', isLab:false },
    { room:'LR5',  startSlot:4,  endSlot:7,  subject:'NSTP 1',      teacher:'Mr. Lim',       section:'BSCS 1A', isLab:false },
    { room:'LR5',  startSlot:10, endSlot:13, subject:'NSTP 2',      teacher:'Mr. Lim',       section:'BSCS 1B', isLab:false },
    { room:'LAB1', startSlot:0,  endSlot:4,  subject:'CC 100',      teacher:'Ms. Reyes',     section:'BSIT 1A', isLab:true  },
    { room:'LAB1', startSlot:8,  endSlot:12, subject:'CC 102',      teacher:'Ms. Gomez',     section:'BSCS 1B', isLab:true  },
    { room:'LAB2', startSlot:2,  endSlot:6,  subject:'CS 127',      teacher:'Mr. Lim',       section:'BSCS 2A', isLab:true  },
    { room:'LAB2', startSlot:12, endSlot:16, subject:'CS 128',      teacher:'Mr. Dela Cruz', section:'BSCS 2B', isLab:true  },
  ],
};

function switchDay(el, day) {
  document.querySelectorAll('#day-tabs .dept-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentDay = day;
  buildRoomGrid();
}

function buildRoomGrid() {
  const scheduleData = allSchedules[currentDay] || [];
  const slots = [];
  for (let h = 7; h < 19; h++) {
    slots.push(`${h}:00`);
    slots.push(`${h}:30`);
  }
  const occupancy = {};
  rooms.forEach(r => { occupancy[r] = {}; });
  scheduleData.forEach(s => {
    for (let i = s.startSlot; i < s.endSlot; i++) {
      occupancy[s.room][i] = { ...s, isFirst: i === s.startSlot, span: s.endSlot - s.startSlot };
    }
  });

  const tbody = document.getElementById('room-sched-body');
  tbody.innerHTML = '';
  const skipMap = {};
  rooms.forEach(r => { skipMap[r] = {}; });

  slots.forEach((timeLabel, slotIdx) => {
    const tr = document.createElement('tr');
    const tdTime = document.createElement('td');
    tdTime.className = 'time-cell';
    const hr = Math.floor(slotIdx / 2) + 7;
    const ampm = hr < 12 ? 'AM' : 'PM';
    const h12 = hr > 12 ? hr - 12 : (hr === 0 ? 12 : hr);
    const mins = slotIdx % 2 === 0 ? '00' : '30';
    tdTime.textContent = `${h12}:${mins} ${ampm}`;
    tr.appendChild(tdTime);

    rooms.forEach(room => {
      if (skipMap[room][slotIdx]) return;
      const entry = occupancy[room][slotIdx];
      const td = document.createElement('td');
      if (entry && entry.isFirst) {
        td.rowSpan = entry.span;
        for (let k = slotIdx + 1; k < slotIdx + entry.span; k++) skipMap[room][k] = true;
        const isLab = entry.isLab;
        td.innerHTML = `
          <div class="room-cell-occ ${isLab ? 'room-cell-lab' : ''}" onclick="showRoomCell('${room}','${entry.subject}','${entry.teacher}','${entry.section}','${slots[entry.startSlot]}','${slots[Math.min(entry.endSlot-1,slots.length-1)]}')">
            <div class="occ-subj">${entry.subject}</div>
            <div class="occ-detail">${entry.teacher}</div>
            <div class="occ-detail" style="font-size:10px">${entry.section}</div>
          </div>`;
      } else if (!entry) {
        td.innerHTML = `<div class="room-cell-free">—</div>`;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function showRoomCell(room, subject, teacher, section, timeFrom, timeTo) {
  document.getElementById('modal-room-cell-title').textContent = `${room} — ${subject}`;
  document.getElementById('modal-room-cell-body').innerHTML = `
    <div class="form-grid">
      <div class="field"><label>Room</label><input value="${room}" readonly/></div>
      <div class="field"><label>Subject</label><input value="${subject}" readonly/></div>
      <div class="field"><label>Teacher</label><input value="${teacher}" readonly/></div>
      <div class="field"><label>Section</label><input value="${section}" readonly/></div>
      <div class="field"><label>Time From</label><input value="${timeFrom}" readonly/></div>
      <div class="field"><label>Time To</label><input value="${timeTo}" readonly/></div>
    </div>
  `;
  openModal('modal-room-cell');
}

/* ── Init ── */
buildRoomGrid();