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
  const choices = form.querySelector('.rsvp-session-choices');
  const phoneField = phone.closest('label');
  const fallback = form.querySelector('.rsvp-email-fallback');
  const feedback = form.querySelector('[role=alert]');
  const success = dialog.querySelector('.rsvp-success');
  const successTitle = success.querySelector('h3');
  const successText = success.querySelector('.rsvp-success-text');
  const share = success.querySelector('.rsvp-share');
  const shareStatus = success.querySelector('.rsvp-share-status');
  const sharePrompt = share.querySelector('p');
  const copy = success.querySelector('.rsvp-copy');
  const query = new URLSearchParams(location.search);
  const incomingReferral = query.get('ref') || '';
  const preferredSession = query.get('session') === 'january' ? 'january' : 'attend';
  let mode = 'attend', trigger, submissionId, busy = false, shareMessage = '';
  function setMode(branch) {
    mode = branch;
    const attend = branch === 'attend';
    const newsletter = branch === 'updates';
    title.textContent = newsletter ? 'Stay in the loop.' : 'Make the first 30 yours.';
    description.textContent = newsletter ? 'Occasional First 30 updates and free passes.' : 'Choose when you would like to experience The First 30.';
    choices.hidden = newsletter;
    choices.disabled = newsletter;
    phoneField.hidden = newsletter;
    phone.disabled = newsletter;
    phone.required = !newsletter;
    phoneLabel.textContent = 'Phone number *';
    help.hidden = newsletter;
    help.textContent = attend ? 'For your 9 December door code and reminder.' : 'For when we announce January slots and for your door code on the day.';
    optIn.hidden = newsletter;
    form.elements.updates.disabled = newsletter;
    priorityConsent.hidden = !newsletter;
    submit.textContent = newsletter ? 'Join the newsletter' : attend ? 'Lock in my spot' : 'Claim my January pass';
    feedback.textContent = '';
    fallback.hidden = true;
  }
  function open(branch, value, source) {
    if (dialog.open || busy) return;
    trigger = source;
    submissionId = undefined;
    form.reset();
    shareStatus.textContent = '';
    form.hidden = false;
    success.hidden = true;
    description.hidden = false;
    if (branch !== 'updates') form.elements.session.value = branch;
    setMode(branch);
    email.value = value || '';
    dialog.showModal();
    (email.value ? name : email).focus();
  }
  choices.addEventListener('change', () => {
    if (!busy && !choices.disabled) {
      submissionId = undefined;
      setMode(form.elements.session.value);
    }
  });
  document.querySelectorAll('.homepage-rsvp-start').forEach(start => {
    start.hidden = false;
    const fallback = start.previousElementSibling;
    if (fallback?.matches('.homepage-rsvp-fallback')) fallback.hidden = true;
    start.addEventListener('submit', event => {
      event.preventDefault();
      if (!start.reportValidity()) return;
      if (dialog.open || busy) return;
      const address = start.elements.email.value.trim();
      const lead = new URLSearchParams({email: address, response: 'incomplete', submissionId: crypto.randomUUID(), referredBy: incomingReferral});
      fetch(endpoint, {method:'POST', body:lead, credentials:'omit', keepalive:true}).catch(() => {});
      open(preferredSession, address, start.querySelector('button'));
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
    open('january', '', priority);
  });
  document.querySelectorAll('[data-rsvp-newsletter]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      open('updates', '', link);
    });
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
    if (!name.value.trim() || (mode !== 'updates' && !phone.value.trim())) {
      feedback.textContent = 'Please enter your name and phone number.';
      (!name.value.trim() ? name : phone).focus();
      return;
    }
    busy = true;
    choices.disabled = true;
    submit.disabled = true;
    const oldLabel = submit.textContent;
    submit.textContent = 'Saving…';
    feedback.textContent = '';
    try {
      submissionId ||= crypto.randomUUID();
      const data = new URLSearchParams(new FormData(form));
      data.set('name', name.value.trim());
      data.set('email', email.value.trim());
      data.set('phone', mode === 'updates' ? '' : phone.value.trim());
      data.delete('session');
      data.set('response', mode);
      data.set('submissionId', submissionId);
      data.set('referredBy', incomingReferral);
      const reply = await fetch(endpoint, {method:'POST',body:data,credentials:'omit'});
      if (!reply.ok) throw new Error('Request failed');
      const result = await reply.json();
      if (!result.ok) throw new Error('Not saved');
      const attend = mode === 'attend';
      const january = mode === 'january';
      form.hidden = true;
      description.hidden = true;
      success.hidden = false;
      title.textContent = attend ? 'You’re in!' : january ? 'Your January pass is yours.' : 'You’re on the list.';
      successTitle.textContent = attend ? 'See you on 9 December.' : january ? 'Your first January session is complimentary.' : 'We’ll keep you in the loop.';
      successText.textContent = attend ? 'We’ll email you the details before the preview. Doors open at 7:35 am at First Floor, 180 George Street, Sydney CBD.' : january ? 'We’ll email you when January bookings open so you can choose your session. No obligation to continue.' : 'Thanks for joining our newsletter. You can opt out anytime.';
      share.hidden = !(attend || january);
      if (attend || january) {
        const link = new URL(january ? '/' : '/free-preview/',location.origin);
        if (january) {
          link.searchParams.set('session','january');
          link.hash = 'hero-rsvp-email';
        }
        if (result.referralCode) link.searchParams.set('ref',result.referralCode);
        sharePrompt.textContent = january ? 'Better together. Invite a friend to claim their own complimentary January session.' : 'And you have a plus one. Invite someone to join you.';
        shareMessage = january
          ? 'Hey! I’ve claimed a complimentary January session at The First 30 — a 30-minute mental fitness session before work in Sydney CBD. Want to come with me? Claim your own complimentary session here: ' + link.href
          : 'Hey! I got invited to a complimentary 30-minute founding preview of The First 30 on Wed 9 Dec (7:45–8:15 am) in Sydney CBD. I have a plus one. Want to come with me? RSVP here: ' + link.href;
      }
      submissionId = undefined;
      form.reset();
      successTitle.focus();
    } catch {
      feedback.textContent = 'We couldn’t save your request. Please try again, or contact us by email.';
      fallback.href = mode === 'january' ? 'mailto:hello@thefirst30.com.au?subject=Complimentary%20January%20pass' : mode === 'updates' ? 'mailto:hello@thefirst30.com.au?subject=Newsletter%20signup' : 'mailto:hello@thefirst30.com.au?subject=December%20preview%20RSVP';
      fallback.hidden = false;
    } finally {
      busy = false;
      choices.disabled = mode === 'updates';
      submit.disabled = false;
      submit.textContent = oldLabel;
    }
  });
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(shareMessage); shareStatus.textContent = 'Copied!'; }
    catch { shareStatus.textContent = shareMessage; }
  });
})();
