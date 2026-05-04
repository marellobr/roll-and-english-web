'use client';

export function falar(texto, lang = 'en-US') {
  if (typeof window === 'undefined') return;
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = lang;
  utterance.rate = 0.8;
  utterance.pitch = 1;
  utterance.volume = 0.8;

  // Pega vozes e tenta a melhor em inglês
  const falarComVoz = () => {
    const vozes = window.speechSynthesis.getVoices();
    const vozEN =
      vozes.find(v => v.lang === 'en-US' && v.name.includes('Samantha')) ||
      vozes.find(v => v.lang === 'en-US' && v.name.includes('Google')) ||
      vozes.find(v => v.lang === 'en-US') ||
      vozes.find(v => v.lang.startsWith('en'));
    if (vozEN) utterance.voice = vozEN;
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    falarComVoz();
  } else {
    window.speechSynthesis.onvoiceschanged = falarComVoz;
  }
}