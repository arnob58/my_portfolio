/* Interactive but unobtrusive portfolio motion: no external libraries, no API calls. */
(()=>{
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const sections=[...document.querySelectorAll('main section.block[id]')];
  const links=[...document.querySelectorAll('.nav-links a[href^="#"]')];
  const topBtn=document.querySelector('.to-top');
  const progress=document.querySelector('.scroll-progress');

  const revealTargets=[
    ...document.querySelectorAll('main section.block .kicker, main section.block h2, main section.block > .body-copy, main section.block > .card, main section.block .timeline li, main section.block .product-card, main section.block .proof-card, main section.block .carousel, main section.block .tag-list, main section.block .cta-row, main section.block .checklist li, main section.block .final, main section.block .merged-demo-grid')
  ];
  // Nested elements get a small stagger. The embedded software UIs are not altered.
  if(!reduced.matches && 'IntersectionObserver' in window){
    root.classList.add('motion-enabled');
    revealTargets.forEach(el=>{
      el.dataset.reveal=el.matches('.product-card:nth-child(even), .timeline li:nth-child(even)')?'slide-right':'up';
      const siblings=el.parentElement ? [...el.parentElement.children] : [];
      const siblingIndex=siblings.filter(s=>s.matches('.timeline li,.checklist li,.product-card')).indexOf(el);
      if(siblingIndex>=0)el.style.setProperty('--reveal-delay',`${Math.min(siblingIndex,5)*65}ms`);
    });
    const io=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}
      }
    },{threshold:.06,rootMargin:'0px 0px -40px 0px'});
    revealTargets.forEach(el=>io.observe(el));
  }
  // A natural one-page scroll, no wheel interception or compulsory scroll snapping.
  let queued=false;
  const tick=()=>{
    queued=false;
    const y=window.scrollY||window.pageYOffset;
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(progress)progress.style.transform=`scaleX(${Math.max(0,Math.min(1,max>0?y/max:1))})`;
    if(topBtn){const visible=y>500;topBtn.classList.toggle('visible',visible);topBtn.tabIndex=visible?0:-1;topBtn.setAttribute('aria-hidden',String(!visible));}
    const anchorPoint=y+Math.min(window.innerHeight*.38,300);
    let current='';
    for(const section of sections)if(section.offsetTop<=anchorPoint)current=section.id;
    links.forEach(link=>{
      if(link.getAttribute('href')==='#'+current)link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
    for(const section of sections){
      const rect=section.getBoundingClientRect();
      if(rect.top<window.innerHeight*.72 && rect.bottom>120)section.classList.add('in-view');
    }
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(tick)}};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('load',schedule,{once:true});
  schedule();
  if(topBtn)topBtn.addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:reduced.matches?'auto':'smooth'});
    const sectionNav=document.querySelector('.nav-links');
    if(sectionNav)sectionNav.scrollTo({left:0,behavior:reduced.matches?'auto':'smooth'});
  });
  // Count-up on genuine saved report numbers, once when each comes into view.
  const counts=[...document.querySelectorAll('.product-numbers strong')].filter(el=>/^\d{2,}$/.test(el.textContent.trim()));
  if(!reduced.matches && 'IntersectionObserver' in window){
    const counterObserver=new IntersectionObserver(entries=>{
      for(const e of entries){
        if(!e.isIntersecting)continue;
        counterObserver.unobserve(e.target);
        const el=e.target,end=Number(el.textContent.replaceAll(',',''));
        const start=performance.now(),duration=900;
        function frame(now){
          const fraction=Math.min(1,(now-start)/duration);
          const eased=1-Math.pow(1-fraction,3);
          el.textContent=Math.round(end*eased).toLocaleString('en-CA');
          if(fraction<1)requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }
    },{threshold:.6});
    counts.forEach(el=>counterObserver.observe(el));
  }
})();
