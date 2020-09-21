window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('voice-form');
  const input = document.getElementById('speech');
  const main = document.getElementsByTagName('main')[0];
  const voiceSelect = document.getElementById('voices');
  let voices;
  let currentVoice;

  const populateVoices = () => {
    const availableVoices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';

    availableVoices.forEach(voice => {
      const option = document.createElement('option');
      let optionText = `${voice.name} (${voice.lang})`;
      if (voice.default) {
        optionText += ' [default]';
        if (typeof currentVoice === 'undefined') {
          currentVoice = voice;
          option.selected = true;
        }
      }
      if (currentVoice === voice) {
        option.selected = true;
      }
      option.textContent = optionText;
      voiceSelect.appendChild(option);
    });
    voices = availableVoices;
  };

  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  voiceSelect.addEventListener('change', event => {
    const selectedIndex = event.target.selectedIndex;
    currentVoice = voices[selectedIndex];
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const toSay = input.value.trim();
    const utterance = new SpeechSynthesisUtterance(toSay);
    utterance.voice = currentVoice;
    utterance.addEventListener('start', event => {
      main.classList.add('speaking');
    });
    utterance.addEventListener('end', event => {
      main.addEventListener(
        'animationiteration',
        event => {
          main.classList.remove('speaking');
        },
        {
          once: true
        }
      );
    });
    speechSynthesis.speak(utterance);
    input.value = '';
  });
});