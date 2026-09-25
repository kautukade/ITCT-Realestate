const menuBtn=document.querySelector('.menu'); const navLinks=document.querySelector('.nav-links');
if(menuBtn) menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'));

document.querySelectorAll('form[data-store]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const key=form.dataset.store;
    const data={id:(key==='seller'?'SL-':'BY-')+Date.now().toString().slice(-6),submittedAt:new Date().toISOString()};
    new FormData(form).forEach((v,k)=>{ if(v instanceof File){ if(v.name) data[k]=v.name } else data[k]=v });
    const existing=JSON.parse(localStorage.getItem('ypc_'+key)||'[]'); existing.push(data); localStorage.setItem('ypc_'+key,JSON.stringify(existing));
    const success=form.querySelector('.success'); if(success){success.style.display='block';success.innerHTML=`✅ Submitted successfully. Reference ID: <b>${data.id}</b>. Our property team will contact you.`}
    form.reset(); window.scrollTo({top:form.offsetTop-90,behavior:'smooth'});
  })
})


// CINEMATIC-3D-V2
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.querySelector('.nav');
  const glow = document.querySelector('.cursor-glow');
  const canvas = document.getElementById('sceneCanvas');

  const updateNav = () => nav && nav.classList.toggle('scrolled', window.scrollY > 28);
  updateNav();
  window.addEventListener('scroll', updateNav, {passive:true});

  if (!reduced && glow && window.matchMedia('(pointer:fine)').matches) {
    let gx = innerWidth/2, gy = innerHeight/2, tx = gx, ty = gy;
    window.addEventListener('pointermove', e => { tx=e.clientX; ty=e.clientY; }, {passive:true});
    const glowLoop = () => { gx += (tx-gx)*.09; gy += (ty-gy)*.09; glow.style.transform=`translate3d(${gx-210}px,${gy-210}px,0)`; requestAnimationFrame(glowLoop); };
    glowLoop();
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){ const d=Number(entry.target.dataset.delay||0); setTimeout(()=>entry.target.classList.add('is-visible'),d); io.unobserve(entry.target); }
    }), {threshold:.12});
    reveals.forEach(el=>io.observe(el));
  } else reveals.forEach(el=>el.classList.add('is-visible'));

  if (!reduced && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.tilt').forEach(card => {
      const amount = Number(card.dataset.tilt || 6);
      card.addEventListener('pointermove', e => {
        const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(1000px) rotateX(${-y*amount}deg) rotateY(${x*amount}deg) translateZ(6px)`;
      });
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
    document.querySelectorAll('.magnetic').forEach(btn=>{
      btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px)`;});
      btn.addEventListener('pointerleave',()=>btn.style.transform='');
    });
    const stage=document.querySelector('.visual-stage');
    if(stage){
      stage.addEventListener('pointermove',e=>{
        const r=stage.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        stage.querySelectorAll('[data-depth]').forEach(el=>{const d=Number(el.dataset.depth);el.style.transform=`translate3d(${x*d*26}px,${y*d*22}px,${d*8}px)`;});
      });
      stage.addEventListener('pointerleave',()=>stage.querySelectorAll('[data-depth]').forEach(el=>el.style.transform=''));
    }
  }

  document.querySelectorAll('.count-up').forEach(el=>{
    let started=false;
    const start=()=>{
      if(started) return; started=true;
      const target=Number(el.dataset.count||0), suffix=el.dataset.suffix||'', t0=performance.now(), duration=1200;
      const tick=now=>{const p=Math.min(1,(now-t0)/duration), eased=1-Math.pow(1-p,3);el.textContent=Math.round(target*eased)+suffix;if(p<1)requestAnimationFrame(tick);};
      requestAnimationFrame(tick);
    };
    if('IntersectionObserver' in window){const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){start();o.disconnect();}},{threshold:.5});o.observe(el)} else start();
  });

  if (canvas && !reduced) {
    const ctx=canvas.getContext('2d');
    let w=0,h=0,dpr=Math.min(devicePixelRatio||1,2), particles=[];
    const resize=()=>{w=canvas.clientWidth;h=canvas.clientHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.min(88,Math.max(42,Math.round(w/18)));particles=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()*1+.2,s:.25+Math.random()*.8,vy:.08+Math.random()*.18}));};
    resize(); addEventListener('resize',resize,{passive:true});
    let pointer={x:w*.7,y:h*.35};
    addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY},{passive:true});
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      for(let i=0;i<particles.length;i++){
        const p=particles[i]; p.y-=p.vy*p.z; if(p.y<-20){p.y=h+20;p.x=Math.random()*w}
        const ox=(pointer.x-w/2)*.006*p.z, oy=(pointer.y-h/2)*.006*p.z;
        ctx.beginPath(); ctx.arc(p.x+ox,p.y+oy,p.s*p.z*1.5,0,Math.PI*2); ctx.fillStyle=`rgba(225,239,255,${.12+.28*p.z})`; ctx.fill();
        for(let j=i+1;j<Math.min(i+5,particles.length);j++){
          const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.hypot(dx,dy);
          if(dist<100){ctx.beginPath();ctx.moveTo(p.x+ox,p.y+oy);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(113,190,226,${(1-dist/100)*.05})`;ctx.lineWidth=.5;ctx.stroke();}
        }
      }
      requestAnimationFrame(draw);
    }; draw();
  }
})();
