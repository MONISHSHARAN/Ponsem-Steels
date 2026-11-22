/* Ponsem Steels – shared site behaviour */
(function(){
'use strict';
var PS = window.PS = window.PS || {};
PS.CONFIG = {
  whatsapp: '919345029544',
  phone: '+91 93450 29544',
  email: 'ponsemsteels@gmail.com',
  formEndpoint: 'https://formsubmit.co/ajax/ponsemsteels@gmail.com'
};
PS.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = PS.$ = function(s,c){return (c||document).querySelector(s)};
var $$ = PS.$$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
PS.waLink = function(msg){return 'https://wa.me/'+PS.CONFIG.whatsapp+'?text='+encodeURIComponent(msg)};
PS.esc = function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
PS.store = {
  get:function(k,d){try{var v=localStorage.getItem('ps_'+k);return v?JSON.parse(v):d}catch(e){return d}},
  set:function(k,v){try{localStorage.setItem('ps_'+k,JSON.stringify(v))}catch(e){}}
};

PS.bindWa = function(root){ $$('[data-wa]',root).forEach(function(a){a.href=PS.waLink(a.getAttribute('data-wa')); a.target='_blank'; a.rel='noopener'}); };
PS.bindWa(document);
var yr=$('#yr'); if(yr) yr.textContent=new Date().getFullYear();

/* Loader */
function ready(){ var l=$('#loader'); if(l) l.classList.add('done'); document.body.classList.add('ready'); }
window.addEventListener('load', function(){ setTimeout(ready, 350) });
setTimeout(ready, 3000);

/* Header / progress / active nav / to-top */
var header=$('header.site'), prog=$('#progress'), toTop=$('#toTop');
var spy=$$('.menu a[data-spy]').map(function(a){return {a:a, s:document.querySelector(a.getAttribute('href').replace(/^.*#/,'#'))}}).filter(function(o){return o.s});
function onScroll(){
  var y=window.scrollY, h=document.documentElement.scrollHeight-innerHeight;
  if(header) header.classList.toggle('scrolled', y>30);
  if(prog) prog.style.width=(h>0? y/h*100:0)+'%';
  if(toTop) toTop.classList.toggle('show', y>700);
  if(spy.length){
    var cur=null; spy.forEach(function(o){ if(o.s.getBoundingClientRect().top < innerHeight*0.35) cur=o; });
    spy.forEach(function(o){o.a.classList.toggle('active', o===cur)});
  }
}
addEventListener('scroll', onScroll, {passive:true}); onScroll();
if(toTop) toTop.addEventListener('click', function(){ scrollTo({top:0, behavior:PS.reduce?'auto':'smooth'}) });

/* Mobile menu */
var burger=$('#burger'), menu=$('#menu');
function closeMenu(){ if(!menu) return; menu.classList.remove('open'); burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
if(burger) burger.addEventListener('click', function(){ var o=menu.classList.toggle('open'); burger.classList.toggle('open',o); burger.setAttribute('aria-expanded',o); });
$$('.menu a').forEach(function(a){a.addEventListener('click', closeMenu)});
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeMenu(); });

/* Reveal on scroll */
PS.reveal = function(root){
  if(!('IntersectionObserver' in window)){ $$('.reveal',root).forEach(function(el){el.classList.add('in')}); return; }
  var io = PS._io || (PS._io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); PS._io.unobserve(e.target);} }) }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'}));
  $$('.reveal:not(.in)',root).forEach(function(el){ io.observe(el) });
};
PS.reveal(document);

/* Counters */
$$('[data-count]').forEach(function(el){
  var target=+el.getAttribute('data-count'), done=false;
  var io=new IntersectionObserver(function(es){ if(es[0].isIntersecting && !done){ done=true; var t0=performance.now();
    (function step(t){ var p=Math.min(1,(t-t0)/1400), v=Math.round(target*(1-Math.pow(1-p,3))); el.textContent=v; if(p<1) requestAnimationFrame(step); })(t0); } });
  io.observe(el);
});

/* WhatsApp hint */
setTimeout(function(){ var w=$('#waFloat'); if(!w) return; w.classList.add('hint'); setTimeout(function(){w.classList.remove('hint')}, 4500); }, 7000);

/* 3D tilt */
PS.tilt = function(root){
  if(PS.reduce || !matchMedia('(hover:hover)').matches) return;
  $$('[data-tilt]',root).forEach(function(card){
    if(card._tilt) return; card._tilt=1;
    var amt=+(card.getAttribute('data-tilt')||10)||10;
    card.addEventListener('mousemove', function(e){
      var r=card.getBoundingClientRect(), px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
      card.style.transform='perspective(1200px) rotateY('+((px-.5)*amt)+'deg) rotateX('+((.5-py)*amt*.8)+'deg)';
      card.style.setProperty('--mx', px*100+'%'); card.style.setProperty('--my', py*100+'%');
    });
    card.addEventListener('mouseleave', function(){ card.style.transform=''; });
  });
};
PS.tilt(document);

/* Magnetic buttons */
if(!PS.reduce && matchMedia('(hover:hover)').matches){
  $$('.magnetic').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.25)+'px)'});
    b.addEventListener('mouseleave',function(){b.style.transform=''});
  });
}

