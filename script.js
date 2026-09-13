// Typewriter rotation for the home hero.
(function () {
  const target = document.getElementById('typeTarget');
  if (!target) return;

  const phrases = JSON.parse(target.dataset.phrases || '[]');
  if (!phrases.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    target.textContent = phrases[0];
    return;
  }

  const TYPE_MS = 62;
  const DELETE_MS = 32;
  const HOLD_MS = 1700;
  const GAP_MS = 380;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = phrases[phraseIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = phrase.slice(0, charIndex);

    let delay = deleting ? DELETE_MS : TYPE_MS;

    if (!deleting && charIndex === phrase.length) {
      deleting = true;
      delay = HOLD_MS;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = GAP_MS;
    }

    setTimeout(tick, delay);
  }

  tick();
})();
