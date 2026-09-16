(() => {
  const qs = (s, p=document) => p.querySelector(s);
  const qsa = (s, p=document) => [...p.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  qs('#year').textContent = new Date().getFullYear();

  const progressBar = qs('.scroll-progress span');
  let scrollProgress = 0;
  const updateScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollProgress = scrollY / max;
    progressBar.style.height = `${scrollProgress * 100}%`;
    document.documentElement.style.setProperty('--scroll', scrollProgress);
  };
  addEventListener('scroll', updateScroll, {passive:true}); updateScroll();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible'));
  }, {threshold:.12});
  qsa('.reveal').forEach(el => revealObserver.observe(el));

  const counted = new WeakSet();
  const numberObserver = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting || counted.has(target)) return;
      counted.add(target);
      const end = Number(target.dataset.count || 0);
      const decimals = Number(target.dataset.decimals || 0);
      const prefix = target.dataset.prefix || '';
      const suffix = target.dataset.suffix || '';
      const duration = reduceMotion ? 0 : 1100;
      const start = performance.now();
      const tick = now => {
        const t = duration ? Math.min(1, (now-start)/duration) : 1;
        const eased = 1 - Math.pow(1-t, 3);
        const val = end * eased;
        target.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
        if(t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, {threshold:.5});
  qsa('[data-count]').forEach(el => numberObserver.observe(el));

  const caseImg = qs('#case-visual');
  const caseCurrent = qs('#case-current');
  const notes = qsa('.case-note');
  const swapCase = (note, index) => {
    notes.forEach(n => n.classList.remove('active')); note.classList.add('active');
    if (!caseImg || caseImg.src.endsWith(note.dataset.image)) return;
    const wrap = caseImg.closest('.case-visual');
    wrap.classList.add('swapping');
    const preload = new Image();
    preload.src = note.dataset.image;
    preload.onload = () => setTimeout(() => {
      caseImg.src = note.dataset.image;
      caseImg.alt = note.dataset.alt || '';
      caseCurrent.textContent = String(index+1).padStart(2,'0');
      requestAnimationFrame(() => wrap.classList.remove('swapping'));
    }, 140);
  };
  const noteObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible){ const i=notes.indexOf(visible.target); swapCase(visible.target,i); }
  }, {threshold:[.35,.5,.65], rootMargin:'-18% 0px -28% 0px'});
  notes.forEach(n => noteObserver.observe(n));

  if(!reduceMotion){
    qsa('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r=card.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5; const y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(900px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
  }

  const modal = qs('#video-modal'), modalVideo = qs('#modal-video'), modalTitle = qs('#modal-title');
  qsa('.video-card').forEach(card => card.addEventListener('click', () => {
    modalVideo.src = card.dataset.video;
    modalTitle.textContent = card.dataset.title;
    modal.showModal();
    modalVideo.play().catch(()=>{});
  }));
  const closeModal = () => { modalVideo.pause(); modalVideo.removeAttribute('src'); modalVideo.load(); modal.close(); };
  qs('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
  modal.addEventListener('cancel', e => { e.preventDefault(); closeModal(); });

  // THREE.JS — intentionally enhancement-only. The portfolio remains fully usable if WebGL or the CDN is unavailable.
  if(!reduceMotion) initThree();
  async function initThree(){
    try{
      const THREE = await import('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.180.0/three.module.min.js');
      const canvas=qs('#webgl');
      const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
      renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth<700?1.25:1.75));
      renderer.setSize(innerWidth,innerHeight,false);
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
      camera.position.set(0,0,8);

      scene.add(new THREE.AmbientLight(0xffffff,.55));
      const point=new THREE.PointLight(0xadff63,3.2,18); point.position.set(3,3,4); scene.add(point);
      const blue=new THREE.PointLight(0x76a9ff,2.2,15); blue.position.set(-4,-2,2); scene.add(blue);

      const root=new THREE.Group(); scene.add(root);
      const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.35,.28,130,18),new THREE.MeshStandardMaterial({color:0x171d22,metalness:.78,roughness:.28,wireframe:true,transparent:true,opacity:.5,emissive:0x172113,emissiveIntensity:.3}));
      knot.position.set(2.9,.4,-2.2); root.add(knot);
      const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(.75,2),new THREE.MeshStandardMaterial({color:0x2d3740,metalness:.65,roughness:.2,transparent:true,opacity:.42,wireframe:true}));
      orb.position.set(-3.2,-1.6,-1.5); root.add(orb);

      const particleCount=innerWidth<700?320:850;
      const pos=new Float32Array(particleCount*3);
      for(let i=0;i<particleCount;i++){ pos[i*3]=(Math.random()-.5)*18; pos[i*3+1]=(Math.random()-.5)*16; pos[i*3+2]=(Math.random()-.5)*16; }
      const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
      const particles=new THREE.Points(pg,new THREE.PointsMaterial({color:0xb7c1c8,size:.018,transparent:true,opacity:.45})); scene.add(particles);

      const loader=new THREE.TextureLoader();
      const texturePaths=['assets/images/middlehouse-traffic.webp','assets/images/middlehouse-walking.webp','assets/images/personal-ludwig.webp','assets/images/personal-poutine.webp','assets/images/meta-1.webp'];
      const cardGroup=new THREE.Group(); root.add(cardGroup);
      texturePaths.forEach((path,i)=>loader.load(path, tex=>{
        tex.colorSpace=THREE.SRGBColorSpace;
        const ratio=tex.image.width/tex.image.height, h=1.4, w=h*ratio;
        const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false}));
        const angle=(i/texturePaths.length)*Math.PI*2;
        mesh.position.set(Math.cos(angle)*4.7,Math.sin(angle)*2.7,-2.5-i*.28);
        mesh.rotation.set((Math.random()-.5)*.28,(Math.random()-.5)*.45,angle*.08);
        cardGroup.add(mesh);
      }));

      let mx=0,my=0,tmx=0,tmy=0;
      addEventListener('pointermove',e=>{tmx=(e.clientX/innerWidth-.5);tmy=(e.clientY/innerHeight-.5);},{passive:true});
      let last=performance.now();
      const loop=now=>{
        const dt=Math.min(.05,(now-last)/1000); last=now; mx+=(tmx-mx)*.035; my+=(tmy-my)*.035;
        const s=scrollProgress;
        root.rotation.y += dt*.045;
        root.rotation.x = -s*.26 + my*.07;
        cardGroup.rotation.z = s*.6;
        cardGroup.rotation.y = s*1.2 + mx*.16;
        knot.rotation.x += dt*.12; knot.rotation.y += dt*.16;
        orb.rotation.x -= dt*.1; orb.rotation.y += dt*.12;
        camera.position.x=mx*.38; camera.position.y=-my*.25 + (s-.5)*.55; camera.position.z=8-s*1.35;
        point.position.y=3-s*5;
        particles.rotation.y=now*.000018; particles.rotation.x=s*.2;
        renderer.render(scene,camera); requestAnimationFrame(loop);
      }; requestAnimationFrame(loop);
      addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.25:1.75));renderer.setSize(innerWidth,innerHeight,false);},{passive:true});
    }catch(err){
      console.info('Three.js enhancement unavailable; using CSS fallback.',err);
      document.body.classList.add('three-fallback');
    }
  }
})();
