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
