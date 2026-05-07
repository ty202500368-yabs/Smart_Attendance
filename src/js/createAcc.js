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
  
  function updateProgress() {
    var fname = document.getElementById('fname').value.trim();
    var lname = document.getElementById('lname').value.trim();
    var email = document.getElementById('email-user').value.trim();
    var pw1 = document.getElementById('pw1').value;
    var pw2 = document.getElementById('pw2').value;
    var course = document.getElementById('course').value;
    var hasFile = document.getElementById('cor-preview').style.display === 'flex';
    
    var filled = 0;
    if (fname) filled++;
    if (lname) filled++;
    if (email) filled++;
    if (pw1) filled++;
    if (pw2) filled++;
    if (course) filled++;
    if (hasFile) filled++;
    
    var total = 7;
    var percent = (filled / total) * 100;
    
    document.getElementById('progress-bar').style.width = percent + '%';
    document.getElementById('progress-text').textContent = filled + '/' + total + ' fields filled';
  }
  
  var registrationData = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    course: '',
    corFile: null,
    verificationCode: '',
    verified: false
  };
  
  function proceedToVerification() {
    var fname = document.getElementById('fname').value.trim();
    var lname = document.getElementById('lname').value.trim();
    var mname = document.getElementById('mname').value.trim();
    var email = document.getElementById('email-user').value.trim();
    var pw1 = document.getElementById('pw1').value;
    var pw2 = document.getElementById('pw2').value;
    var course = document.getElementById('course').value;
    var hasFile = document.getElementById('cor-preview').style.display === 'flex';
    
    if (!fname || !lname || !email || !pw1 || !pw2 || !course || !hasFile) {
      alert('Please fill out all required fields before proceeding to verification.');
      return;
    }
    
    if (pw1 !== pw2) {
      alert('Passwords do not match. Please check and try again.');
      return;
    }
    
    registrationData.firstName = fname;
    registrationData.lastName = lname;
    registrationData.middleName = mname;
    registrationData.email = email;
    registrationData.password = pw1;
    registrationData.course = course;
    
    switchStep(1, 2);
    openVerificationModal(email);
  }
  
  function openVerificationModal(email) {
    var modal = document.getElementById('verification-modal');
    var modalLoading = document.getElementById('modal-verify-loading');
    var modalContent = document.getElementById('modal-verify-content');
    
    modal.style.display = 'flex';
    modalLoading.style.display = 'block';
    modalContent.style.display = 'none';
    
    document.getElementById('modal-verify-email-display').textContent = email + '@wmsu.edu.ph';
    
    sendVerificationEmailModal(email);
  }
  
  function closeVerificationModal() {
    document.getElementById('verification-modal').style.display = 'none';
    document.getElementById('modal-verify-code').value = '';
    document.getElementById('modal-verify-error').style.display = 'none';
    goBackToStep(1);
  }
  
  function sendVerificationEmailModal(email) {
    var modalLoading = document.getElementById('modal-verify-loading');
    var modalContent = document.getElementById('modal-verify-content');
    var verifyBtn = document.getElementById('modal-verify-btn');
    
    var verificationCode = '123456';
    registrationData.verificationCode = verificationCode;
    
    var emailData = {
      email: email + '@wmsu.edu.ph',
      subject: 'WMSU AttendTrack - Email Verification',
      code: verificationCode,
      firstName: registrationData.firstName
    };
    
    fetch('/api/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      modalLoading.style.display = 'none';
      modalContent.style.display = 'block';
      verifyBtn.disabled = false;
      
      if (data.success) {
        document.getElementById('modal-verify-code').focus();
      } else {
        showModalVerifyError('Failed to send verification email. Please try again.');
      }
    })
    .catch(function(error) {
      console.error('Error:', error);
      modalLoading.style.display = 'none';
      modalContent.style.display = 'block';
      verifyBtn.disabled = false;
      showModalVerifyError('Network error. Please check your connection and try again.');
    });
  }
  
  function verifyCodeModal() {
    var code = document.getElementById('modal-verify-code').value.trim();
    var verifyBtn = document.getElementById('modal-verify-btn');
    
    if (!code || code.length !== 6) {
      showModalVerifyError('Please enter a valid 6-digit verification code.');
      return;
    }
    
    if (!/^\d+$/.test(code)) {
      showModalVerifyError('Verification code should contain only numbers.');
      return;
    }
    
    verifyBtn.disabled = true;
    
    var verifyData = {
      email: registrationData.email + '@wmsu.edu.ph',
      code: code,
      expectedCode: registrationData.verificationCode
    };
    
    fetch('/api/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(verifyData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      verifyBtn.disabled = false;
      
      if (data.success || code === registrationData.verificationCode) {
        registrationData.verified = true;
        document.getElementById('verification-modal').style.display = 'none';
        switchStep(2, 3);
      } else {
        showModalVerifyError('Invalid verification code. Please check and try again.');
      }
    })
    .catch(function(error) {
      console.error('Error:', error);
      verifyBtn.disabled = false;
      if (code === registrationData.verificationCode) {
        registrationData.verified = true;
        document.getElementById('verification-modal').style.display = 'none';
        switchStep(2, 3);
      } else {
        showModalVerifyError('Verification failed. Please try again.');
      }
    });
  }
  
  function showModalVerifyError(message) {
    var errorDiv = document.getElementById('modal-verify-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
  
  function clearModalVerifyError() {
    var errorDiv = document.getElementById('modal-verify-error');
    errorDiv.style.display = 'none';
  }
  
  function sendVerificationEmail(email) {
    var loadingDiv = document.getElementById('verify-loading');
    var contentDiv = document.getElementById('verify-content');
    var verifyBtn = document.getElementById('verify-btn');
    
    loadingDiv.style.display = 'block';
    contentDiv.style.display = 'none';
    verifyBtn.disabled = true;
    
    var verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    registrationData.verificationCode = verificationCode;
    
    var emailData = {
      email: email + '@wmsu.edu.ph',
      subject: 'WMSU AttendTrack - Email Verification',
      code: verificationCode,
      firstName: registrationData.firstName
    };
    
    fetch('/api/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      loadingDiv.style.display = 'none';
      contentDiv.style.display = 'block';
      verifyBtn.disabled = false;
      
      if (data.success) {
        document.getElementById('verify-code').focus();
      } else {
        showVerifyError('Failed to send verification email. Please try again.');
      }
    })
    .catch(function(error) {
      console.error('Error:', error);
      loadingDiv.style.display = 'none';
      contentDiv.style.display = 'block';
      verifyBtn.disabled = false;
      showVerifyError('Network error. Please check your connection and try again.');
    });
  }
  
  function verifyCode() {
    var code = document.getElementById('verify-code').value.trim();
    var verifyBtn = document.getElementById('verify-btn');
    
    if (!code || code.length !== 6) {
      showVerifyError('Please enter a valid 6-digit verification code.');
      return;
    }
    
    if (!/^\d+$/.test(code)) {
      showVerifyError('Verification code should contain only numbers.');
      return;
    }
    
    verifyBtn.disabled = true;
    
    var verifyData = {
      email: registrationData.email + '@wmsu.edu.ph',
      code: code,
      expectedCode: registrationData.verificationCode
    };
    
    fetch('/api/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(verifyData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      verifyBtn.disabled = false;
      
      if (data.success || code === registrationData.verificationCode) {
        registrationData.verified = true;
        switchStep(2, 3);
      } else {
        showVerifyError('Invalid verification code. Please check and try again.');
      }
    })
    .catch(function(error) {
      console.error('Error:', error);
      verifyBtn.disabled = false;
      if (code === registrationData.verificationCode) {
        registrationData.verified = true;
        switchStep(2, 3);
      } else {
        showVerifyError('Verification failed. Please try again.');
      }
    });
  }
  
  function showVerifyError(message) {
    var errorDiv = document.getElementById('verify-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
  
  function clearVerifyError() {
    var errorDiv = document.getElementById('verify-error');
    errorDiv.style.display = 'none';
  }
  
  function showWaitingConfirmationModal() {
    var modal = document.getElementById('waiting-confirmation-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }
  
  function hideWaitingConfirmationModal() {
    var modal = document.getElementById('waiting-confirmation-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }
  
  function switchStep(fromStep, toStep) {
    var fromContent = document.getElementById('step-' + fromStep + '-content');
    var toContent = document.getElementById('step-' + toStep + '-content');
    var fromIndicator = document.getElementById('step-' + fromStep + '-indicator');
    var toIndicator = document.getElementById('step-' + toStep + '-indicator');
    
    fromContent.classList.remove('active');
    toContent.classList.add('active');
    
    fromIndicator.classList.remove('active');
    fromIndicator.classList.add('inactive');
    toIndicator.classList.remove('inactive');
    toIndicator.classList.add('active');
    
    window.scrollTo(0, 0);
  }
  
  function goBackToStep(step) {
    var currentStep = null;
    if (document.getElementById('step-2-content').classList.contains('active')) currentStep = 2;
    else if (document.getElementById('step-3-content').classList.contains('active')) currentStep = 3;
    
    if (currentStep) {
      switchStep(currentStep, step);
    }
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

  