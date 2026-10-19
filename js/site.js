'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('#hero-video');
// Decorative hero: one autoplay attempt, its own paused frame/static background on fallback.
const heroMedia = hero.closest('.hero-media');
const status = document.querySelector('#hero-status');
let automaticPlaybackAttempted = false;
hero.loop = true;
hero.muted = true;
function staticHero() {
  hero.autoplay = false;
  hero.pause();
  heroMedia.classList.remove('is-playing');
}
function attemptHeroPlayback() {
  if (automaticPlaybackAttempted || reducedMotion.matches || document.hidden) return;
  automaticPlaybackAttempted = true;
  hero.autoplay = true;
  hero.play().catch(staticHero);
}
hero.addEventListener('loadeddata', attemptHeroPlayback, { once: true });
if (hero.readyState >= 2) attemptHeroPlayback();
hero.addEventListener('playing', () => {
  if (reducedMotion.matches || document.hidden) { staticHero(); return; }
  heroMedia.classList.add('is-playing');
});
hero.addEventListener('pause', () => heroMedia.classList.remove('is-playing'));
reducedMotion.addEventListener('change', event => {
  if (event.matches) { hero.autoplay = false; staticHero(); }
  else if (hero.readyState >= 2) attemptHeroPlayback();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) staticHero();
  else if (hero.readyState >= 2) attemptHeroPlayback();
});
function mediaError(video){if(video===hero){staticHero();status.textContent='The rough review film could not load. Please try again.';}else{const message=video.parentElement.querySelector('.media-status');if(message)message.textContent='This video could not load. Please try again.';}}
document.querySelectorAll('video').forEach(video=>{video.addEventListener('error',()=>mediaError(video));video.querySelectorAll('source').forEach(source=>source.addEventListener('error',()=>mediaError(video)));});

// Progressive enhancement: content is visible and final-valued before observation.
const counters = [...document.querySelectorAll('[data-count]')];
const finishCounters = () => counters.forEach(node => { node.textContent = node.dataset.count; });
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const intros = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.parentElement.classList.add('cutout-entered');
    intros.unobserve(entry.target);
  }), { threshold: 1 });
  document.querySelectorAll('.portrait:has(img), .category-image:has(img)').forEach(node => {
    const marker = document.createElement('span');
    marker.className = 'cutout-trigger';
    marker.setAttribute('aria-hidden', 'true');
    node.append(marker);
    intros.observe(marker);
  });
  const counts = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    counts.unobserve(entry.target);
    entry.target.dataset.counted = 'true';
    const nodes = [...entry.target.querySelectorAll('[data-count]')];
    const start = performance.now();
    const tick = now => {
      if (reducedMotion.matches) { finishCounters(); return; }
      const progress = Math.min(1, (now - start) / 850);
      const eased = 1 - Math.pow(1 - progress, 3);
      nodes.forEach(node => {
        const target = node.dataset.count;
        const decimals = (target.split('.')[1] || '').length;
        node.textContent = progress === 1 ? target : (Number(target) * eased).toFixed(decimals);
      });
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  document.querySelectorAll('.count-stat').forEach(node => counts.observe(node));
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { counts.disconnect(); intros.disconnect(); finishCounters(); }
  });
}

// CSS handles scroll-linked opacity; no-JS and reduced-motion use static tones.
document.documentElement.classList.add('tonal-motion');
