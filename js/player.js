

(function () {
  'use strict';

  let TRACKS = [];

  const ICONS = {
    play:    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
    pause:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.2v14H7zM13.8 5H17v14h-3.2z"/></svg>',
    volOn:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.2L12 19V5L7.2 9.5z"/><path d="M15 8.8a4.4 4.4 0 0 1 0 6.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17.4 6.4a7.6 7.6 0 0 1 0 11.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    volMute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.2L12 19V5L7.2 9.5z"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  };

  const audio         = document.getElementById('audio');
  const playBtn       = document.getElementById('playBtn');
  const prevBtn       = document.getElementById('prevBtn');
  const nextBtn       = document.getElementById('nextBtn');
  const muteBtn       = document.getElementById('muteBtn');
  const progressBar   = document.getElementById('progressBar');
  const progressFill  = document.getElementById('progressFill');
  const progressHandle= document.getElementById('progressHandle');
  const volumeBar     = document.getElementById('volumeBar');
  const volumeFill    = document.getElementById('volumeFill');
  const curTimeEl     = document.getElementById('curTime');
  const durTimeEl     = document.getElementById('durTime');
  const trackTitle    = document.getElementById('trackTitle');
  const trackArtist   = document.getElementById('trackArtist');
  const trackArt      = document.getElementById('trackArt');
  const trackCover    = document.getElementById('trackCover');
  const playlistEl    = document.getElementById('playlist');
  const playerEl      = document.getElementById('player');
  const playerToggle  = document.getElementById('playerToggle');
  const visualizer    = document.getElementById('visualizer');
  const vctx          = visualizer.getContext('2d');

  let currentIndex = 0;
  let lastVolume = 0.25;
  let isMuted = false;

  const savedVol = parseFloat(localStorage.getItem('0xrin_vol_v2'));
  if (!isNaN(savedVol) && savedVol >= 0 && savedVol <= 1) lastVolume = savedVol;

  let audioCtx = null;
  let analyser = null;
  let source = null;
  let freqData = null;
  let audioReady = false;

  function initAudioContext() {
    if (audioReady) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      freqData = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      audioReady = true;
      visualizer.classList.add('active');
    } catch (err) {
      console.warn('[player] Web Audio API unavailable:', err);
    }
  }

  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    const W = visualizer.width;
    const H = visualizer.height;
    vctx.clearRect(0, 0, W, H);

    if (!analyser || audio.paused) {

      const t = Date.now() / 600;
      const bars = 24;
      const bw = W / bars;
      for (let i = 0; i < bars; i++) {
        const amp = (Math.sin(t + i * 0.4) * 0.5 + 0.5) * 0.15 + 0.06;
        const bh = amp * H;
        vctx.fillStyle = `rgba(179, 136, 255, ${0.25 + amp})`;
        vctx.fillRect(i * bw + 1, H - bh, bw - 2, bh);
      }
      return;
    }

    analyser.getByteFrequencyData(freqData);
    const bars = freqData.length;
    const bw = W / bars;

    for (let i = 0; i < bars; i++) {
      const v = freqData[i] / 255;
      const bh = Math.max(2, v * H);
      vctx.fillStyle = '#b388ff';
      vctx.shadowColor = '#b388ff';
      vctx.shadowBlur = 6;
      vctx.fillRect(i * bw + 1, H - bh, bw - 2, bh);
    }
    vctx.shadowBlur = 0;
  }

  function fmtTime(sec) {
    if (!isFinite(sec) || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function loadTrack(index, autoplay) {
    if (!TRACKS.length) {
      trackTitle.textContent = 'no tracks';
      trackArtist.textContent = 'drop mp3 into /audio';
      return;
    }
    currentIndex = (index + TRACKS.length) % TRACKS.length;
    const t = TRACKS[currentIndex];
    audio.src = t.src;
    trackTitle.textContent = t.title;
    trackArtist.textContent = t.artist;

    if (t.cover) {
      trackCover.src = t.cover;
      trackCover.style.display = 'block';
      trackArt.classList.add('has-cover');
    } else {
      trackCover.removeAttribute('src');
      trackCover.style.display = 'none';
      trackArt.classList.remove('has-cover');
    }

    updatePlaylistUI();
    if (autoplay) play();
  }

  function play() {
    initAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    const p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => setPlayIcon(false));
    }
  }
  function pause() { audio.pause(); }
  function togglePlay() { if (audio.paused) play(); else pause(); }

  function setPlayIcon(isPlaying) {
    playBtn.innerHTML = isPlaying ? ICONS.pause : ICONS.play;
    playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    trackArt.classList.toggle('playing', isPlaying);
    updatePlaylistUI();
  }

  function setVolume(v) {
    v = Math.max(0, Math.min(1, v));
    audio.volume = v;
    volumeFill.style.width = (v * 100) + '%';
    isMuted = v === 0;
    muteBtn.innerHTML = isMuted ? ICONS.volMute : ICONS.volOn;
    muteBtn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
    if (v > 0) lastVolume = v;
    localStorage.setItem('0xrin_vol_v2', String(v));
  }

  function renderPlaylist() {
    playlistEl.innerHTML = '';
    TRACKS.forEach((t, i) => {
      const item = document.createElement('div');
      item.className = 'playlist-item';
      item.dataset.index = i;
      item.innerHTML = `
        <span class="pl-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="pl-eq"><span></span><span></span><span></span></span>
        <span class="pl-title">${t.title} <small style="color:var(--fg-mute)">- ${t.artist}</small></span>
      `;
      item.addEventListener('click', () => loadTrack(i, true));
      playlistEl.appendChild(item);
    });
    updatePlaylistUI();
  }

  function updatePlaylistUI() {
    const items = playlistEl.querySelectorAll('.playlist-item');
    items.forEach((el, i) => {
      const active = i === currentIndex;
      el.classList.toggle('active', active);
      el.classList.toggle('playing', active && !audio.paused);
    });
  }

  trackArt.addEventListener('click', togglePlay);

  audio.addEventListener('play',  () => setPlayIcon(true));
  audio.addEventListener('pause', () => setPlayIcon(false));
  audio.addEventListener('ended', () => loadTrack(currentIndex + 1, true));
  audio.addEventListener('loadedmetadata', () => {
    durTimeEl.textContent = fmtTime(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    progressHandle.style.left = pct + '%';
    curTimeEl.textContent = fmtTime(audio.currentTime);
  });

  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', () => loadTrack(currentIndex - 1, true));
  nextBtn.addEventListener('click', () => loadTrack(currentIndex + 1, true));

  muteBtn.addEventListener('click', () => {
    if (isMuted || audio.volume === 0) setVolume(lastVolume || 0.25);
    else setVolume(0);
  });

  function seekFromEvent(e) {
    const rect = progressBar.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    if (audio.duration) audio.currentTime = pct * audio.duration;
  }
  let dragging = false;
  progressBar.addEventListener('mousedown', (e) => { dragging = true; seekFromEvent(e); });
  window.addEventListener('mousemove', (e) => { if (dragging) seekFromEvent(e); });
  window.addEventListener('mouseup', () => { dragging = false; });
  progressBar.addEventListener('touchstart', (e) => { dragging = true; seekFromEvent(e); }, { passive: true });
  progressBar.addEventListener('touchmove',  (e) => { if (dragging) seekFromEvent(e); }, { passive: true });
  progressBar.addEventListener('touchend',   () => { dragging = false; });

  function volFromEvent(e) {
    const rect = volumeBar.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    setVolume(x / rect.width);
  }
  let volDragging = false;
  volumeBar.addEventListener('mousedown', (e) => { volDragging = true; volFromEvent(e); });
  window.addEventListener('mousemove', (e) => { if (volDragging) volFromEvent(e); });
  window.addEventListener('mouseup', () => { volDragging = false; });

  playerToggle.addEventListener('click', () => {
    const collapsed = playerEl.classList.toggle('collapsed');
    playerToggle.setAttribute('aria-expanded', String(!collapsed));
  });

  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    else if (e.code === 'ArrowRight' && e.shiftKey) { loadTrack(currentIndex + 1, true); }
    else if (e.code === 'ArrowLeft' && e.shiftKey)  { loadTrack(currentIndex - 1, true); }
    else if (e.code === 'KeyM') { muteBtn.click(); }
  });

  setVolume(lastVolume);
  drawVisualizer();

  fetch('tracks.json', { cache: 'no-cache' })
    .then((res) => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then((data) => {
      TRACKS = Array.isArray(data) ? data : (Array.isArray(data.tracks) ? data.tracks : []);
      renderPlaylist();
      loadTrack(0, false);
    })
    .catch((err) => {
      console.warn('[player] tracks.json not loaded:', err);
      trackTitle.textContent = 'no tracks';
      trackArtist.textContent = 'edit tracks.json';
    });
})();
