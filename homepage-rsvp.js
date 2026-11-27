/* Homepage RSVP: same Apps Script endpoint and payload as the founding invitation. */
(() => {
  const endpoint = "https://script.google.com/a/macros/startupwithchristine.com/s/AKfycbzS0xMu3xWIeYDS08jpvy1mUJtgQMbczuErwrTlH8mnsBfSe1IYPMHgQ3kSfhhRbHUL/exec";
  const dialog = document.getElementById('homepage-rsvp');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const form = dialog.querySelector('form');
  const title = dialog.querySelector('#homepage-rsvp-title');
  const description = dialog.querySelector('#homepage-rsvp-description');
  const phone = form.elements.phone;
  const email = form.elements.email;
  const name = form.elements.name;
  const submit = form.querySelector('[type=submit]');
  const optIn = form.querySelector('.rsvp-opt-in');
  const phoneLabel = form.querySelector('.rsvp-phone-label');
  const help = form.querySelector('.rsvp-phone-help');
  const priorityConsent = form.querySelector('.rsvp-priority-consent');
  const feedback = form.querySelector('[role=alert]');
  const success = dialog.querySelector('.rsvp-success');
  const successTitle = success.querySelector('h3');
  const successText = success.querySelector('.rsvp-success-text');
  const share = success.querySelector('.rsvp-share');
  const shareStatus = success.querySelector('.rsvp-share-status');
  const copy = success.querySelector('.rsvp-copy');
  const incomingReferral = new URLSearchParams(location.search).get('ref') || '';
  let mode = 'attend', trigger, submissionId, busy = false, shareMessage = '';
  function open(branch, value, source) {
    if (dialog.open || busy) return;
    mode = branch;
    trigger = source;
    submissionId = undefined;
    form.reset();
    feedback.textContent = '';
    shareStatus.textContent = '';
    form.hidden = false;
    success.hidden = true;
    description.hidden = false;
    const attend = branch === 'attend';
    title.textContent = attend ? 'Make the first 30 yours.' : 'Stay in the loop.';
    description.textContent = attend ? 'Wednesday 9 December · 7:45–8:15 am · Sydney CBD' : 'Join our January priority list.';
    email.value = value || '';
    phone.required = attend;
    phoneLabel.textContent = attend ? 'Phone number *' : 'Phone number (optional)';
    help.hidden = !attend;
    optIn.hidden = !attend;
    form.elements.updates.disabled = !attend;
    priorityConsent.hidden = attend;
    submit.textContent = attend ? 'Lock in my spot' : 'Join the priority list';
    dialog.showModal();
    (email.value ? name : email).focus();
  }
  document.querySelectorAll('.homepage-rsvp-start').forEach(start => {
    start.hidden = false;
    const fallback = start.previousElementSibling;
    if (fallback?.matches('.homepage-rsvp-fallback')) fallback.hidden = true;
    start.addEventListener('submit', event => {
      event.preventDefault();
      if (!start.reportValidity()) return;
      open('attend', start.elements.email.value.trim(), start.querySelector('button'));
    });
  });
  document.querySelectorAll('[data-rsvp-shortcut]').forEach(link => {
    link.addEventListener('click', event => {
      const field = document.querySelector('#hero-rsvp-email');
      if (!field) return;
      event.preventDefault();
      field.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      field.focus({preventScroll:true});
    });
  });
  const priority = document.querySelector('[data-rsvp-priority]');
  priority?.addEventListener('click', event => {
    event.preventDefault();
    open('updates', '', priority);
  });
  dialog.querySelectorAll('[data-rsvp-close]').forEach(button => button.addEventListener('click', () => {
    if (!busy) dialog.close();
  }));
  dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  dialog.addEventListener('close', () => { if (trigger?.isConnected) trigger.focus(); });
  form.addEventListener('input', () => { feedback.textContent = ''; });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    if (!name.value.trim() || (mode === 'attend' && !phone.value.trim())) {
      feedback.textContent = 'Please enter your name and phone number.';
      (!name.value.trim() ? name : phone).focus();
      return;
    }
    busy = true;
    submit.disabled = true;
    const oldLabel = submit.textContent;
    submit.textContent = 'Saving…';
    feedback.textContent = '';
    try {
      submissionId ||= crypto.randomUUID();
      const data = new URLSearchParams(new FormData(form));
      data.set('name', name.value.trim());
      data.set('email', email.value.trim());
      data.set('phone', phone.value.trim());
      data.set('response', mode);
      data.set('submissionId', submissionId);
      data.set('referredBy', incomingReferral);
      const reply = await fetch(endpoint, {method:'POST',body:data,credentials:'omit'});
      if (!reply.ok) throw new Error('Request failed');
      const result = await reply.json();
      if (!result.ok) throw new Error('Not saved');
      const attend = mode === 'attend';
      form.hidden = true;
      description.hidden = true;
      success.hidden = false;
      title.textContent = attend ? 'You’re in!' : 'You’re on the list.';
      successTitle.textContent = attend ? 'See you on 9 December.' : 'We’ll keep you in the loop.';
      successText.textContent = attend ? 'We’ll email you the details before the preview. Doors open at 7:35 am at First Floor, 180 George Street, Sydney CBD.' : 'Thanks for joining the January priority list. You can opt out anytime.';
      share.hidden = !attend;
      if (attend) {
        const link = new URL('/free-preview/',location.origin);
        if (result.referralCode) link.searchParams.set('ref',result.referralCode);
        shareMessage = 'Hey! I got invited to a complimentary 30-minute founding preview of The First 30 on Wed 9 Dec (7:45–8:15 am) in Sydney CBD. I have a plus one. Want to come with me? RSVP here: ' + link.href;
      }
      submissionId = undefined;
      form.reset();
      successTitle.focus();
    } catch {
      feedback.textContent = 'We couldn’t confirm your RSVP. Please try again, or email hello@thefirst30.com.au.';
    } finally {
      busy = false;
      submit.disabled = false;
      submit.textContent = oldLabel;
    }
  });
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(shareMessage); shareStatus.textContent = 'Copied!'; }
    catch { shareStatus.textContent = shareMessage; }
  });
})();
