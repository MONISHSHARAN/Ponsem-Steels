/* Ponsem Steels – TMT page */
(function(){
'use strict';
var PS=window.PS,$=PS.$,$$=PS.$$,waLink=PS.waLink;
/* Rebar SVG art for brand cards */
function rebarSVG(color, cls, id){
  var ribs='';
  for(var x=12;x<590;x+=19){ ribs+='<path d="M'+(x-4)+' 9 Q'+(x+6)+' 21 '+(x+9)+' 35" stroke="url(#rg'+id+')" stroke-width="3.6" fill="none" stroke-linecap="round"/>'; }
  return '<svg class="'+cls+'" viewBox="0 0 600 44" preserveAspectRatio="none"><defs>'+
    '<linearGradient id="bg'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".22" stop-color="'+color+'"/><stop offset=".55" stop-color="#4a5059"/><stop offset=".8" stop-color="#2a2e34"/><stop offset="1" stop-color="#6b7179"/></linearGradient>'+
    '<linearGradient id="rg'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fafbfc"/><stop offset=".45" stop-color="#8b9199"/><stop offset="1" stop-color="#25282d"/></linearGradient>'+
    '<linearGradient id="sh'+id+'" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'+
    '<rect x="2" y="9" width="596" height="26" rx="13" fill="url(#bg'+id+')"/>'+
    '<rect x="2" y="20" width="596" height="2.6" fill="#1d2025" opacity=".55"/>'+ribs+
    '<rect x="-120" y="7" width="120" height="30" fill="url(#sh'+id+')"><animate attributeName="x" from="-160" to="660" dur="3.6s" repeatCount="indefinite"/></rect></svg>';
}
$$('.bar-art').forEach(function(el,i){
  var c=el.getAttribute('data-bar');
  el.innerHTML = rebarSVG(c,'b2',i+'b') + rebarSVG(c,'b1',i+'a');
});

/* Advisor */
var REC={
  home:{brand:'NADI 550D',why:'For independent houses and villas, NADI 550D gives you higher strength than standard Fe 500 with the ductility your structure needs, at excellent value.',pts:['High strength with "D" grade ductility','Strong bond with concrete for slabs, beams and columns','Great value for G+1 to G+3 construction'],alt:'Near the sea or a high water table? Consider MS LIFE 600+ CRS.'},
  multi:{brand:'NADI 550D or MS LIFE 600+',why:'Multi-storey and commercial structures carry heavier loads. A higher grade lets engineers design efficient sections. We\'ll match the exact grade on your drawings.',pts:['550D for ductility-critical frames','600-grade where higher strength is specified','Bulk supply planned around your casting cycle'],alt:'Your structural engineer\'s specification always decides the final grade.'},
  coast:{brand:'MS LIFE 600+ CRS',why:'Salt air, humidity and standing water speed up corrosion of ordinary steel. MS LIFE 600+ CRS is made to resist rust, protecting the structure from the inside.',pts:['Corrosion-resistant (CRS) chemistry','600-grade strength','Ideal for sumps, tanks, basements and coastal homes'],alt:'Pair with good concrete cover and quality concrete for best life.'},
  infra:{brand:'VIZAG TMT',why:'For infrastructure and industrial work, VIZAG rebars from RINL\'s Visakhapatnam Steel Plant are a dependable public-sector choice with consistent quality.',pts:['Integrated-plant steel from virgin iron ore','Trusted on large and government projects','Check for the embossed "VIZAG" marking'],alt:'Coastal infrastructure? Ask us about CRS options too.'}
};
var recBody=$('#recBody'), recWa=$('#recWa');
function showRec(k, instant){
  var r=REC[k];
  var html='<span class="lbl">Our recommendation</span><h3>'+r.brand+'</h3><p class="why">'+r.why+'</p><ul>'+r.pts.map(function(p){return '<li>'+p+'</li>'}).join('')+'</ul><p style="font-size:14px;color:#9aa0aa;margin:-12px 0 26px;position:relative">'+r.alt+'</p>';
  recWa.href=waLink('Hi Ponsem Steels, I need '+r.brand+' TMT bars for my project. Please share the price.');
  if(instant){recBody.innerHTML=html;return}
  recBody.classList.add('out'); setTimeout(function(){recBody.innerHTML=html; recBody.classList.remove('out')}, 250);
}
$$('.opt').forEach(function(o){ o.addEventListener('click', function(){ $$('.opt').forEach(function(x){x.classList.remove('on')}); o.classList.add('on'); showRec(o.getAttribute('data-k')); }) });
showRec('home', true);

/* Calculator */
var dia=12;
function fmt(n,d){return n.toLocaleString('en-IN',{maximumFractionDigits:d,minimumFractionDigits:d})}
function calc(){
  var L=Math.max(0, parseFloat($('#cLen').value)||0), N=Math.max(0, parseInt($('#cNum').value,10)||0);
  var pm=dia*dia/162, pb=pm*L, tot=pb*N;
  $('#cKg').textContent=fmt(tot,1); $('#cT').textContent=fmt(tot/1000,3)+' tonnes ('+N+' bars × '+L+' m of '+dia+' mm)';
  $('#cPm').textContent=fmt(pm,3); $('#cPb').textContent=fmt(pb,2);
  $('#cWa').href=waLink('Hi Ponsem Steels, I need '+N+' bars of '+dia+' mm TMT ('+L+' m each), about '+fmt(tot/1000,2)+' tonnes. Please share the price.');
}
$$('#dia button').forEach(function(b){ b.addEventListener('click', function(){ $$('#dia button').forEach(function(x){x.classList.remove('on')}); b.classList.add('on'); dia=+b.getAttribute('data-d'); calc(); }) });
$('#cLen').addEventListener('input', calc); $('#cNum').addEventListener('input', calc); calc();


PS.bindWa(document);
if(PS.initRebarHero) PS.initRebarHero($('#hero3d'));
if(PS.initTech) PS.initTech($('#tech3d'));
})();
