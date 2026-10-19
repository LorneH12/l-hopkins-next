'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('#hero-video');
// Native infinite looping preserves manual pause and reduced-motion behavior.
hero.loop = true;
const toggle = document.querySelector('#hero-toggle');
const status = document.querySelector('#hero-status');
let userInteracted = false;
let automaticPlaybackAttempted = false;
function syncPlayback(){toggle.textContent = hero.paused ? 'Play background video' : 'Pause background video';}
hero.addEventListener('loadeddata',()=>{if(!userInteracted && !automaticPlaybackAttempted && !reducedMotion.matches){automaticPlaybackAttempted = true;hero.play().catch(()=>{});}});
hero.addEventListener('play',syncPlayback);
hero.addEventListener('pause',syncPlayback);
toggle.addEventListener('click',()=>{userInteracted = true;if(hero.paused)hero.play().catch(()=>{status.textContent='Video playback is unavailable. Please try again or use the player in the video library.';});else hero.pause();});
reducedMotion.addEventListener('change',event=>{if(event.matches)hero.pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)hero.pause();});
function mediaError(video){if(video===hero){status.textContent='The rough review film could not load. Please try again.';}else{const message=video.parentElement.querySelector('.media-status');if(message)message.textContent='This video could not load. Please try again.';}}
document.querySelectorAll('video').forEach(video=>{video.addEventListener('error',()=>mediaError(video));video.querySelectorAll('source').forEach(source=>source.addEventListener('error',()=>mediaError(video)));});

// Progressive enhancement: content is visible and final-valued before observation.
const counters = [...document.querySelectorAll('[data-count]')];
const finishCounters = () => counters.forEach(node => { node.textContent = node.dataset.count; });
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const intros = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('cutout-entered');
    intros.unobserve(entry.target);
  }), { threshold: .15 });
  document.querySelectorAll('.portrait:has(img), .category-image:has(img)').forEach(node => intros.observe(node));
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
