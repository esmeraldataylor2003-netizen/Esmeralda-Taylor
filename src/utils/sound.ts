// Web Audio API gentle synthesized chimes and controllable speech read-aloud

class SoundManager {
  private ctx: AudioContext | null = null;
  public muted = false;
  public volumeLevel = 0.65; // 0.35 (suave) to 1.0 (médio/alto)
  public isSpeaking = false;
  private onSpeakingChange: ((speaking: boolean) => void) | null = null;

  subscribeSpeaking(cb: (speaking: boolean) => void) {
    this.onSpeakingChange = cb;
  }

  private setSpeaking(val: boolean) {
    this.isSpeaking = val;
    this.onSpeakingChange?.(val);
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    delay = 0,
    baseVolume = 0.14
  ) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    const vol = Math.max(0.01, baseVolume * this.volumeLevel);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playTap() {
    this.playTone(520, 0.08, 'triangle', 0, 0.11);
  }

  playStep() {
    this.playTone(440, 0.07, 'sine', 0, 0.09);
  }

  playSuccess() {
    this.playTone(523.25, 0.14, 'triangle', 0, 0.14);
    this.playTone(659.25, 0.14, 'triangle', 0.08, 0.14);
    this.playTone(783.99, 0.24, 'triangle', 0.16, 0.15);
  }

  playGentleTryAgain() {
    this.playTone(329.63, 0.14, 'sine', 0, 0.1);
    this.playTone(293.66, 0.18, 'sine', 0.09, 0.08);
  }

  playHint() {
    this.playTone(587.33, 0.12, 'sine', 0, 0.11);
    this.playTone(880, 0.2, 'sine', 0.08, 0.11);
  }

  playChapterComplete() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      this.playTone(n, 0.25, 'triangle', i * 0.1, 0.15);
    });
  }

  speak(text: string) {
    if (this.muted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT';
      utterance.rate = 0.93;
      utterance.pitch = 1.05;
      utterance.volume = Math.min(1, Math.max(0.2, this.volumeLevel));
      utterance.onstart = () => this.setSpeaking(true);
      utterance.onend = () => this.setSpeaking(false);
      utterance.onerror = () => this.setSpeaking(false);
      this.setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch {
      this.setSpeaking(false);
    }
  }

  stopSpeech() {
    this.setSpeaking(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }
}

export const sound = new SoundManager();
