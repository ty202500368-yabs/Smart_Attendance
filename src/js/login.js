var btnSign  = document.getElementById('btn-sign');
var uidInput = document.getElementById('uid');
var pwdInput = document.getElementById('pwd');
var uidErr   = document.getElementById('uid-err');
var pwdErr   = document.getElementById('pwd-err');

/* ── Sample Accounts for Demo ── */
var sampleAccounts = {
  'admin123': { password: 'admin123', role: 'admin', redirect: 'src/pages/adminSite.html' },
  'itdept123': { password: 'itdept123', role: 'sub-adminIT', redirect: 'src/pages/subAdminIT.html' },
  'csdept123': { password: 'csdept123', role: 'sub-adminCCS', redirect: 'src/pages/subAdminCCS.html' },
  'teacher123': { password: 'teacher123', role: 'teacher', redirect: 'src/pages/teacher_dashboard.html' },
  'student123': { password: 'student123', role: 'student', redirect: 'src/pages/student-dashboard.html' }
};

/* ── Sign-in ── */
btnSign.addEventListener('click', function () {
  var uid = uidInput.value.trim();
  var pwd = pwdInput.value.trim();

  // Reset errors
  uidInput.classList.remove('err');
  pwdInput.classList.remove('err');
  uidErr.textContent = '';
  pwdErr.textContent = '';

  var ok = true;

  if (!uid) {
    uidInput.classList.add('err');
    uidErr.textContent = 'Student ID is required.';
    ok = false;
  }

  if (!pwd) {
    pwdInput.classList.add('err');
    pwdErr.textContent = 'Password is required.';
    ok = false;
  }

  if (!ok) return;

  btnSign.disabled    = true;
  btnSign.textContent = 'Signing in…';

  setTimeout(function () {
    // Check sample accounts
    if (sampleAccounts[uid] && sampleAccounts[uid].password === pwd) {
      var account = sampleAccounts[uid];
      // Store user info in sessionStorage for later use
      sessionStorage.setItem('userRole', account.role);
      sessionStorage.setItem('userId', uid);
      // Redirect to appropriate page
      window.location.href = account.redirect;
    } else {
      btnSign.disabled    = false;
      btnSign.textContent = 'Sign In';
      uidInput.classList.add('err');
      pwdInput.classList.add('err');
      uidErr.textContent = 'Invalid credentials. Try: admin001/admin123, teacher001/teacher123, or student001/student123';
    }
  }, 1400);
});

/* ── Input helpers ── */
[uidInput, pwdInput].forEach(function (inp) {
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') btnSign.click();
  });

    inp.addEventListener('focus', function () {
    this.classList.remove('err');
    (this === uidInput ? uidErr : pwdErr).textContent = '';
  });
});

