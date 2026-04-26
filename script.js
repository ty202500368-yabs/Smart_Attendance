var btnSign  = document.getElementById('btn-sign');
var uidInput = document.getElementById('uid');
var pwdInput = document.getElementById('pwd');
var uidErr   = document.getElementById('uid-err');
var pwdErr   = document.getElementById('pwd-err');

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
    btnSign.disabled    = false;
    btnSign.textContent = 'Sign In';
    alert('Connect this to your backend!');
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
