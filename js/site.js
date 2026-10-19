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
if('IntersectionObserver' in window && !reducedMotion.matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.1});document.querySelectorAll('.reveal').forEach(item=>{item.classList.add('is-ready');observer.observe(item);});}

