/* Ponsem Steels – Steel Doors catalogue */
(function(){
'use strict';
var PS=window.PS, $=PS.$, $$=PS.$$;
var BASE=(document.body.getAttribute('data-root')||'')+'assets/img/doors/';
var SERIES={
  fm:{name:'FM Series', tag:'GI Steel Doors', line:'Durable. Dependable. Designed for everyday.', color:'#c4900f',
      points:['Galvanised (GI) steel construction','Rich wood-grain & embossed finishes','No termites, no warping, low upkeep','Main, back & utility entrances']},
  premium:{name:'Premium Series', tag:'Cast Iron Luxury Doors', line:'Where grandeur meets security.', color:'#b8743a',
      points:['Deep cast relief artwork','Single, double & mother-and-son layouts','Statement entrances for villas & bungalows','Heavy-duty handles & hardware']},
  iconic:{name:'Iconic Series', tag:'Cast Aluminium Doors', line:'Bold in design. Effortless in function.', color:'#5b7fa6',
      points:['Aluminium does not rust','Intricate embossed designs','100% customisable size & finish','Ideal for grand double entrances']},
  smart:{name:'Smart Series', tag:'Digital-Lock Doors', line:'Modern living, keyless entry.', color:'#19a35d',
      points:['Built around digital smart locks','Clean, minimalist flush designs','100% customisable size & finish','Fingerprint · PIN · card · key options*']}
};
function S(a){return a.map(function(x){var p=x.split(' ');var hw=p[0].split('x');return {h:+hw[0],w:+hw[1],note:p[1]||''}})}
var DOORS=[
 {code:'CP-01',s:'fm',name:'Copper Diamond Lattice',sizes:S(['2050x1080','2050x1200']),leaves:1},
 {code:'CP-02',s:'fm',name:'Copper Swirl Medallion',sizes:S(['2050x980','2050x1080']),leaves:1},
 {code:'CP-03',s:'fm',name:'Classic Six-Panel Copper',sizes:S(['2050x880 SL','2050x880 ML']),leaves:1},
 {code:'CP-04',s:'fm',name:'Charcoal Groove, Bronze Inlay',sizes:S(['2050x1200']),leaves:1},
 {code:'HT-01',s:'fm',name:'Maze-Panel Mahogany',sizes:S(['2050x1080','2050x1200']),leaves:1},
 {code:'HT-02',s:'fm',name:'Oval Medallion Rosewood',sizes:S(['2050x980','2050x1080']),leaves:1},
 {code:'HT-03',s:'fm',name:'Arched Panel Teak',sizes:S(['2050x980','2050x1080']),leaves:1},
 {code:'HT-04',s:'fm',name:'Walnut Planks, Black Frame',sizes:S(['2050x880 SL','2050x880 ML']),leaves:1},
 {code:'HT-05',s:'fm',name:'Diagonal Mahogany Grain',sizes:S(['2050x880 SL/ML','2050x1200']),leaves:1},
 {code:'HT-06',s:'fm',name:'Geometric Lines, Light Panel',sizes:S(['2050x1200','2050x1500']),leaves:1},
 {code:'RM-05',s:'fm',name:'Matte Black Fine Groove',sizes:S(['2050x880 ML/SL','2350x880 ML/SL']),leaves:1},
 {code:'RM-01',s:'fm',name:'Mahogany with Steel Accent',sizes:S(['2050x880 ML/SL','2350x980 SL','2050x980']),leaves:1},
 {code:'CA-01',s:'premium',name:'Golden Sunburst Grand',sizes:S(['2350x1500']),leaves:2,split:.5},
 {code:'CA-02',s:'premium',name:'Rose-Bronze Wave Grand',sizes:S(['2350x1500']),leaves:2,split:.5},
 {code:'CA-03',s:'premium',name:'Half-Sun Radial Bronze',sizes:S(['2050x1080','2050x1200']),leaves:2,split:.66},
 {code:'CA-04',s:'premium',name:'Copper Diagonals on Slate',sizes:S(['2050x1080','2050x1200','2050x1500']),leaves:2,split:.66},
 {code:'CA-05',s:'premium',name:'Peacock Fan Relief',sizes:S(['2050x1080','2050x1200','2150x1800']),leaves:2,split:.66},
 {code:'CA-06',s:'premium',name:'Copper Circuit on Hammered Slate',sizes:S(['2050x1080','2050x1200','2050x1500']),leaves:2,split:.66},
 {code:'CA-07',s:'premium',name:'Indigo Sunburst Medallion',sizes:S(['2050x1080','2050x1200','2150x1800']),leaves:2,split:.66},
 {code:'CA-08',s:'premium',name:'Vertical Rib, Long Pull',sizes:S(['2050x1080','2050x1200','2050x1500']),leaves:2,split:.7},
 {code:'AL-01',s:'iconic',name:'Royal Blue Mandala',custom:true,leaves:2,split:.5},
 {code:'AL-02',s:'iconic',name:'Mauve Marble Relief',custom:true,leaves:2,split:.5},
 {code:'AL-03',s:'iconic',name:'Copper Ripple, Digital Lock',custom:true,leaves:2,split:.68},
 {code:'AL-04',s:'iconic',name:'Silver Radiant Rings',custom:true,leaves:2,split:.5},
 {code:'SM-826',s:'smart',name:'Slate Grey, Textured Spine',custom:true,leaves:2,split:.64},
 {code:'SM-827',s:'smart',name:'Walnut Duo-Tone',custom:true,leaves:2,split:.64},
 {code:'SM-801',s:'smart',name:'Ivory with Marble Inlay',custom:true,leaves:2,split:.64},
 {code:'SM-803',s:'smart',name:'Graphite Chrome Sweep',custom:true,leaves:2,split:.64}
];
DOORS.forEach(function(d){ d.img=BASE+d.code.toLowerCase()+'.webp'; d.ratio=(d.s==='fm'?0.513:0.625); });
PS.DOORS=DOORS; PS.SERIES=SERIES;
function byCode(c){return DOORS.find(function(d){return d.code===c})}
function mm2ft(mm){ var inch=mm/25.4, ft=Math.floor(inch/12), i=Math.round(inch-ft*12); if(i===12){ft++;i=0} return ft+"′"+i+"″"; }
function sizeTxt(z){ return z.h+' × '+z.w+' mm'+(z.note?' <em>'+z.note+'</em>':''); }

/* ---------- card ---------- */
function card(d,i){
  var se=SERIES[d.s], lv;
  if(d.leaves===2){
    var sp=(d.split*100).toFixed(1);
    lv='<span class="leaf l" style="width:'+sp+'%;background-image:url('+d.img+');background-size:'+(10000/d.split/100).toFixed(1)+'% 100%;background-position:0 0"></span>'+
       '<span class="leaf r" style="width:'+(100-sp).toFixed(1)+'%;background-image:url('+d.img+');background-size:'+(10000/(1-d.split)/100).toFixed(1)+'% 100%;background-position:100% 0"></span>';
  } else lv='<span class="leaf l solo" style="background-image:url('+d.img+')"></span>';
  return '<article class="dcard reveal" data-s="'+d.s+'" data-code="'+d.code+'" style="--sc:'+se.color+';transition-delay:'+(i%4*0.06)+'s">'+
    '<button class="dopen" aria-label="View '+d.code+' '+PS.esc(d.name)+'"><span class="portal"><span class="glow"></span><span class="peek">View<br><b>'+d.code+'</b></span>'+lv+'</span></button>'+
    '<div class="dmeta"><span class="dcode">'+d.code+'</span><span class="dser">'+se.name+'</span></div>'+
    '<h4>'+PS.esc(d.name)+'</h4>'+
    '<div class="dsz">'+(d.custom?'<span>Made to your size</span>':d.sizes.map(function(z){return '<span>'+z.h+'×'+z.w+(z.note?' '+z.note:'')+'</span>'}).join(''))+'</div>'+
    '<div class="dacts"><button class="sl-add" data-add="'+d.code+'" aria-pressed="false"><svg><use href="#i-heart"/></svg><span>Shortlist</span></button>'+
    '<a class="dwa" data-wa="Hi Ponsem Steels, I\'m interested in steel door '+d.code+' ('+PS.esc(d.name)+'). Please share price & availability."><svg><use href="#i-wa"/></svg>Enquire</a></div>'+
  '</article>';
}

/* ---------- catalogue ---------- */
var grid=$('#doorGrid');
if(grid){
  grid.innerHTML=DOORS.map(card).join('');
  PS.bindWa(grid); PS.reveal(grid);
  var filt='all', q='';
  function apply(){
    var n=0; $$('.dcard',grid).forEach(function(c){ var d=byCode(c.getAttribute('data-code'));
      var ok=(filt==='all'||d.s===filt) && (!q || (d.code+' '+d.name+' '+SERIES[d.s].name+' '+SERIES[d.s].tag).toLowerCase().indexOf(q)>-1);
      c.hidden=!ok; if(ok){ n++; c.classList.add('in'); } });
    $('#doorCount').textContent=n+(n===1?' design':' designs');
    $('#doorEmpty').hidden=n>0;
  }
  $$('#doorFilters button').forEach(function(b){ b.addEventListener('click',function(){ $$('#doorFilters button').forEach(function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false')}); b.classList.add('on'); b.setAttribute('aria-pressed','true'); filt=b.getAttribute('data-f'); apply(); }) });
  var qs=$('#doorSearch'); if(qs) qs.addEventListener('input',function(){ q=qs.value.trim().toLowerCase(); apply(); });
  $$('[data-jump]').forEach(function(a){ a.addEventListener('click',function(){ var f=a.getAttribute('data-jump'); var b=$('#doorFilters [data-f="'+f+'"]'); if(b) b.click(); }) });
  grid.addEventListener('click',function(e){ var o=e.target.closest('.dopen'); if(o){ openModal(o.closest('.dcard').getAttribute('data-code')); } });
  apply();
}

/* ---------- modal viewer ---------- */
var modal=$('#doorModal'), curCode=null, lastFocus=null;
function visibleList(){ var v=grid? $$('.dcard:not([hidden])',grid).map(function(c){return c.getAttribute('data-code')}):[]; return v.length?v:DOORS.map(function(d){return d.code}); }
function openModal(code){
  if(!modal) return; var d=byCode(code); if(!d) return; curCode=code; var se=SERIES[d.s];
  lastFocus=document.activeElement;
  $('#mImg').src=d.img; $('#mImg').alt=d.code+' – '+d.name+' steel door';
  $('#mSer').textContent=se.name+' · '+se.tag; $('#mSer').style.color=se.color;
  $('#mCode').textContent=d.code; $('#mName').textContent=d.name; $('#mLine').textContent=se.line;
  $('#mSizes').innerHTML=d.custom?'<li><b>Made to measure</b><span>This series is 100% customisable. Share your opening size.</span></li>':
    d.sizes.map(function(z){return '<li><b>'+z.h+' × '+z.w+' mm</b><span>'+mm2ft(z.h)+' × '+mm2ft(z.w)+(z.note?' · variant '+z.note:'')+'</span></li>'}).join('');
  $('#mNote').hidden=!(d.sizes||[]).some(function(z){return z.note});
  $('#mPts').innerHTML=se.points.map(function(p){return '<li>'+p+'</li>'}).join('');
  var wa=$('#mWa'); wa.href=PS.waLink('Hi Ponsem Steels, I\'m interested in steel door '+d.code+' ('+d.name+', '+se.name+'). Please share price & availability.');
  var f=$('#mForm'); f.setAttribute('data-msg','I am interested in steel door '+d.code+' ('+d.name+').');
  syncAdd();
  modal.hidden=false; document.documentElement.classList.add('modal-open');
  requestAnimationFrame(function(){ modal.classList.add('show'); $('#mClose').focus(); });
}
function closeModal(){ if(!modal||modal.hidden) return; modal.classList.remove('show'); document.documentElement.classList.remove('modal-open'); setTimeout(function(){modal.hidden=true},300); if(lastFocus&&lastFocus.focus) lastFocus.focus(); }
function step(dir){ var l=visibleList(), i=l.indexOf(curCode); openModal(l[(i+dir+l.length)%l.length]); }
PS.openDoor=openModal;
if(modal){
  $('#mClose').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){ if(e.target===modal) closeModal(); });
  $('#mPrev').addEventListener('click',function(){step(-1)}); $('#mNext').addEventListener('click',function(){step(1)});
  $('#mAdd').addEventListener('click',function(){ toggle(curCode); });
  $('#mForm').addEventListener('click',function(){ closeModal(); });
  document.addEventListener('keydown',function(e){ if(modal.hidden) return; if(e.key==='Escape') closeModal(); if(e.key==='ArrowRight') step(1); if(e.key==='ArrowLeft') step(-1);
    if(e.key==='Tab'){ var f=$$('button,a[href]',modal).filter(function(x){return x.offsetParent}); if(!f.length) return; var a=f[0], z=f[f.length-1]; if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()} else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()} } });
  var stage=$('#mStage'), img=$('#mImg');
  if(!PS.reduce) stage.addEventListener('mousemove',function(e){ var r=stage.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; img.style.transform='rotateY('+(x*18)+'deg) rotateX('+(-y*10)+'deg)'; stage.style.setProperty('--sx',(x+.5)*100+'%'); stage.style.setProperty('--sy',(y+.5)*100+'%'); });
  stage.addEventListener('mouseleave',function(){ img.style.transform=''; });
}

/* ---------- shortlist ---------- */
var list=PS.store.get('shortlist',[]).filter(byCode);
var pill=$('#slPill'), drawer=$('#slDrawer');
function save(){ PS.store.set('shortlist',list); render(); }
function toggle(code){ var i=list.indexOf(code); if(i>-1) list.splice(i,1); else { list.push(code); bump(); } save(); }
function bump(){ if(!pill) return; pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump'); }
function syncAdd(){ var on=curCode&&list.indexOf(curCode)>-1, b=$('#mAdd'); if(b){ b.classList.toggle('on',!!on); b.querySelector('span').textContent=on?'Shortlisted':'Add to shortlist'; } }
function msg(){ return 'Hi Ponsem Steels, please share price & availability for these steel doors:\n'+list.map(function(c){var d=byCode(c);return '• '+c+' – '+d.name+' ('+SERIES[d.s].name+')'}).join('\n'); }
function render(){
  $$('[data-add]').forEach(function(b){ var on=list.indexOf(b.getAttribute('data-add'))>-1; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on); var s=b.querySelector('span'); if(s) s.textContent=on?'Shortlisted':'Shortlist'; });
  syncAdd();
  if(!pill) return;
  pill.hidden=!list.length; $('#slN').textContent=list.length;
  $('#slList').innerHTML=list.length? list.map(function(c){var d=byCode(c);return '<li><img src="'+d.img+'" alt=""><div><b>'+c+'</b><span>'+PS.esc(d.name)+'</span></div><button data-rm="'+c+'" aria-label="Remove '+c+'">×</button></li>'}).join('') : '<li class="empty">No doors yet. Tap ♡ on any design.</li>';
  $('#slWa').href=PS.waLink(msg()); $('#slWa').classList.toggle('disabled',!list.length);
}
document.addEventListener('click',function(e){
  var a=e.target.closest('[data-add]'); if(a){ e.preventDefault(); toggle(a.getAttribute('data-add')); return; }
  var r=e.target.closest('[data-rm]'); if(r){ toggle(r.getAttribute('data-rm')); return; }
});
if(pill){
  pill.addEventListener('click',function(){ drawer.classList.add('show'); drawer.setAttribute('aria-hidden','false'); });
  $$('[data-sl-close]').forEach(function(b){ b.addEventListener('click',function(){ drawer.classList.remove('show'); drawer.setAttribute('aria-hidden','true'); }) });
  $('#slForm').addEventListener('click',function(){ drawer.classList.remove('show'); var sel=$('#fBrand'); if(sel) sel.value='Steel Doors'; var m=$('#fMsg'); if(m) m.value=msg().replace(/^Hi Ponsem Steels, /,''); });
  $('#slClear').addEventListener('click',function(){ list=[]; save(); });
}
render();

/* ---------- size finder ---------- */
var sf=$('#sizeFinder');
if(sf){
  var unit='mm';
  function val(id){ return parseFloat($('#'+id).value)||0; }
  function toMM(v){ return unit==='mm'?v:v*304.8; }
  function run(){
    var H=toMM(val('sfH')), W=toMM(val('sfW')), out=$('#sfOut');
    if(!H||!W){ out.innerHTML='<p class="sf-hint">Enter your door opening height and width to see matching designs.</p>'; return; }
    var hits=[];
    DOORS.forEach(function(d){ if(d.custom) return; var best=null; d.sizes.forEach(function(z){ var dh=Math.abs(z.h-H), dw=Math.abs(z.w-W); if(dh<=120&&dw<=100){ var sc=dh+dw; if(!best||sc<best.sc) best={z:z,sc:sc}; } }); if(best) hits.push({d:d,z:best.z,sc:best.sc}); });
    hits.sort(function(a,b){return a.sc-b.sc});
    var head='<div class="sf-res-h"><b>'+hits.length+'</b> catalogue design'+(hits.length===1?'':'s')+' close to <b>'+Math.round(H)+' × '+Math.round(W)+' mm</b> <span>('+mm2ft(H)+' × '+mm2ft(W)+')</span></div>';
    var body=hits.length? '<div class="sf-list">'+hits.slice(0,12).map(function(h){return '<button class="sf-item" data-view="'+h.d.code+'"><img src="'+h.d.img+'" alt="" loading="lazy"><b>'+h.d.code+'</b><span>'+h.z.h+'×'+h.z.w+(h.z.note?' '+h.z.note:'')+'</span></button>'}).join('')+'</div>'
      : '<p class="sf-hint">No standard catalogue size is that close, but our <b>Iconic</b> and <b>Smart</b> series are made to your exact size.</p>';
    out.innerHTML=head+body+'<p class="sf-custom"><svg><use href="#i-ruler"/></svg> Iconic & Smart Series doors are 100% customisable. Any size can be made to order.</p>';
  }
  $$('#sfUnit button').forEach(function(b){ b.addEventListener('click',function(){ if(b.classList.contains('on')) return; var nu=b.getAttribute('data-u'); ['sfH','sfW'].forEach(function(id){ var el=$('#'+id), v=parseFloat(el.value); if(v){ el.value = nu==='ft' ? (v/304.8).toFixed(2) : Math.round(v*304.8); } el.step = nu==='ft'?'0.05':'10'; });
    unit=nu; $$('#sfUnit button').forEach(function(x){x.classList.toggle('on',x===b); x.setAttribute('aria-pressed',x===b)}); run(); }) });
  $$('[data-preset]').forEach(function(b){ b.addEventListener('click',function(){ var p=b.getAttribute('data-preset').split('x'); if(unit==='ft'){ $('#sfH').value=(p[0]/304.8).toFixed(2); $('#sfW').value=(p[1]/304.8).toFixed(2);} else { $('#sfH').value=p[0]; $('#sfW').value=p[1]; } run(); }) });
  ['sfH','sfW'].forEach(function(id){ $('#'+id).addEventListener('input',run) });
  sf.addEventListener('click',function(e){ var v=e.target.closest('[data-view]'); if(v) openModal(v.getAttribute('data-view')); });
  run();
}

/* ---------- featured strip (home) ---------- */
var strip=$('#doorStrip');
if(strip){
  var pick=['CA-01','CA-05','AL-01','HT-01','CP-01','SM-801','CA-07','AL-03','CP-02','SM-803'];
  var href=strip.getAttribute('data-href')||'steel-doors/';
  strip.innerHTML=pick.map(function(c){ var d=byCode(c); return '<a class="sd" href="'+href+'#d-'+c+'" style="--sc:'+SERIES[d.s].color+'"><span class="sd-img"><img src="'+d.img+'" alt="'+c+' '+PS.esc(d.name)+'" loading="lazy"></span><b>'+c+'</b><span>'+PS.esc(d.name)+'</span><span style="color:'+SERIES[d.s].color+';font-weight:700;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase">'+SERIES[d.s].name+'</span></a>'; }).join('');
}
/* deep link #d-CODE */
if(modal && /^#d-/.test(location.hash)){ var c=decodeURIComponent(location.hash.slice(3)); setTimeout(function(){ openModal(c) },700); }

/* ---------- showroom ---------- */
var sc=$('#showroom3d');
if(sc && PS.initShowroom){
  var pick2=['CA-01','HT-01','AL-01','CP-01','CA-05','SM-801','HT-05','AL-03','CA-07','CP-02','SM-826','CA-06'];
  var list2=pick2.map(byCode);
  var api=PS.initShowroom(sc,list2,{
    onChange:function(d){ var se=SERIES[d.s]; $('#srCode').textContent=d.code; $('#srName').textContent=d.name; $('#srSer').textContent=se.name+' · '+se.tag; $('#srSer').style.color=se.color; },
    onPick:function(code){ openModal(code); }
  });
  if(api){ $('#srPrev').addEventListener('click',api.prev); $('#srNext').addEventListener('click',api.next); $('#srView').addEventListener('click',function(){ openModal($('#srCode').textContent); }); }
  else { document.documentElement.classList.add('no-webgl'); }
}
})();
/* ---------- anatomy + smart lock demo ---------- */
(function(){
var PS=window.PS,$=PS.$,$$=PS.$$;
var ex=$('#exploded');
if(ex){
  var btn=$('#exBtn'), auto=true;
  function set(o){ ex.classList.toggle('open',o); btn.textContent=o?'Assemble door':'Explode view'; }
  var io=new IntersectionObserver(function(es){ if(es[0].isIntersecting&&auto){ setTimeout(function(){set(true)},500); auto=false; } },{threshold:.4}); io.observe(ex);
  btn.addEventListener('click',function(){ auto=false; set(!ex.classList.contains('open')); });
  $$('.anat-item').forEach(function(it){ var l=it.getAttribute('data-l');
    it.addEventListener('mouseenter',function(){ set(true); var L=$('.ex-layer[data-i="'+l+'"]'); if(L) L.classList.add('hl'); it.classList.add('on'); });
    it.addEventListener('mouseleave',function(){ $$('.ex-layer').forEach(function(x){x.classList.remove('hl')}); it.classList.remove('on'); });
  });
  if(!PS.reduce && matchMedia('(hover:hover)').matches){ var rig=$('#exRig'); ex.addEventListener('mousemove',function(e){ var r=ex.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5; rig.style.transform='rotateY('+(-38+x*30)+'deg) rotateX(8deg)'; }); ex.addEventListener('mouseleave',function(){ rig.style.transform=''; }); }
}
var dev=$('#lockDev');
if(dev){
  var scr=$('#lkScr'), led=$('#lkLed'), keys=$$('#lkPad span'), fp=$('#lkFp'), timer=[], seen=false;
  function clear(){ timer.forEach(clearTimeout); timer=[]; keys.forEach(function(k){k.classList.remove('hit')}); fp.classList.remove('scan'); led.classList.remove('ok'); }
  function at(ms,f){ timer.push(setTimeout(f,ms)); }
  function unlock(t){ at(t,function(){ scr.textContent='UNLOCKED ✓'; led.classList.add('ok'); }); at(t+1800,function(){ scr.textContent='LOCKED'; led.classList.remove('ok'); }); }
  var demos={
    pin:function(){ scr.textContent=''; ['4','7','1','9'].forEach(function(d,i){ at(350+i*380,function(){ var k=keys.find(function(x){return x.textContent===d}); k.classList.add('hit'); setTimeout(function(){k.classList.remove('hit')},260); scr.textContent+='•'; }); }); unlock(2000); },
    finger:function(){ scr.textContent='SCANNING'; at(200,function(){ fp.classList.add('scan'); }); at(1200,function(){ fp.classList.remove('scan'); }); unlock(1250); },
    card:function(){ scr.textContent='TAP CARD'; at(700,function(){ scr.textContent='CARD ✓'; }); unlock(1200); },
    key:function(){ scr.textContent='KEY'; at(900,function(){ scr.textContent='TURN ⟳'; }); unlock(1500); }
  };
  function run(m){ clear(); demos[m](); $$('.method').forEach(function(b){ b.classList.toggle('on',b.getAttribute('data-m')===m); }); }
  $$('.method').forEach(function(b){ b.addEventListener('click',function(){ run(b.getAttribute('data-m')); }) });
  new IntersectionObserver(function(es){ if(es[0].isIntersecting&&!seen){ seen=true; run('pin'); } },{threshold:.5}).observe(dev);
}
})();
