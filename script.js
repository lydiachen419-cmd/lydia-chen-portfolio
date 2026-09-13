// Click any figure image or clip to open it full size.
(function () {
  const items = document.querySelectorAll(
    '.media-row figure img, .media-row figure video, .detail-hero img'
  );
  if (!items.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.hidden = true;
  overlay.innerHTML =
    '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>' +
    '<div class="lightbox-stage"></div>' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(overlay);

  const stage = overlay.querySelector('.lightbox-stage');
  const caption = overlay.querySelector('.lightbox-caption');
  const closeBtn = overlay.querySelector('.lightbox-close');
  let lastFocused = null;

  function open(source) {
    stage.replaceChildren();

    if (source.tagName === 'VIDEO') {
      const clip = document.createElement('video');
      clip.src = source.currentSrc || source.src;
      clip.controls = true;
      clip.loop = true;
      clip.playsInline = true;
      clip.autoplay = true;
      stage.appendChild(clip);
    } else {
      const full = document.createElement('img');
      full.src = source.currentSrc || source.src;
      full.alt = source.alt || '';
      stage.appendChild(full);
    }

    const figcaption = source.closest('figure')?.querySelector('figcaption');
    caption.textContent = figcaption ? figcaption.textContent : (source.alt || '');
    caption.hidden = !caption.textContent;

    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    stage.replaceChildren();
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((item) => {
    item.classList.add('is-zoomable');

    if (item.tagName === 'VIDEO') {
      // Controls must stay usable, so only the expand button opens the clip.
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'zoom-btn';
      button.textContent = 'Expand';
      button.addEventListener('click', () => open(item));
      item.closest('figure')?.appendChild(button);
      return;
    }

    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.addEventListener('click', () => open(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(item);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === stage) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) close();
  });
})();

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