/* FAQ accordion */
$$('.faqs').forEach(function(list){
  $$('.qa',list).forEach(function(q){ var b=$('button',q); b.addEventListener('click', function(){ var o=!q.classList.contains('open'); $$('.qa',list).forEach(function(x){x.classList.remove('open'); $('button',x).setAttribute('aria-expanded','false')}); if(o){q.classList.add('open'); b.setAttribute('aria-expanded','true')} }) });
});

/* Interest preselect from any link */
document.addEventListener('click', function(e){
  var a=e.target.closest('[data-interest]'); if(!a) return;
  var sel=$('#fBrand'); if(sel){ sel.value=a.getAttribute('data-interest'); }
  var msg=a.getAttribute('data-msg'); var m=$('#fMsg'); if(msg && m && !m.value) m.value=msg;
});

/* Enquiry form */
var form=$('#enquiry');
if(form){
  var st=$('#fStatus'), sendBtn=$('#fSend');
  var F=function(n){return form.elements[n]};
  var setBad=function(id, bad){ $('#'+id).closest('.fgroup').classList.toggle('bad', !!bad); return !!bad; };
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(F('_honey').value) return;
    var d={name:F('name').value.trim(), phone:F('phone').value.replace(/[^\d+]/g,''), email:F('email').value.trim(), brand:F('brand').value, quantity:F('quantity').value.trim(), location:F('location').value.trim(), message:F('message').value.trim()};
    var digits=d.phone.replace(/\D/g,'').replace(/^91(?=\d{10}$)/,'').replace(/^0(?=\d{10}$)/,'');
    var bad=false;
    bad = setBad('fName', d.name.length<2) || bad;
    bad = setBad('fPhone', !/^[6-9]\d{9}$/.test(digits)) || bad;
    bad = setBad('fEmail', d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) || bad;
    if(bad){ var f=$('.fgroup.bad .inp',form); if(f) f.focus(); return; }
    var summary='New enquiry – Ponsem Steels website\nName: '+d.name+'\nPhone: '+digits+(d.email?'\nEmail: '+d.email:'')+'\nInterested in: '+d.brand+(d.quantity?'\nQuantity / size: '+d.quantity:'')+(d.location?'\nLocation: '+d.location:'')+(d.message?'\nMessage: '+d.message:'');
    sendBtn.classList.add('loading'); sendBtn.disabled=true; st.className='fstatus'; st.innerHTML='';
    var payload={name:d.name, phone:digits, email:d.email||'not provided', interested_in:d.brand, quantity_or_size:d.quantity||'-', location:d.location||'-', message:d.message||'-', page:location.pathname, _subject:'New enquiry from '+d.name+' ('+d.brand+')', _template:'table', _captcha:'false'};
    if(d.email) payload._replyto=d.email;
    var ctrl=('AbortController' in window)?new AbortController():null;
    var to=setTimeout(function(){ if(ctrl) ctrl.abort(); }, 15000);
    fetch(PS.CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:ctrl?ctrl.signal:undefined})
      .then(function(r){ return r.json().catch(function(){return {}}).then(function(j){return {ok:r.ok,j:j}}) })
      .then(function(res){
        clearTimeout(to);
        if(res.ok && (res.j.success===true || res.j.success==='true')){
          st.className='fstatus ok';
          st.innerHTML='<b>Thank you, '+PS.esc(d.name.split(' ')[0])+'! Your enquiry has been sent.</b>Our team will contact you on '+PS.esc(digits)+' shortly. Need it faster? <a style="text-decoration:underline;font-weight:700" href="'+PS.waLink(summary)+'" target="_blank" rel="noopener">Message us on WhatsApp</a>.';
          form.reset();
        } else { throw new Error((res.j && res.j.message) || 'send failed'); }
      })
      .catch(function(err){
        clearTimeout(to);
        if(window.console) console.warn('Enquiry form:', err && err.message);
        st.className='fstatus fail';
        st.innerHTML='<b>We couldn\'t send the form from here.</b>Your details are still filled in. Send the same enquiry instantly with one tap:<div class="acts"><a class="btn btn-wa btn-sm" href="'+PS.waLink(summary)+'" target="_blank" rel="noopener"><svg><use href="#i-wa"/></svg> Send on WhatsApp</a><a class="btn btn-dark btn-sm" href="mailto:'+PS.CONFIG.email+'?subject='+encodeURIComponent('Enquiry from '+d.name)+'&body='+encodeURIComponent(summary)+'"><svg><use href="#i-mail"/></svg> Send by email</a></div><div style="margin-top:10px;font-size:13px">Or write to <b>'+PS.CONFIG.email+'</b> / call <b>'+PS.CONFIG.phone+'</b>.</div>';
      })
      .then(function(){ sendBtn.classList.remove('loading'); sendBtn.disabled=false; });
  });
  $$('.fgroup .inp',form).forEach(function(i){ i.addEventListener('input', function(){ i.closest('.fgroup').classList.remove('bad') }) });
}
})();
