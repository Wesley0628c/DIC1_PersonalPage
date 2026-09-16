/**
 * Personal Page & Real-Time Clock Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let is24Hour = localStorage.getItem('clock_24h') === 'true';
  let rawName = localStorage.getItem('personal_user_name');
  let userName = (rawName && rawName !== 'Alex Morgan') ? rawName : '卓威宏';
  let rawBio = localStorage.getItem('personal_user_bio');
  let userBio = (rawBio && !rawBio.startsWith('Crafting ideas')) ? rawBio : '熱愛探索 AI 智慧應用、物聯網與現代 Web 開發。Crafting ideas, exploring possibilities, and making every second count.';
  let focusGoal = localStorage.getItem('personal_focus_goal') || '';

  // Elements
  const hoursEl = document.getElementById('clockHours');
  const minutesEl = document.getElementById('clockMinutes');
  const secondsEl = document.getElementById('clockSeconds');
  const ampmEl = document.getElementById('clockAmPm');
  const secondRing = document.getElementById('secondRing');
  const fullDateEl = document.getElementById('fullDateDisplay');
  const dayProgressPct = document.getElementById('dayProgressPct');
  const dayProgressBar = document.getElementById('dayProgressBar');
  const greetingEmoji = document.getElementById('greetingEmoji');
  const greetingText = document.getElementById('greetingText');
  const userNameDisplay = document.getElementById('userNameDisplay');
  const userBioDisplay = document.getElementById('userBio');
  const timezoneBadge = document.getElementById('timezoneBadge');
  const dayOfYearBadge = document.getElementById('dayOfYearBadge');
  const weekOfYearBadge = document.getElementById('weekOfYearBadge');
  const formatToggleBtn = document.getElementById('formatToggleBtn');
  const formatToggleLabel = document.getElementById('formatToggleLabel');

  // World Clocks Elements
  const timeLondon = document.getElementById('timeLondon');
  const timeNewYork = document.getElementById('timeNewYork');
  const timeTokyo = document.getElementById('timeTokyo');
  const timeSydney = document.getElementById('timeSydney');

  // Modal Elements
  const editNameBtn = document.getElementById('editNameBtn');
  const nameModal = document.getElementById('nameModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const nameForm = document.getElementById('nameForm');
  const nameInput = document.getElementById('nameInput');
  const bioInput = document.getElementById('bioInput');

  // Focus input
  const focusInput = document.getElementById('focusInput');

  // Quotes
  const quoteText = document.getElementById('quoteText');
  const quoteAuthor = document.getElementById('quoteAuthor');
  const refreshQuoteBtn = document.getElementById('refreshQuoteBtn');

  // Theme dots
  const themeDots = document.querySelectorAll('.palette-dot');

  // Audio elements
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIconOff = document.getElementById('soundIconOff');
  const soundIconOn = document.getElementById('soundIconOn');

  const RING_CIRCUMFERENCE = 2 * Math.PI * 115; // 722.56
  secondRing.style.strokeDasharray = `${RING_CIRCUMFERENCE}`;

  // Quotes Collection
  const quotes = [
    { text: "Time is what we want most, but what we use worst.", author: "William Penn" },
    { text: "The two most powerful warriors are patience and time.", author: "Leo Tolstoy" },
    { text: "Lost time is never found again.", author: "Benjamin Franklin" },
    { text: "Dost thou love life? Then do not squander time, for that's the stuff life is made of.", author: "Benjamin Franklin" },
    { text: "Time is a created thing. To say 'I don't have time' is to say 'I don't want to'.", author: "Lao Tzu" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" }
  ];
  let quoteIndex = 0;

  // Initialize Data
  userNameDisplay.textContent = userName;
  userBioDisplay.textContent = userBio;
  if (focusGoal) focusInput.value = focusGoal;
  applyTheme(activeTheme);
  updateFormatButtonLabel();

  // Set Timezone Info
  try {
    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const offsetMin = -now.getTimezoneOffset();
    const offsetHr = Math.floor(Math.abs(offsetMin) / 60);
    const offsetRemain = Math.abs(offsetMin) % 60;
    const sign = offsetMin >= 0 ? '+' : '-';
    const offsetStr = `GMT${sign}${String(offsetHr).padStart(2, '0')}:${String(offsetRemain).padStart(2, '0')}`;
    const cleanTz = tzName.split('/').pop().replace('_', ' ');
    timezoneBadge.textContent = `${cleanTz} (${offsetStr})`;
  } catch {
    timezoneBadge.textContent = "Local Time";
  }

  // --- Clock Update Engine ---
  function updateClock() {
    const now = new Date();

    const hours24 = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();

    // 12/24 hour conversion
    let displayHours = hours24;
    let ampm = '';

    if (!is24Hour) {
      ampm = hours24 >= 12 ? 'PM' : 'AM';
      displayHours = hours24 % 12;
      if (displayHours === 0) displayHours = 12;
      ampmEl.style.display = 'inline-block';
      ampmEl.textContent = ampm;
    } else {
      ampmEl.style.display = 'none';
    }

    hoursEl.textContent = String(displayHours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    // Ring progress calculation (smooth with ms)
    const secondFraction = (seconds + ms / 1000) / 60;
    const offset = RING_CIRCUMFERENCE * (1 - secondFraction);
    secondRing.style.strokeDashoffset = offset;

    // Full Date String
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fullDateEl.textContent = now.toLocaleDateString(undefined, options);

    // Dynamic Greeting
    updateGreeting(hours24);

    // Day Progress Percentage
    const totalSecondsInDay = 86400;
    const currentSeconds = (hours24 * 3600) + (minutes * 60) + seconds;
    const pct = ((currentSeconds / totalSecondsInDay) * 100).toFixed(1);
    dayProgressPct.textContent = `${pct}%`;
    dayProgressBar.style.width = `${pct}%`;

    // Day of Year & Week of Year
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    dayOfYearBadge.textContent = `#${dayOfYear}`;

    const weekOfYear = Math.ceil((((now - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
    weekOfYearBadge.textContent = `W${weekOfYear}`;

    // Update World Clocks
    updateWorldClocks(now);
  }

  function updateGreeting(hours) {
    if (hours >= 5 && hours < 12) {
      greetingEmoji.textContent = '🌅';
      greetingText.textContent = 'Good morning';
    } else if (hours >= 12 && hours < 18) {
      greetingEmoji.textContent = '☀️';
      greetingText.textContent = 'Good afternoon';
    } else if (hours >= 18 && hours < 22) {
      greetingEmoji.textContent = '🌆';
      greetingText.textContent = 'Good evening';
    } else {
      greetingEmoji.textContent = '🌙';
      greetingText.textContent = 'Night owl hours';
    }
  }

  function formatCityTime(date, timeZone) {
    try {
      const opts = {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24Hour
      };
      return new Intl.DateTimeFormat([], opts).format(date);
    } catch {
      return '--:--';
    }
  }

  function updateWorldClocks(now) {
    timeLondon.textContent = formatCityTime(now, 'Europe/London');
    timeNewYork.textContent = formatCityTime(now, 'America/New_York');
    timeTokyo.textContent = formatCityTime(now, 'Asia/Tokyo');
    timeSydney.textContent = formatCityTime(now, 'Australia/Sydney');
  }

  function updateFormatButtonLabel() {
    formatToggleLabel.textContent = is24Hour ? '12H MODE' : '24H MODE';
  }

  // Animation loop for fluid second ring and clock accuracy
  function tick() {
    updateClock();
    requestAnimationFrame(tick);
  }
  tick();

  // 12/24 Toggle Event
  formatToggleBtn.addEventListener('click', () => {
    is24Hour = !is24Hour;
    localStorage.setItem('clock_24h', is24Hour);
    updateFormatButtonLabel();
    updateClock();
  });

  // Modal Handlers
  function openModal() {
    nameInput.value = userName;
    bioInput.value = userBio;
    nameModal.classList.add('open');
    nameInput.focus();
  }

  function closeModal() {
    nameModal.classList.remove('open');
  }

  editNameBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalCancelBtn.addEventListener('click', closeModal);

  nameModal.addEventListener('click', (e) => {
    if (e.target === nameModal) closeModal();
  });

  nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = nameInput.value.trim();
    const newBio = bioInput.value.trim();
    if (newName) {
      userName = newName;
      userNameDisplay.textContent = userName;
      localStorage.setItem('personal_user_name', userName);
    }
    if (newBio) {
      userBio = newBio;
      userBioDisplay.textContent = userBio;
      localStorage.setItem('personal_user_bio', userBio);
    }
    closeModal();
  });

  // Focus Goal handler
  focusInput.addEventListener('input', (e) => {
    localStorage.setItem('personal_focus_goal', e.target.value);
  });

  // Theme Picker
  function applyTheme(themeName) {
    document.body.dataset.theme = themeName;
    themeDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.color === themeName);
    });
    localStorage.setItem('page_theme', themeName);
  }

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      applyTheme(dot.dataset.color);
    });
  });

  // Quotes Cycle
  refreshQuoteBtn.addEventListener('click', () => {
    quoteIndex = (quoteIndex + 1) % quotes.length;
    const q = quotes[quoteIndex];
    quoteText.style.opacity = '0';
    quoteAuthor.style.opacity = '0';
    setTimeout(() => {
      quoteText.textContent = `"${q.text}"`;
      quoteAuthor.textContent = `— ${q.author}`;
      quoteText.style.opacity = '1';
      quoteAuthor.style.opacity = '1';
    }, 200);
  });

  // --- Ambient Audio Synthesizer (Zero External Dependencies) ---
  let audioCtx = null;
  let noiseNode = null;
  let gainNode = null;
  let isPlayingAudio = false;

  function toggleAudio() {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      startAudio();
    }
  }

  function startAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Create pink/brown ambient noise buffer
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filtering
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5; // boost soft brown noise
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = buffer;
      noiseNode.loop = true;

      // Gentle lowpass filter for relaxing hum
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 1.5);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseNode.start();
      isPlayingAudio = true;
      soundIconOff.classList.add('hidden');
      soundIconOn.classList.remove('hidden');
      soundToggleBtn.setAttribute('title', 'Pause ambient focus audio');
    } catch (err) {
      console.warn('Audio could not be initialized:', err);
    }
  }

  function stopAudio() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (noiseNode) {
          noiseNode.stop();
          noiseNode.disconnect();
        }
        if (audioCtx) {
          audioCtx.close();
        }
        isPlayingAudio = false;
        soundIconOff.classList.remove('hidden');
        soundIconOn.classList.add('hidden');
        soundToggleBtn.setAttribute('title', 'Play ambient focus audio');
      }, 500);
    } else {
      isPlayingAudio = false;
      soundIconOff.classList.remove('hidden');
      soundIconOn.classList.add('hidden');
    }
  }

  soundToggleBtn.addEventListener('click', toggleAudio);
});
