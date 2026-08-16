/**
 * Web Audio API Romantic Melodic Synthesizer & Sound FX Engine
 * Zero external audio files required — runs instantly in any browser.
 */

class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.currentNoteIndex = 0;
    this.tempo = 90; // BPM
    
    // Romantic Chord progression: Cmaj7 -> Am7 -> Fmaj7 -> G7sus4
    this.melodySequence = [
      // Cmaj7 (C4, E4, G4, B4, C5)
      261.63, 329.63, 392.00, 493.88, 523.25, 392.00, 329.63, 392.00,
      // Am7 (A3, C4, E4, G4, C5)
      220.00, 261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63,
      // Fmaj7 (F3, A3, C4, E4, A4)
      174.61, 220.00, 261.63, 329.63, 440.00, 329.63, 261.63, 220.00,
      // G7 (G3, B3, D4, F4, G4)
      196.00, 246.94, 293.66, 349.23, 392.00, 349.23, 293.66, 246.94
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Toggle Background Romantic Melody
  toggleMusic(onStateChange) {
    this.init();
    if (this.isPlayingMusic) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    if (onStateChange) {
      onStateChange(this.isPlayingMusic);
    }
    return this.isPlayingMusic;
  }

  startMusic() {
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;
    this.currentNoteIndex = 0;
    
    const stepDuration = (60 / this.tempo) * 1000 / 2; // Eighth notes
    
    const playNext = () => {
      if (!this.isPlayingMusic) return;
      const freq = this.melodySequence[this.currentNoteIndex];
      this.playSynthNote(freq, 0.45);
      
      this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melodySequence.length;
      this.musicTimer = setTimeout(playNext, stepDuration);
    };

    playNext();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // Soft romantic synth tone
  playSynthNote(freq, duration = 0.4) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Warm Lowpass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.Q.setValueAtTime(2, now);

    // Soft envelope (gentle attack, soft decay)
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  // Sound FX: Cute Bubble Pop on button tap
  playPop() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Sound FX: Cartoon Whoosh when NO button dodges
  playWhoosh() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Sound FX: Twinkle chime on selecting an option
  playChime() {
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      }, idx * 45);
    });
  }

  // Sound FX: Celebratory fanfare when YES is clicked
  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const chords = [
      [523.25, 659.25, 783.99],          // C Major
      [587.33, 739.99, 880.00],          // D Major
      [659.25, 830.61, 987.77],          // E Major
      [783.99, 987.77, 1174.66, 1567.98] // G Major High
    ];

    chords.forEach((chord, step) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        chord.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.6);
        });
      }, step * 120);
    });
  }

  // Sound FX: Harp sweep on opening love letter
  playEnvelopeOpen() {
    this.init();
    if (!this.ctx) return;
    const arp = [392.00, 440.00, 523.25, 659.25, 783.99, 880.00, 1046.50];
    arp.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      }, idx * 40);
    });
  }
}

window.romanticAudio = new RomanticAudioEngine();
