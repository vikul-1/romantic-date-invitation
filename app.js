/**
 * Romantic Date Invitation - Interactive Engine
 * Developed with Love by Vikul Tyagi
 */

(function () {
  'use strict';

  // --- App State ---
  const state = {
    recipient: 'Sophia',
    sender: 'Vikul',
    whatsappPhone: '',
    proposalText: 'Will you go on a date with me?',
    customLetter: 'From the first moment we met, you turned every simple moment into my favorite memory. I cannot wait to dress up, look into your gorgeous eyes, and take you out on the most special date you deserve. Get ready to be spoiled, beautiful! 💕',
    theme: 'rose',
    selectedFood: null,
    selectedActivity: null,
    selectedDate: 'This Friday Evening',
    selectedTime: 'Sunset (6:00 PM)',
    selectedVibe: 'Fancy & Elegant (Dress to Impress)',
    secretWish: '',
    noClickCount: 0,
    adminPin: '2026',
    webhookUrl: ''
  };

  const pleadingMessages = [
    'No 😢',
    'Are you sure? 🥺',
    'Really sure?? 🥺🍫',
    'Think about the good food! 🍝',
    'Look how big YES is getting! 💖',
    'Don’t break my code... I mean heart! 💔',
    'Pretty please with strawberries on top? 🍓',
    'Error 404: "No" is forbidden! 🚀',
    'You are stuck with me forever! 🥰'
  ];

  // --- DOM Elements ---
  const screens = {
    intro: document.getElementById('screen-intro'),
    proposal: document.getElementById('screen-proposal'),
    food: document.getElementById('screen-food'),
    activity: document.getElementById('screen-activity'),
    schedule: document.getElementById('screen-schedule'),
    vibe: document.getElementById('screen-vibe'),
    ticket: document.getElementById('screen-ticket'),
  };

  const btnOpenLetter = document.getElementById('btn-open-letter');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = envelopeWrapper?.querySelector('.envelope');

  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const noReactionMessage = document.getElementById('no-reaction-message');
  const actionArena = document.getElementById('action-arena');

  const musicToggle = document.getElementById('music-toggle');
  const customizeToggle = document.getElementById('customize-toggle');
  const customizerModal = document.getElementById('customizer-modal');
  const btnCloseCustomizer = document.getElementById('btn-close-customizer');
  const btnSaveCustomizer = document.getElementById('btn-save-customizer');
  const btnCopyShareLink = document.getElementById('btn-copy-share-link');
  const shareableUrlInput = document.getElementById('shareable-url-input');

  const loveLetterModal = document.getElementById('love-letter-modal');
  const btnCloseLetter = document.getElementById('btn-close-letter');
  const btnReadLoveLetter = document.getElementById('btn-read-love-letter');
  const typewriterLetterContent = document.getElementById('typewriter-letter-content');

  const btnDownloadTicket = document.getElementById('btn-download-ticket');
  const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');
  const btnRestartPlan = document.getElementById('btn-restart-plan');

  // Multi-step buttons
  const btnBackToProposal = document.getElementById('btn-back-to-proposal');
  const btnNextFood = document.getElementById('btn-next-food');
  const btnBackToFood = document.getElementById('btn-back-to-food');
  const btnNextActivity = document.getElementById('btn-next-activity');
  const btnBackToActivity = document.getElementById('btn-back-to-activity');
  const btnNextSchedule = document.getElementById('btn-next-schedule');
  const btnBackToSchedule = document.getElementById('btn-back-to-schedule');
  const btnGenerateTicket = document.getElementById('btn-generate-ticket');

  const datePicker = document.getElementById('date-picker');
  const userSecretWish = document.getElementById('user-secret-wish');

  // Admin Elements
  const btnOpenAdmin = document.getElementById('btn-open-admin');
  const adminModal = document.getElementById('admin-modal');
  const btnCloseAdmin = document.getElementById('btn-close-admin');
  const adminAuthScreen = document.getElementById('admin-auth-screen');
  const adminContentScreen = document.getElementById('admin-content-screen');
  const adminPinInput = document.getElementById('admin-pin-input');
  const btnUnlockAdmin = document.getElementById('btn-unlock-admin');
  const adminResponsesList = document.getElementById('admin-responses-list');
  const responseCountBadge = document.getElementById('response-count-badge');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnClearResponses = document.getElementById('btn-clear-responses');
  const adminWebhookUrl = document.getElementById('admin-webhook-url');
  const btnSaveWebhook = document.getElementById('btn-save-webhook');

  // --- Initialize App ---
  function init() {
    loadSavedSettings();
    parseUrlParams();
    applyStateToUI();
    setupAmbientCanvas();
    setupConfettiCanvas();
    setupEventListeners();
    updateShareableUrl();
    setDefaultDatePicker();

    // Check hash for #admin
    if (window.location.hash === '#admin') {
      openAdminModal();
    }
  }

  function loadSavedSettings() {
    try {
      const savedPhone = localStorage.getItem('date_proposer_phone');
      if (savedPhone) state.whatsappPhone = savedPhone;
      const savedWebhook = localStorage.getItem('date_proposer_webhook');
      if (savedWebhook) {
        state.webhookUrl = savedWebhook;
        if (adminWebhookUrl) adminWebhookUrl.value = savedWebhook;
      }
    } catch (e) {
      console.warn('Storage not accessible:', e);
    }
  }

  // Parse URL search params (e.g. ?to=Sophia&from=Vikul&phone=919876543210&theme=rose)
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('to')) state.recipient = decodeURIComponent(params.get('to')).trim();
    if (params.has('from')) state.sender = decodeURIComponent(params.get('from')).trim();
    if (params.has('phone')) state.whatsappPhone = decodeURIComponent(params.get('phone')).trim();
    if (params.has('msg')) state.proposalText = decodeURIComponent(params.get('msg')).trim();
    if (params.has('letter')) state.customLetter = decodeURIComponent(params.get('letter')).trim();
    if (params.has('theme')) {
      const t = params.get('theme').toLowerCase();
      if (['rose', 'midnight', 'lavender', 'peach'].includes(t)) {
        state.theme = t;
      }
    }
  }

  // Apply state text & theme to DOM
  function applyStateToUI() {
    document.body.setAttribute('data-theme', state.theme);

    // Update names across UI
    document.querySelectorAll('.recipient-name-val, .recipient-name-highlight').forEach(el => {
      el.textContent = state.recipient;
    });
    document.querySelectorAll('.sender-name-val, .sender-name-highlight').forEach(el => {
      el.textContent = state.sender;
    });
    const senderBadge = document.getElementById('badge-sender-text');
    if (senderBadge) senderBadge.textContent = `From ${state.sender}`;

    const proposalHeadline = document.getElementById('proposal-headline');
    if (proposalHeadline) proposalHeadline.textContent = state.proposalText;

    // Customizer form inputs
    const inputRecipient = document.getElementById('input-recipient');
    const inputSender = document.getElementById('input-sender');
    const inputPhone = document.getElementById('input-whatsapp-phone');
    const inputProposal = document.getElementById('input-proposal-text');
    const inputLetter = document.getElementById('input-custom-letter');
    if (inputRecipient) inputRecipient.value = state.recipient;
    if (inputSender) inputSender.value = state.sender;
    if (inputPhone) inputPhone.value = state.whatsappPhone;
    if (inputProposal) inputProposal.value = state.proposalText;
    if (inputLetter) inputLetter.value = state.customLetter;

    // Theme chips
    document.querySelectorAll('.theme-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.themeName === state.theme);
    });
  }

  function setDefaultDatePicker() {
    if (!datePicker) return;
    const today = new Date();
    today.setDate(today.getDate() + 2); // Default 2 days ahead
    datePicker.min = new Date().toISOString().split('T')[0];
    datePicker.value = today.toISOString().split('T')[0];
  }

  // --- Screen Navigation ---
  function showScreen(screenKey) {
    Object.keys(screens).forEach(key => {
      const el = screens[key];
      if (!el) return;
      if (key === screenKey) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Runaway NO Button Physics ---
  function dodgeNoButton() {
    state.noClickCount++;
    window.romanticAudio?.playWhoosh();

    const rect = btnNo.getBoundingClientRect();
    const arenaRect = actionArena.getBoundingClientRect();

    // Escalating hilarious message
    const msgIndex = Math.min(state.noClickCount, pleadingMessages.length - 1);
    btnNo.querySelector('.btn-no-text').textContent = pleadingMessages[msgIndex];

    const reactions = [
      "Hey, don't press that! 🥺",
      "Are you sure? Think of all the desserts! 🍰",
      "Look how sparkly the YES button is! ✨",
      "Vikul wrote lines of pure love code for this! 💻❤️",
      "Resistance is futile, princess! 🥰",
      "That button is broken, click YES! 💖"
    ];
    noReactionMessage.textContent = reactions[(state.noClickCount - 1) % reactions.length];

    // Compute random offsets within the arena or viewport
    const maxOffsetX = (arenaRect.width / 2) - 40;
    const maxOffsetY = 60;
    const randomX = (Math.random() * maxOffsetX * 2) - maxOffsetX;
    const randomY = (Math.random() * maxOffsetY * 2) - maxOffsetY;

    // Shrink NO button, grow YES button exponentially
    const noScale = Math.max(0.65, 1 - state.noClickCount * 0.08);
    const yesScale = Math.min(1.45, 1 + state.noClickCount * 0.08);

    btnNo.style.position = 'relative';
    btnNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(${noScale})`;
    btnYes.style.transform = `scale(${yesScale})`;

    // Spawn tiny heart trail at cursor
    spawnMiniHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  // --- Response Storage & Auto Notification Engine ---
  function recordSubmission() {
    const record = {
      id: 'DATE-' + Date.now(),
      timestamp: new Date().toLocaleString(),
      recipient: state.recipient,
      sender: state.sender,
      food: state.selectedFood ? `${state.selectedFood.title} ${state.selectedFood.icon}` : 'Italian & Candlelight 🍝',
      activity: state.selectedActivity ? `${state.selectedActivity.title} ${state.selectedActivity.icon}` : 'Stargazing & Blanket Fort ✨',
      date: state.selectedDate,
      time: state.selectedTime,
      vibe: state.selectedVibe,
      wish: state.secretWish || 'Unlimited hugs and kisses! 💕',
    };

    // 1. Save to Local Storage DB
    try {
      const existing = JSON.parse(localStorage.getItem('date_proposals_responses_db') || '[]');
      existing.unshift(record);
      localStorage.setItem('date_proposals_responses_db', JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not save response locally:', err);
    }

    // 2. Dispatch to optional webhook (Discord / Telegram / Formspree)
    if (state.webhookUrl) {
      sendWebhookNotification(record);
    }
  }

  function sendWebhookNotification(record) {
    const payload = {
      content: `🎉 **New Date Proposal Accepted!** 💖\n` +
        `👤 **Passenger:** ${record.recipient}\n` +
        `💌 **Sender:** ${record.sender}\n` +
        `🍝 **Food:** ${record.food}\n` +
        `✨ **Activity:** ${record.activity}\n` +
        `📅 **When:** ${record.date} @ ${record.time}\n` +
        `👗 **Dress Code:** ${record.vibe}\n` +
        `📝 **Note:** "${record.wish}"\n` +
        `⏰ **Time Logged:** ${record.timestamp}`
    };

    fetch(state.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(e => console.log('Webhook push error (silent):', e));
  }

  // --- Setup Event Listeners ---
  function setupEventListeners() {
    // 1. Envelope opening
    const triggerEnvelope = () => {
      window.romanticAudio?.playEnvelopeOpen();
      envelope?.classList.add('is-open');
      setTimeout(() => {
        showScreen('proposal');
      }, 700);
    };
    btnOpenLetter?.addEventListener('click', triggerEnvelope);
    waxSealBtn?.addEventListener('click', triggerEnvelope);

    // 2. Proposal YES / NO
    btnNo?.addEventListener('mouseenter', dodgeNoButton);
    btnNo?.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dodgeNoButton();
    });
    btnNo?.addEventListener('click', (e) => {
      e.preventDefault();
      dodgeNoButton();
    });

    btnYes?.addEventListener('click', () => {
      window.romanticAudio?.playSuccess();
      triggerConfettiExplosion();
      showToast('Yay! Best decision ever! 🥰💖');
      setTimeout(() => {
        showScreen('food');
      }, 900);
    });

    // 3. Option Selection: Food
    document.querySelectorAll('#food-options-grid .option-card').forEach(card => {
      card.addEventListener('click', () => {
        window.romanticAudio?.playChime();
        document.querySelectorAll('#food-options-grid .option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.selectedFood = {
          title: card.dataset.value,
          icon: card.dataset.icon
        };
        btnNextFood.removeAttribute('disabled');
      });
    });

    // 4. Option Selection: Activity
    document.querySelectorAll('#activity-options-grid .option-card').forEach(card => {
      card.addEventListener('click', () => {
        window.romanticAudio?.playChime();
        document.querySelectorAll('#activity-options-grid .option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        state.selectedActivity = {
          title: card.dataset.value,
          icon: card.dataset.icon
        };
        btnNextActivity.removeAttribute('disabled');
      });
    });

    // 5. Schedule Selection
    document.querySelectorAll('.quick-day-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        document.querySelectorAll('.quick-day-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.selectedDate = chip.dataset.day;
      });
    });

    datePicker?.addEventListener('change', (e) => {
      if (e.target.value) {
        document.querySelectorAll('.quick-day-chip').forEach(c => c.classList.remove('active'));
        const dateObj = new Date(e.target.value + 'T00:00:00');
        const formatted = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        state.selectedDate = formatted;
      }
    });

    document.querySelectorAll('.time-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.selectedTime = chip.dataset.time;
      });
    });

    // 6. Vibe Selection
    document.querySelectorAll('.vibe-card').forEach(card => {
      card.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        document.querySelectorAll('.vibe-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.selectedVibe = card.dataset.vibe;
      });
    });

    // 7. Navigation Buttons
    btnBackToProposal?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      showScreen('proposal');
    });
    btnNextFood?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      showScreen('activity');
    });
    btnBackToFood?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      showScreen('food');
    });
    btnNextActivity?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      showScreen('schedule');
    });
    btnBackToActivity?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      showScreen('activity');
    });
    btnNextSchedule?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      showScreen('vibe');
    });
    btnBackToSchedule?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      showScreen('schedule');
    });

    // 8. Generate Ticket & Record Response
    btnGenerateTicket?.addEventListener('click', () => {
      window.romanticAudio?.playSuccess();
      triggerConfettiExplosion();
      state.secretWish = userSecretWish?.value.trim() || '';
      renderTicketDetails();
      recordSubmission();
      showScreen('ticket');
    });

    // 9. Restart Plan
    btnRestartPlan?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      showScreen('food');
    });

    // 10. Music Toggle
    musicToggle?.addEventListener('click', () => {
      window.romanticAudio?.toggleMusic((isPlaying) => {
        musicToggle.classList.toggle('playing', isPlaying);
        showToast(isPlaying ? '🎵 Romantic melody playing' : '🔇 Music paused');
      });
    });

    // 11. Customizer Drawer
    customizeToggle?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      customizerModal?.classList.add('open');
      updateShareableUrl();
    });
    btnCloseCustomizer?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      customizerModal?.classList.remove('open');
    });
    customizerModal?.addEventListener('click', (e) => {
      if (e.target === customizerModal) {
        customizerModal.classList.remove('open');
      }
    });

    // Theme selector inside customizer
    document.querySelectorAll('.theme-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        window.romanticAudio?.playPop();
        document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.theme = chip.dataset.themeName;
        document.body.setAttribute('data-theme', state.theme);
        updateShareableUrl();
      });
    });

    // Apply customizer changes
    btnSaveCustomizer?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      const inputRecipient = document.getElementById('input-recipient');
      const inputSender = document.getElementById('input-sender');
      const inputPhone = document.getElementById('input-whatsapp-phone');
      const inputProposal = document.getElementById('input-proposal-text');
      const inputLetter = document.getElementById('input-custom-letter');

      if (inputRecipient?.value.trim()) state.recipient = inputRecipient.value.trim();
      if (inputSender?.value.trim()) state.sender = inputSender.value.trim();
      if (inputPhone) {
        state.whatsappPhone = inputPhone.value.trim().replace(/\D/g, '');
        try { localStorage.setItem('date_proposer_phone', state.whatsappPhone); } catch (e) {}
      }
      if (inputProposal?.value.trim()) state.proposalText = inputProposal.value.trim();
      if (inputLetter?.value.trim()) state.customLetter = inputLetter.value.trim();

      applyStateToUI();
      renderTicketDetails();
      updateShareableUrl();
      customizerModal?.classList.remove('open');
      showToast('✨ Customizer settings applied!');
    });

    // Copy Shareable Link
    btnCopyShareLink?.addEventListener('click', () => {
      updateShareableUrl();
      navigator.clipboard.writeText(shareableUrlInput.value).then(() => {
        window.romanticAudio?.playChime();
        const btnText = document.getElementById('copy-btn-text');
        if (btnText) btnText.textContent = 'Copied! 🎉';
        setTimeout(() => {
          if (btnText) btnText.textContent = 'Copy Link';
        }, 2500);
        showToast('🔗 Shareable link copied to clipboard!');
      });
    });

    // 12. Love Letter Modal
    btnReadLoveLetter?.addEventListener('click', () => {
      window.romanticAudio?.playEnvelopeOpen();
      loveLetterModal?.classList.add('open');
      typewriterLetter();
    });
    btnCloseLetter?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      loveLetterModal?.classList.remove('open');
    });
    loveLetterModal?.addEventListener('click', (e) => {
      if (e.target === loveLetterModal) {
        loveLetterModal.classList.remove('open');
      }
    });

    // 13. Download Ticket as Image (Canvas snapshot)
    btnDownloadTicket?.addEventListener('click', () => {
      window.romanticAudio?.playChime();
      downloadTicketImage();
    });

    // 14. WhatsApp Share (with custom phone if available)
    btnShareWhatsapp?.addEventListener('click', () => {
      window.romanticAudio?.playPop();
      const foodText = state.selectedFood ? `${state.selectedFood.title} ${state.selectedFood.icon}` : 'Surprise Cravings';
      const actText = state.selectedActivity ? `${state.selectedActivity.title} ${state.selectedActivity.icon}` : 'Romantic Surprise';
      
      const msg = `Hey ${state.sender}! I said YES to our date! 🥰💖\n\n` +
        `🎫 *OUR OFFICIAL DATE ITINERARY* 🎫\n` +
        `🍝 Food: ${foodText}\n` +
        `✨ Adventure: ${actText}\n` +
        `📅 Date: ${state.selectedDate}\n` +
        `⏰ Time: ${state.selectedTime}\n` +
        `👗 Dress Code: ${state.selectedVibe}\n` +
        (state.secretWish ? `💌 My Note: "${state.secretWish}"\n` : '') +
        `\nCan't wait for our special date! 💕`;

      let url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
      if (state.whatsappPhone) {
        url = `https://api.whatsapp.com/send?phone=${state.whatsappPhone}&text=${encodeURIComponent(msg)}`;
      }
      window.open(url, '_blank');
    });

    // 15. Admin Response Backup Controls
    btnOpenAdmin?.addEventListener('click', openAdminModal);
    btnCloseAdmin?.addEventListener('click', () => {
      adminModal?.classList.remove('open');
    });
    adminModal?.addEventListener('click', (e) => {
      if (e.target === adminModal) adminModal.classList.remove('open');
    });

    btnUnlockAdmin?.addEventListener('click', verifyAdminPin);
    adminPinInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verifyAdminPin();
    });

    btnExportCsv?.addEventListener('click', exportResponsesCsv);
    btnClearResponses?.addEventListener('click', clearAllResponses);

    btnSaveWebhook?.addEventListener('click', () => {
      const url = adminWebhookUrl?.value.trim() || '';
      state.webhookUrl = url;
      try {
        localStorage.setItem('date_proposer_webhook', url);
        showToast('⚡ Webhook URL saved successfully!');
      } catch (e) {
        showToast('Saved in memory!');
      }
    });

    // Keyboard shortcut for admin: Ctrl + Shift + A
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        openAdminModal();
      }
    });
  }

  // --- Admin Modal Functions ---
  function openAdminModal() {
    window.romanticAudio?.playPop();
    adminModal?.classList.add('open');
    if (adminPinInput) adminPinInput.value = '';
  }

  function verifyAdminPin() {
    const entered = adminPinInput?.value.trim();
    if (entered === state.adminPin || entered === '2026') {
      window.romanticAudio?.playSuccess();
      adminAuthScreen.style.display = 'none';
      adminContentScreen.style.display = 'flex';
      renderAdminResponses();
    } else {
      window.romanticAudio?.playWhoosh();
      showToast('❌ Incorrect PIN! Try 2026');
    }
  }

  function renderAdminResponses() {
    let responses = [];
    try {
      responses = JSON.parse(localStorage.getItem('date_proposals_responses_db') || '[]');
    } catch (e) {
      responses = [];
    }

    if (responseCountBadge) responseCountBadge.textContent = responses.length;

    if (!adminResponsesList) return;
    adminResponsesList.innerHTML = '';

    if (responses.length === 0) {
      adminResponsesList.innerHTML = `<p class="link-hint" style="text-align:center; padding:1.5rem 0;">No date responses logged yet. Once she completes her selections, they will appear right here!</p>`;
      return;
    }

    responses.forEach(item => {
      const card = document.createElement('div');
      card.className = 'response-card-item';
      card.innerHTML = `
        <div class="response-header-line">
          <span class="response-recipient-name">💖 ${item.recipient} (from ${item.sender})</span>
          <span>${item.timestamp}</span>
        </div>
        <div class="response-grid-row">
          <span class="response-item-tag">🍝 <strong>Food:</strong> ${item.food}</span>
          <span class="response-item-tag">✨ <strong>Adventure:</strong> ${item.activity}</span>
          <span class="response-item-tag">📅 <strong>When:</strong> ${item.date} @ ${item.time}</span>
          <span class="response-item-tag">👗 <strong>Vibe:</strong> ${item.vibe}</span>
        </div>
        ${item.wish ? `<div class="response-wish-quote">💌 "${item.wish}"</div>` : ''}
      `;
      adminResponsesList.appendChild(card);
    });
  }

  function exportResponsesCsv() {
    try {
      const responses = JSON.parse(localStorage.getItem('date_proposals_responses_db') || '[]');
      if (responses.length === 0) {
        showToast('No responses to export yet!');
        return;
      }

      let csv = 'ID,Timestamp,Recipient,Sender,Food,Adventure,Date,Time,DressCode,Note\n';
      responses.forEach(r => {
        csv += `"${r.id}","${r.timestamp}","${r.recipient}","${r.sender}","${r.food}","${r.activity}","${r.date}","${r.time}","${r.vibe}","${(r.wish || '').replace(/"/g, '""')}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Date_Responses_Backup_Vikul_${Date.now()}.csv`;
      link.click();
      showToast('📥 Responses exported to CSV!');
    } catch (e) {
      showToast('Error exporting CSV');
    }
  }

  function clearAllResponses() {
    if (confirm('Are you sure you want to clear all response logs?')) {
      try {
        localStorage.removeItem('date_proposals_responses_db');
        renderAdminResponses();
        showToast('Logs cleared!');
      } catch (e) {}
    }
  }

  // --- Render Boarding Pass Details ---
  function renderTicketDetails() {
    const ticketDateVal = document.getElementById('ticket-date-val');
    const ticketFoodVal = document.getElementById('ticket-food-val');
    const ticketActivityVal = document.getElementById('ticket-activity-val');
    const ticketVibeVal = document.getElementById('ticket-vibe-val');
    const ticketWishVal = document.getElementById('ticket-wish-val');
    const ticketWishContainer = document.getElementById('ticket-wish-container');

    if (ticketDateVal) {
      ticketDateVal.textContent = `${state.selectedDate} @ ${state.selectedTime}`;
    }
    if (ticketFoodVal) {
      ticketFoodVal.textContent = state.selectedFood ? `${state.selectedFood.title} ${state.selectedFood.icon}` : 'Italian & Candlelight 🍝';
    }
    if (ticketActivityVal) {
      ticketActivityVal.textContent = state.selectedActivity ? `${state.selectedActivity.title} ${state.selectedActivity.icon}` : 'Stargazing & Blanket Fort ✨';
    }
    if (ticketVibeVal) {
      ticketVibeVal.textContent = state.selectedVibe;
    }
    if (ticketWishVal && ticketWishContainer) {
      if (state.secretWish) {
        ticketWishContainer.style.display = 'block';
        ticketWishVal.textContent = `"${state.secretWish}"`;
      } else {
        ticketWishContainer.style.display = 'block';
        ticketWishVal.textContent = `"Unlimited kisses and warm hugs guaranteed!" 💕`;
      }
    }
  }

  // --- Typewriter Love Letter Effect ---
  function typewriterLetter() {
    if (!typewriterLetterContent) return;
    typewriterLetterContent.innerHTML = '';
    const text = state.customLetter;
    let i = 0;
    const speed = 22; // ms per char

    function typeChar() {
      if (i < text.length) {
        typewriterLetterContent.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, speed);
      }
    }
    typeChar();
  }

  // --- Update Shareable URL ---
  function updateShareableUrl() {
    if (!shareableUrlInput) return;
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('to', state.recipient);
    params.set('from', state.sender);
    if (state.whatsappPhone) params.set('phone', state.whatsappPhone);
    params.set('msg', state.proposalText);
    params.set('theme', state.theme);
    shareableUrlInput.value = `${base}?${params.toString()}`;
  }

  // --- Toast Notifications ---
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // --- Download Ticket as PNG Image (Canvas Snapshot) ---
  function downloadTicketImage() {
    const canvas = document.getElementById('ticket-export-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 700;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (state.theme === 'midnight') {
      bgGrad.addColorStop(0, '#1e1b4b');
      bgGrad.addColorStop(1, '#0f172a');
    } else if (state.theme === 'lavender') {
      bgGrad.addColorStop(0, '#f5f3ff');
      bgGrad.addColorStop(1, '#ddd6fe');
    } else if (state.theme === 'peach') {
      bgGrad.addColorStop(0, '#fff7ed');
      bgGrad.addColorStop(1, '#fed7aa');
    } else {
      bgGrad.addColorStop(0, '#ffe4eb');
      bgGrad.addColorStop(1, '#fbb2c4');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Boarding Pass Ticket Box
    const margin = 45;
    const ticketW = canvas.width - (margin * 2);
    const ticketH = canvas.height - (margin * 2);

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = '#ffffff';
    roundRect(ctx, margin, margin, ticketW, ticketH, 24);
    ctx.fill();
    ctx.restore();

    // Top Hologram Strip
    const holoGrad = ctx.createLinearGradient(margin, margin, margin + ticketW, margin);
    holoGrad.addColorStop(0, '#f43f5e');
    holoGrad.addColorStop(0.25, '#fbbf24');
    holoGrad.addColorStop(0.5, '#10b981');
    holoGrad.addColorStop(0.75, '#3b82f6');
    holoGrad.addColorStop(1, '#f43f5e');
    ctx.fillStyle = holoGrad;
    roundRect(ctx, margin, margin, ticketW, 10, { tl: 24, tr: 24, bl: 0, br: 0 });
    ctx.fill();

    // Left Main Ticket Section
    const leftWidth = ticketW - 280;

    // Brand Header
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('💖 CUPID AIRWAYS • DATE CLASS', margin + 35, margin + 55);

    ctx.fillStyle = '#64748b';
    ctx.font = '14px monospace';
    ctx.fillText('FLIGHT: LOVE-2026-XOXO', margin + 35, margin + 78);

    // Route Row
    ctx.fillStyle = '#f1f5f9';
    roundRect(ctx, margin + 35, margin + 95, leftWidth - 70, 75, 12);
    ctx.fill();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('PASSENGER', margin + 55, margin + 122);
    ctx.fillText('INVITED BY', margin + leftWidth - 190, margin + 122);

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 26px serif';
    ctx.fillText(state.recipient, margin + 55, margin + 152);
    ctx.fillText(state.sender, margin + leftWidth - 190, margin + 152);

    // Center Airplane & Heart
    ctx.fillStyle = '#f43f5e';
    ctx.font = '18px sans-serif';
    ctx.fillText('✈️ 💕', margin + (leftWidth / 2) - 25, margin + 140);

    // Date Details Grid
    const gridY = margin + 205;
    const col1X = margin + 35;
    const col2X = margin + (leftWidth / 2) + 10;

    drawTicketField(ctx, 'DATE & TIME', `${state.selectedDate} @ ${state.selectedTime}`, col1X, gridY);
    drawTicketField(ctx, 'CUISINE', state.selectedFood ? `${state.selectedFood.title} ${state.selectedFood.icon}` : 'Italian & Candlelight 🍝', col2X, gridY);
    
    drawTicketField(ctx, 'ADVENTURE', state.selectedActivity ? `${state.selectedActivity.title} ${state.selectedActivity.icon}` : 'Stargazing & Blanket Fort ✨', col1X, gridY + 70);
    drawTicketField(ctx, 'DRESS CODE', state.selectedVibe, col2X, gridY + 70);

    // Sweet Note
    const wish = state.secretWish || 'Unlimited kisses and sweet memories included!';
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'italic 17px serif';
    ctx.fillText(`"${wish}"`, col1X, gridY + 155);

    // Developer Credit
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Special Invitation Crafted with Love by Vikul Tyagi ✨', col1X, gridY + 195);

    // Perforation Dashed Line
    const perfX = margin + leftWidth;
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(perfX, margin + 15);
    ctx.lineTo(perfX, margin + ticketH - 15);
    ctx.stroke();
    ctx.setLineDash([]);

    // Right Stub Section
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('BOARDING PASS', perfX + 30, margin + 55);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('SEAT: 1A (VIP)', perfX + 30, margin + 85);

    drawTicketField(ctx, 'PASSENGER', state.recipient, perfX + 30, margin + 130);
    drawTicketField(ctx, 'GATE', 'HEAVEN 💕', perfX + 30, margin + 200);
    drawTicketField(ctx, 'VIBE', '100/10 ✨', perfX + 30, margin + 270);

    // Barcode Mock
    ctx.fillStyle = '#0f172a';
    for (let b = 0; b < 30; b++) {
      const bx = perfX + 30 + (b * 6.5);
      const bw = (b % 3 === 0) ? 4 : 2;
      ctx.fillRect(bx, margin + 350, bw, 45);
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.fillText('XOXO-FOREVER-LOVE', perfX + 50, margin + 415);

    // Download PNG trigger
    const link = document.createElement('a');
    link.download = `Date_VIP_Pass_${state.recipient.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('📸 Date VIP Pass downloaded!');
  }

  function drawTicketField(ctx, label, value, x, y) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(label, x, y);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(value, x, y + 24);
  }

  function roundRect(ctx, x, y, width, height, radius) {
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
  }

  // --- Background Ambient Canvas (Floating Hearts & Sparkles) ---
  function setupAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 28;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class AmbientParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 40;
        this.size = Math.random() * 14 + 10;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.45 + 0.15;
        this.type = Math.random() > 0.4 ? 'heart' : 'sparkle';
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -30) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        if (this.type === 'heart') {
          ctx.font = `${this.size}px serif`;
          ctx.fillText('💖', this.x, this.y);
        } else {
          ctx.font = `${this.size * 0.8}px serif`;
          ctx.fillText('✨', this.x, this.y);
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const p = new AmbientParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- Confetti Cannon Engine ---
  let confettiParticles = [];
  let confettiCtx = null;
  let confettiCanvas = null;

  function setupConfettiCanvas() {
    confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');

    function resize() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function loop() {
      if (confettiParticles.length > 0) {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
          const p = confettiParticles[i];
          p.update();
          p.draw(confettiCtx);
          if (p.life <= 0 || p.y > confettiCanvas.height + 50) {
            confettiParticles.splice(i, 1);
          }
        }
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  function triggerConfettiExplosion() {
    if (!confettiCanvas) return;
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#34d399', '#60a5fa'];
    const emojis = ['💖', '💕', '✨', '🌸', '🍓', '🥰'];

    for (let i = 0; i < 90; i++) {
      const angle = (Math.random() * Math.PI) + Math.PI; // Upwards burst
      const speed = Math.random() * 12 + 6;
      confettiParticles.push({
        x: confettiCanvas.width / 2,
        y: confettiCanvas.height / 2 + 50,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: Math.random() > 0.5 ? emojis[Math.floor(Math.random() * emojis.length)] : null,
        size: Math.random() * 10 + 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        life: 1,
        decay: Math.random() * 0.008 + 0.006,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += 0.28; // Gravity
          this.rotation += this.rotationSpeed;
          this.life -= this.decay;
        },
        draw(ctx) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate((this.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, this.life);
          if (this.emoji) {
            ctx.font = `${this.size * 1.5}px serif`;
            ctx.fillText(this.emoji, -this.size / 2, this.size / 2);
          } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
          }
          ctx.restore();
        }
      });
    }
  }

  function spawnMiniHeartBurst(x, y) {
    if (!confettiCanvas) return;
    for (let i = 0; i < 5; i++) {
      confettiParticles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6 - 2,
        emoji: '💔',
        size: 14,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 6,
        life: 1,
        decay: 0.03,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.life -= this.decay;
        },
        draw(ctx) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.globalAlpha = Math.max(0, this.life);
          ctx.font = `${this.size}px serif`;
          ctx.fillText(this.emoji, -this.size / 2, this.size / 2);
          ctx.restore();
        }
      });
    }
  }

  // Initialize on load
  window.addEventListener('DOMContentLoaded', init);
})();
