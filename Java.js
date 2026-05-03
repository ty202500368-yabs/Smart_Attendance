function togglePw(id, btn) {
    var inp = document.getElementById(id);
    var showing = inp.type === 'text';
    inp.type = showing ? 'password' : 'text';
    btn.querySelector('circle').setAttribute('r', showing ? '3' : '0');
  }
  function checkStrength(v) {
    var bar = document.getElementById('strength-bar');
    var hint = document.getElementById('pw-hint-txt');
    var score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    var colors = ['#e24b4a','#e24b4a','#ef9f27','#1d9e75','#0f6e56'];
    var labels = ['Too short','Weak','Fair','Strong','Very strong'];
    var pct = [0, 25, 50, 75, 100];
    bar.style.width = (v.length === 0 ? 0 : pct[score]) + '%';
    bar.style.background = colors[score];
    hint.textContent = v.length === 0 ? 'Use letters, numbers, and symbols' : labels[score];
    hint.style.color = v.length === 0 ? 'var(--color-text-tertiary)' : colors[score];
  }
  function checkMatch() {
    var p1 = document.getElementById('pw1').value;
    var p2 = document.getElementById('pw2').value;
    var hint = document.getElementById('match-hint');
    if (!p2) { hint.textContent = '\u00a0'; hint.style.color = ''; return; }
    if (p1 === p2) { hint.textContent = '✓ Passwords match'; hint.style.color = '#1d9e75'; }
    else { hint.textContent = '✗ Passwords do not match'; hint.style.color = '#e24b4a'; }
  }
  function validateEmail(inp) {
    var hint = document.getElementById('email-hint');
    var v = inp.value.trim();
    if (!v) { hint.textContent = 'Use your WMSU-issued student email address'; hint.style.color = ''; return; }
    if (/\s/.test(v)) { hint.textContent = '✗ No spaces allowed'; hint.style.color = '#e24b4a'; }
    else { hint.textContent = '✓ ' + v + '@wmsu.edu.ph'; hint.style.color = '#1d9e75'; }
  }
  function handleFile(input) {
    if (!input.files || !input.files[0]) return;
    showFile(input.files[0]);
  }
  function handleDrop(e) {
    e.preventDefault();
    document.getElementById('cor-dropzone').style.background = '';
    var f = e.dataTransfer.files[0];
    if (f) showFile(f);
  }
  function showFile(f) {
    document.getElementById('file-name-txt').textContent = f.name;
    document.getElementById('cor-preview').style.display = 'flex';
    document.getElementById('cor-dropzone').style.display = 'none';
  }
  function removeFile() {
    document.getElementById('cor-file').value = '';
    document.getElementById('cor-preview').style.display = 'none';
    document.getElementById('cor-dropzone').style.display = 'block';
  }
  function handleSubmit() {
    var fname = document.getElementById('fname').value.trim();
    var lname = document.getElementById('lname').value.trim();
    var email = document.getElementById('email-user').value.trim();
    var pw1 = document.getElementById('pw1').value;
    var pw2 = document.getElementById('pw2').value;
    var hasFile = document.getElementById('cor-preview').style.display === 'flex';
    if (!fname || !lname || !email || !pw1 || !pw2) { sendPrompt('The student registration form has empty required fields. What should I fill in?'); return; }
    if (pw1 !== pw2) { sendPrompt('My passwords do not match on the registration form. How do I fix this?'); return; }
    if (!hasFile) { sendPrompt('I forgot to upload my COR on the registration form. Is it required?'); return; }
    sendPrompt('I filled out the WMSU student registration form for ' + fname + ' ' + lname + ' with email ' + email + '@wmsu.edu.ph. What happens next?');
  }