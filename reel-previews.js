/* Hover-to-preview video. No API calls, no prefetch, only one playing clip at a time. */
(()=>{'use strict';const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');let active=null;
function stop(card){if(!card)return;const video=card.querySelector('video[data-preview]');if(video){video.pause();try{video.currentTime=0}catch(e){}}card.classList.remove('is-playing');const btn=card.querySelector('.reel-preview-button');if(btn)btn.textContent='▶ Preview';if(active===card)active=null;}
async function start(card){if(active&&active!==card)stop(active);const video=card.querySelector('video[data-preview]');if(!video)return;if(!video.dataset.loaded){video.src=video.dataset.preview;video.dataset.loaded='true';video.load();}active=card;try{await video.play();if(active===card){card.classList.add('is-playing');card.querySelector('.reel-preview-button').textContent='Ⅱ Pause';}}catch(e){card.classList.remove('is-playing');}}
for(const card of document.querySelectorAll('.reel')){const button=card.querySelector('.reel-preview-button'),video=card.querySelector('video[data-preview]');if(!button||!video)continue;
card.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&!reduce.matches)start(card)});
card.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')stop(card)});
button.addEventListener('click',()=>{if(active===card&&!video.paused)stop(card);else start(card)});
video.addEventListener('click',()=>{if(active===card&&!video.paused)stop(card);else start(card)});
}
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const e of entries)if(!e.isIntersecting&&e.target===active)stop(active)},{threshold:0});document.querySelectorAll('.reel').forEach(el=>observer.observe(el))}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop(active)});
})();
