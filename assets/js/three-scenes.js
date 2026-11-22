/* Ponsem Steels – Three.js scenes (r128) */
(function(){
'use strict';
var PS = window.PS = window.PS || {};
if(!window.THREE) return;
var webgl=(function(){try{var c=document.createElement('canvas');return !!(c.getContext('webgl')||c.getContext('experimental-webgl'))}catch(e){return false}})();
if(!webgl){ document.documentElement.classList.add('no-webgl'); return; }
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var T = THREE;

/* ---------- shared helpers ---------- */
function makeRenderer(canvas, opts){
  var r=new T.WebGLRenderer(Object.assign({canvas:canvas, antialias:true, alpha:true, powerPreference:'high-performance'}, opts||{}));
  r.setPixelRatio(Math.min(window.devicePixelRatio||1, 1.75));
  r.outputEncoding=T.sRGBEncoding; r.toneMapping=T.ACESFilmicToneMapping; r.toneMappingExposure=1.05;
  return r;
}
function makeEnv(renderer, warm){
  var pm=new T.PMREMGenerator(renderer), es=new T.Scene();
  var sg=new T.SphereGeometry(20,48,24), pos=sg.attributes.position, cols=[];
  var top=warm?new T.Color(1.7,1.2,0.6):new T.Color(1.6,1.25,0.7), mid=new T.Color(0.32,0.34,0.38), bot=new T.Color(0.02,0.02,0.025), c=new T.Color();
  for(var i=0;i<pos.count;i++){ var y=pos.getY(i)/20; if(y>0) c.copy(mid).lerp(top,Math.pow(y,1.4)); else c.copy(mid).lerp(bot,Math.min(1,-y*1.6)); cols.push(c.r,c.g,c.b); }
  sg.setAttribute('color', new T.Float32BufferAttribute(cols,3));
  es.add(new T.Mesh(sg, new T.MeshBasicMaterial({side:T.BackSide, vertexColors:true})));
  function panel(col,k,x,y,z,w,h){ var m=new T.Mesh(new T.PlaneGeometry(w,h), new T.MeshBasicMaterial({color:new T.Color(col).multiplyScalar(k), side:T.DoubleSide})); m.position.set(x,y,z); m.lookAt(0,0,0); es.add(m); }
  panel('#ffffff',5,0,9,8,14,3); panel('#ffd27a',4,-12,3,-4,6,10); panel('#9ec4ff',2,12,-2,6,5,8); panel('#ffffff',3,6,6,-12,10,2);
  var tex=pm.fromScene(es,0.035).texture; pm.dispose(); return tex;
}
function steelMat(color, rough){ return new T.MeshStandardMaterial({color:color||0x8d939b, metalness:1, roughness:rough||0.34, envMapIntensity:1.15}); }
function glowTex(stops){
  var c=document.createElement('canvas'); c.width=c.height=128; var x=c.getContext('2d'); var g=x.createRadialGradient(64,64,0,64,64,64);
  (stops||[[0,'rgba(255,240,200,1)'],[.25,'rgba(255,200,90,.85)'],[1,'rgba(255,170,40,0)']]).forEach(function(s){g.addColorStop(s[0],s[1])});
  x.fillStyle=g; x.fillRect(0,0,128,128); return new T.CanvasTexture(c);
}
function makeRebar(len, r, mat, capMat){
  var g=new T.Group();
  g.add(new T.Mesh(new T.CylinderGeometry(r,r,len,40,1), capMat?[mat,capMat,mat]:mat));
  var lrg=new T.CylinderGeometry(r*0.09,r*0.09,len*0.995,8,1);
  [0,Math.PI].forEach(function(a){ var m=new T.Mesh(lrg,mat); m.position.set(Math.cos(a)*r*0.97,0,Math.sin(a)*r*0.97); g.add(m); });
  var pitch=r*0.78, n=Math.floor((len-r*0.6)/pitch);
  var inst=new T.InstancedMesh(new T.TorusGeometry(r*0.99, r*0.09, 6, 20, Math.PI*0.8), mat, n*2);
  var m4=new T.Matrix4(), ry=new T.Matrix4(), tr=new T.Matrix4(), k=0, tilt=0.38;
  for(var i=0;i<n;i++) for(var s=0;s<2;s++){
    m4.makeRotationX(Math.PI/2+(s?-tilt:tilt)); ry.makeRotationY(s*Math.PI-Math.PI*0.1); tr.makeTranslation(0,-len/2+r*0.3+pitch*(i+0.5)+(s?pitch*0.5:0),0);
    m4.premultiply(ry).premultiply(tr); inst.setMatrixAt(k++, m4);
  }
  inst.count=k; g.add(inst); return g;
}
var loader=new T.TextureLoader();
function loadTex(url, renderer){
  var t=loader.load(url); t.encoding=T.sRGBEncoding; t.anisotropy=Math.min(8, renderer.capabilities.getMaxAnisotropy()); return t;
}
/* door slab: box with photo on the front face; uv = [u0,u1,v0,v1] crop */
function makeSlab(tex, w, h, d, uv, edgeColor){
  var geo=new T.BoxGeometry(w,h,d);
  if(uv){ var a=geo.attributes.uv; // +z face = vertices 16..19 : (0,1)(1,1)(0,0)(1,0)
    a.setXY(16,uv[0],uv[3]); a.setXY(17,uv[1],uv[3]); a.setXY(18,uv[0],uv[2]); a.setXY(19,uv[1],uv[2]);
    a.setXY(20,uv[1],uv[3]); a.setXY(21,uv[0],uv[3]); a.setXY(22,uv[1],uv[2]); a.setXY(23,uv[0],uv[2]); a.needsUpdate=true; }
  var edge=new T.MeshStandardMaterial({color:edgeColor||0x6b5a45, metalness:.85, roughness:.38});
  var front=new T.MeshStandardMaterial({map:tex, color:0xd8d2ca, metalness:.2, roughness:.5, envMapIntensity:.45, transparent:true, alphaTest:.3});
  var back=new T.MeshStandardMaterial({map:tex, color:0x5a5550, metalness:.4, roughness:.5, transparent:true, alphaTest:.3});
  return new T.Mesh(geo,[edge,edge,edge,edge,front,back]);
}
function onVisible(el, cb){ var v=true; if('IntersectionObserver' in window){ new IntersectionObserver(function(es){ v=es[0].isIntersecting; cb(v); }).observe(el); } return function(){return v}; }
function fit(renderer, cam, host, after){
  function size(){ var el=renderer.domElement, w=el.clientWidth||host.clientWidth, h=el.clientHeight||host.clientHeight; if(!w||!h) return; renderer.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix(); if(after) after(w,h); }
  size(); addEventListener('resize', size); return size;
}
function sparks(scene, N, box, size, color){
  var geo=new T.BufferGeometry(), P=new Float32Array(N*3), V=new Float32Array(N);
  for(var i=0;i<N;i++){ P[i*3]=(Math.random()-.5)*box[0]; P[i*3+1]=(Math.random()-.5)*box[1]; P[i*3+2]=(Math.random()-.5)*box[2]+(box[3]||0); V[i]=0.3+Math.random()*1.2; }
  geo.setAttribute('position', new T.BufferAttribute(P,3));
  var pts=new T.Points(geo, new T.PointsMaterial({size:size, map:glowTex(), transparent:true, depthWrite:false, blending:T.AdditiveBlending, color:color||0xffc768}));
  scene.add(pts);
  return function(dt,t){ var p=geo.attributes.position.array; for(var i=0;i<N;i++){ p[i*3+1]+=V[i]*dt; p[i*3]+=Math.sin(t+i)*0.003; if(p[i*3+1]>box[1]/2){p[i*3+1]=-box[1]/2;} } geo.attributes.position.needsUpdate=true; };
}

/* ============ HOME HERO: grand door opening onto steel ============ */
PS.initDoorHero = function(canvas, opts){
  if(!canvas) return; opts=opts||{};
  var host=canvas.parentElement, renderer=makeRenderer(canvas);
  var scene=new T.Scene(); scene.environment=makeEnv(renderer,true); scene.fog=new T.Fog(0x0b0c0e,12,26);
  var cam=new T.PerspectiveCamera(30,1,0.1,200); cam.position.set(0,0.2,13);
  scene.add(new T.AmbientLight(0x3a3f48,0.55));
  renderer.toneMappingExposure=.92; var key=new T.DirectionalLight(0xffe2b0,0.8); key.position.set(-4,6,9); scene.add(key);
  var rim=new T.DirectionalLight(0xe2b54a,0.9); rim.position.set(6,3,-4); scene.add(rim);

  var rig=new T.Group(); scene.add(rig);
  var W=2.6, H=W/ (568/900) * ((0.931-0.067)/(0.93-0.074)) ; // keep leaf aspect of photo
  H=Math.min(H,4.3);
  var tex=loadTex(opts.texture, renderer);
  var uL=[0.074,0.5,0.067,0.931], uR=[0.5,0.93,0.067,0.931];
  var leafW=W/2, d=0.09;
  var pivL=new T.Group(), pivR=new T.Group();
  pivL.position.set(-W/2,0,0); pivR.position.set(W/2,0,0);
  var lL=makeSlab(tex,leafW,H,d,uL,0x8a6a3c); lL.position.x=leafW/2; pivL.add(lL);
  var lR=makeSlab(tex,leafW,H,d,uR,0x8a6a3c); lR.position.x=-leafW/2; pivR.add(lR);
  rig.add(pivL,pivR);
  // frame
  var fm=new T.MeshStandardMaterial({color:0xa87a22,metalness:1,roughness:.22,envMapIntensity:1.3}), fw=0.16, fd=0.34;
  var top=new T.Mesh(new T.BoxGeometry(W+fw*2,fw,fd),fm); top.position.set(0,H/2+fw/2,-0.06);
  var lf=new T.Mesh(new T.BoxGeometry(fw,H+fw*2,fd),fm); lf.position.set(-W/2-fw/2,0,-0.06);
  var rf=lf.clone(); rf.position.x=W/2+fw/2;
  var sill=new T.Mesh(new T.BoxGeometry(W+fw*2+0.3,0.08,0.7),fm); sill.position.set(0,-H/2-0.04,0.15);
  rig.add(top,lf,rf,sill);
  // portal glow behind
  var portalC=document.createElement('canvas'); portalC.width=256; portalC.height=512; var px=portalC.getContext('2d');
  var g=px.createRadialGradient(128,300,10,128,300,330); g.addColorStop(0,'#fff8e6'); g.addColorStop(.35,'#ffd98a'); g.addColorStop(.75,'#c4870f'); g.addColorStop(1,'#3a2604');
  px.fillStyle=g; px.fillRect(0,0,256,512);
  var portalMat=new T.MeshBasicMaterial({map:new T.CanvasTexture(portalC), color:0x000000});
  var portal=new T.Mesh(new T.PlaneGeometry(W,H), portalMat); portal.position.z=-1.6; rig.add(portal);
  // tunnel sides to hide outside
  var tun=new T.MeshStandardMaterial({color:0x1a1611, metalness:.6, roughness:.6, side:T.DoubleSide});
  [[-W/2,0,Math.PI/2],[W/2,0,-Math.PI/2]].forEach(function(p){ var m=new T.Mesh(new T.PlaneGeometry(1.6,H),tun); m.position.set(p[0],0,-0.8); m.rotation.y=p[2]; rig.add(m); });
  var tt=new T.Mesh(new T.PlaneGeometry(W,1.6),tun); tt.rotation.x=Math.PI/2; tt.position.set(0,H/2,-0.8); rig.add(tt);
  var tb=tt.clone(); tb.position.y=-H/2; rig.add(tb);
  // rebars inside, silhouetted
  var rebars=new T.Group(), rmat=steelMat(0x9aa0a8,0.3);
  [-0.75,-0.25,0.25,0.75].forEach(function(x,i){ var b=makeRebar(H*1.05,0.11,rmat); b.position.set(x,0,-0.9-(i%2)*0.25); b.rotation.y=i; b.rotation.z=(i-1.5)*0.03; rebars.add(b); });
  rig.add(rebars);
  // light spill on floor + beam
  var spill=new T.Mesh(new T.PlaneGeometry(W*2.6,6), new T.MeshBasicMaterial({map:glowTex([[0,'rgba(255,225,160,.9)'],[.5,'rgba(255,190,80,.35)'],[1,'rgba(255,170,40,0)']]), transparent:true, depthWrite:false, blending:T.AdditiveBlending, opacity:0}));
  spill.rotation.x=-Math.PI/2; spill.position.set(0,-H/2-0.01,2.4); rig.add(spill);
  var beam=new T.Mesh(new T.PlaneGeometry(W*1.6,H*1.4), new T.MeshBasicMaterial({map:glowTex([[0,'rgba(255,230,170,.55)'],[.6,'rgba(255,200,100,.12)'],[1,'rgba(255,180,60,0)']]), transparent:true, depthWrite:false, blending:T.AdditiveBlending, opacity:0}));
  beam.position.set(0,0,0.6); rig.add(beam);
  var inner=new T.PointLight(0xffc870,0,9,2); inner.position.set(0,0.4,-0.6); rig.add(inner);
  var floor=new T.Mesh(new T.PlaneGeometry(40,20), new T.MeshStandardMaterial({color:0x07080a, metalness:.25, roughness:.55, envMapIntensity:.15}));
  floor.rotation.x=-Math.PI/2; floor.position.y=-H/2-0.08; rig.add(floor);
  var dust=sparks(rig, 160, [W*1.2,H*1.1,2.2,0.4], 0.05, 0xffd890);

  var mobile=false;
  fit(renderer, cam, host, function(w){ mobile=innerWidth<760; rig.position.set(mobile?0:(w<1100?2.1:3.3), mobile?-0.05:-0.15, 0); rig.scale.setScalar(1); cam.fov=mobile?33:30; cam.updateProjectionMatrix(); });
  var tapOpen=false; canvas.addEventListener('click',function(){ tapOpen=!tapOpen; if(navigator.vibrate) try{navigator.vibrate(12)}catch(e){} var h=document.getElementById('tapHint'); if(h) h.classList.add('gone'); });
  var mx=0,my=0,tx=0,ty=0;
  addEventListener('pointermove', function(e){ tx=(e.clientX/innerWidth-.5); ty=(e.clientY/innerHeight-.5); }, {passive:true});
  var visible=onVisible(host,function(){});
  var clock=new T.Clock(), intro=0, open=0;
  function frame(){
    var dt=Math.min(clock.getDelta(),0.05), t=clock.elapsedTime;
    if(visible()){
      intro=Math.min(1,intro+dt*0.45);
      var pin=host.parentElement, pinned=pin&&pin.classList.contains('hero-pin')&&getComputedStyle(host).position==='sticky';
      var cr=canvas.getBoundingClientRect();
      var sp=pinned? Math.min(1,Math.max(0,-pin.getBoundingClientRect().top/Math.max(1,pin.offsetHeight-innerHeight))) : (mobile? Math.min(1,Math.max(0,(innerHeight*0.92-cr.top)/(cr.height*1.25)-0.15)) : Math.min(1, Math.max(0, window.scrollY/(host.clientHeight*0.75))));
      if(pinned) pin.style.setProperty('--sp',sp.toFixed(3));
      var teaser=0.16*(1-Math.pow(1-Math.max(0,(intro-0.25)/0.75),3)) + Math.sin(t*1.1)*0.012*intro;
      var target=reduce?0.55:Math.max(teaser, sp*1.05, tapOpen?1.02:0);
      open+=(target-open)*Math.min(1,dt*4);
      var a=Math.min(1,open)*1.45;
      pivL.rotation.y=-a; pivR.rotation.y=a;
      var lum=Math.min(1,open*1.6+0.08);
      portalMat.color.setScalar(lum); inner.intensity=lum*2.2;
      spill.material.opacity=Math.min(1,open*1.3); beam.material.opacity=Math.min(.9,open*1.1);
      rebars.rotation.y=Math.sin(t*0.3)*0.15;
      mx+=(tx-mx)*0.05; my+=(ty-my)*0.05;
      rig.rotation.y=(mobile?-0.12+Math.sin(t*0.4)*0.08:-0.32+mx*0.18); rig.rotation.x=my*0.06;
      var k=pinned?Math.pow(Math.max(0,sp-0.3)/0.7,1.4):0; cam.position.z=(mobile?14.6:13)-(pinned?k*6.4:sp*(mobile?3.2:2.2)); cam.position.x=rig.position.x*k*0.92; cam.position.y=0.2-my*0.4*(1-k); cam.lookAt(rig.position.x*(0.35+0.65*k),0,0); rig.rotation.y*= (1-k*0.85);
      dust(dt*0.25,t);
      renderer.render(scene,cam);
    }
    if(!reduce) requestAnimationFrame(frame);
  }
  if(reduce){ setTimeout(frame,300); } else frame();
};

/* ============ TMT HERO: rebar bundle ============ */
PS.initRebarHero = function(canvas){
  if(!canvas) return; var host=canvas.parentElement, renderer=makeRenderer(canvas);
  var scene=new T.Scene(); scene.environment=makeEnv(renderer);
  var cam=new T.PerspectiveCamera(32,1,0.1,200); cam.position.set(0,0,24);
  var key=new T.DirectionalLight(0xffe2a8,1.4); key.position.set(6,10,8); scene.add(key);
  var rim=new T.DirectionalLight(0xe2b54a,1.6); rim.position.set(-8,-2,-6); scene.add(rim);
  scene.add(new T.AmbientLight(0x404650,0.4));
  var rig=new T.Group(); scene.add(rig); var bundle=new T.Group(); rig.add(bundle);
  var mat=steelMat(0x8f959d,0.32), matGold=steelMat(0xc9a24a,0.3);
  [[0,0],[1.02,0],[-1.02,0],[0.51,0.88],[-0.51,0.88],[0.51,-0.88],[-0.51,-0.88],[1.53,0.88],[-1.53,-0.88],[1.53,-0.88]].forEach(function(p,i){
    var b=makeRebar(20+(i%3)*1.2, 0.46, i===0?matGold:mat); b.position.set(p[0],(i%4-1.5)*0.7,p[1]); b.rotation.y=i*0.7; bundle.add(b); });
  var wireMat=new T.MeshStandardMaterial({color:0x2b2f35, metalness:.8, roughness:.5});
  [-5,0,5].forEach(function(y){ var w=new T.Mesh(new T.TorusGeometry(2.25,0.06,8,48), wireMat); w.rotation.x=Math.PI/2; w.position.y=y; w.scale.set(1,0.62,1); bundle.add(w); });
  rig.rotation.set(0.25,0,-0.95);
  var floaters=[];
  [[-28,-11,-22,0.35,0.6],[14,-8,-14,0.4,-0.4],[20,1,-26,0.3,1.1],[-24,-2,-36,0.45,0.2]].forEach(function(f,i){ var b=makeRebar(9+i*2,f[3],mat); b.position.set(f[0],f[1],f[2]); b.rotation.set(f[4],0.3,f[4]*1.4); scene.add(b); floaters.push({o:b,y:f[1],s:0.4+i*0.15}); });
  var sp=sparks(scene,380,[44,28,20,-4],0.22);
  var mobile=false;
  fit(renderer,cam,host,function(w){ mobile=w<760; rig.position.set(mobile?0:(w<1100?4:7.6), mobile?-1.5:0.2, mobile?-9:0); });
  var mx=0,my=0,tx=0,ty=0; addEventListener('pointermove',function(e){tx=(e.clientX/innerWidth-.5);ty=(e.clientY/innerHeight-.5)},{passive:true});
  var visible=onVisible(host,function(){}), clock=new T.Clock(), intro=0;
  function frame(){ var dt=Math.min(clock.getDelta(),0.05), t=clock.elapsedTime;
    if(visible()){ intro=Math.min(1,intro+dt*0.55); var ei=1-Math.pow(1-intro,3); mx+=(tx-mx)*0.05; my+=(ty-my)*0.05;
      bundle.rotation.y+=dt*0.22; rig.rotation.z=-0.95+(1-ei)*0.6+mx*0.15; rig.rotation.x=0.25+my*0.2+Math.sin(t*0.5)*0.04; rig.scale.setScalar(0.7+0.3*ei);
      floaters.forEach(function(f,i){ f.o.position.y=f.y+Math.sin(t*f.s+i)*0.8; f.o.rotation.y+=dt*0.15*(i%2?1:-1); });
      sp(dt,t); cam.position.x=mx*1.6; cam.position.y=-my*1.2; cam.lookAt(0,0,0); renderer.render(scene,cam); }
    if(!reduce) requestAnimationFrame(frame); }
  frame();
};

/* ============ TMT cross-section ============ */
PS.initTech = function(canvas){
  if(!canvas) return; var host=canvas.parentElement, renderer=makeRenderer(canvas);
  var scene=new T.Scene(); scene.environment=makeEnv(renderer);
  var cam=new T.PerspectiveCamera(30,1,0.1,100); cam.position.set(0,0,17);
  var l=new T.DirectionalLight(0xffffff,1.2); l.position.set(4,6,8); scene.add(l); scene.add(new T.AmbientLight(0xffffff,0.25));
  var S=512, c=document.createElement('canvas'); c.width=c.height=S; var x=c.getContext('2d');
  var g=x.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);
  g.addColorStop(0,'#d9dce0'); g.addColorStop(.52,'#c4c8cd'); g.addColorStop(.6,'#8b929b'); g.addColorStop(.7,'#5d646e'); g.addColorStop(.74,'#3a414b'); g.addColorStop(.97,'#2f353e'); g.addColorStop(1,'#1d2127');
  x.fillStyle=g; x.fillRect(0,0,S,S); var img=x.getImageData(0,0,S,S), d=img.data; for(var i=0;i<d.length;i+=4){var n=(Math.random()-.5)*22;d[i]+=n;d[i+1]+=n;d[i+2]+=n} x.putImageData(img,0,0);
  x.strokeStyle='rgba(226,181,74,.9)'; x.lineWidth=3; x.setLineDash([10,8]); x.beginPath(); x.arc(S/2,S/2,S*0.36,0,Math.PI*2); x.stroke();
  var tex=new T.CanvasTexture(c); tex.encoding=T.sRGBEncoding;
  var bar=makeRebar(7.5,1.75,steelMat(0xa4aab2,0.28),new T.MeshStandardMaterial({map:tex,metalness:.35,roughness:.45}));
  var grp=new T.Group(); grp.add(bar); scene.add(grp); grp.rotation.set(0.95,0,-0.35);
  var glow=new T.Mesh(new T.RingGeometry(1.86,1.93,72), new T.MeshBasicMaterial({color:0xe2b54a,transparent:true,opacity:.6,side:T.DoubleSide})); glow.position.y=3.77; glow.rotation.x=-Math.PI/2; bar.add(glow);
  fit(renderer,cam,host);
  var visible=onVisible(host,function(){}), drag=false, lx=0, vel=0.35, rotY=0;
  host.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX}); host.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lx;lx=e.clientX;rotY+=dx*0.01;vel=dx*0.6}); addEventListener('pointerup',function(){drag=false}); host.style.cursor='grab';
  var clock=new T.Clock();
  function frame(){ var dt=Math.min(clock.getDelta(),0.05), t=clock.elapsedTime;
    if(visible()||reduce){ if(!drag){vel+=(0.35-vel)*0.03; rotY+=vel*dt;} bar.rotation.y=rotY; grp.position.y=Math.sin(t*0.8)*0.18; glow.material.opacity=0.35+Math.sin(t*2)*0.25; renderer.render(scene,cam); }
    if(!reduce) requestAnimationFrame(frame); }
  frame();
};

/* ============ DOORS: 3D showroom carousel ============ */
PS.initShowroom = function(canvas, doors, opts){
  if(!canvas||!doors||!doors.length) return null; opts=opts||{};
  var host=canvas.parentElement, renderer=makeRenderer(canvas);
  var scene=new T.Scene(); scene.environment=makeEnv(renderer,true);
  scene.fog=new T.Fog(0x0d0e11, 7, 15);
  var cam=new T.PerspectiveCamera(34,1,0.1,100);
  scene.add(new T.AmbientLight(0x50555e,0.6));
  var key=new T.DirectionalLight(0xfff0d6,0.9); key.position.set(0,6,10); scene.add(key);
  renderer.toneMappingExposure=.88; var spot=new T.SpotLight(0xffd690,1.3,20,0.42,0.6,1.4); scene.add(spot); scene.add(spot.target);
  var N=doors.length, R=Math.max(3.6, N*0.42), step=Math.PI*2/N, H=2.25;
  var ring=new T.Group(); scene.add(ring);
  var items=[];
  doors.forEach(function(dr,i){
    var tex=loadTex(dr.img, renderer), w=H*(dr.ratio||0.6);
    var slab=makeSlab(tex,w,H,0.08,null,0x4a4038);
    var holder=new T.Group(); var ang=i*step;
    holder.position.set(Math.sin(ang)*R,0,Math.cos(ang)*R); holder.rotation.y=ang;
    slab.position.y=H/2; holder.add(slab);
    // reflection
    var refl=slab.clone(); refl.material=slab.material.map(function(m){ var c=m.clone(); c.transparent=true; c.opacity=0.16; c.depthWrite=false; return c; });
    refl.scale.y=-1; refl.position.y=-H/2-0.02; holder.add(refl);
    // plinth
    var pl=new T.Mesh(new T.BoxGeometry(w+0.3,0.06,0.5), steelMat(0x2c2a27,0.45)); pl.position.y=-0.03; holder.add(pl);
    slab.userData.index=i; ring.add(holder); items.push({holder:holder, slab:slab, data:dr});
  });
  var floor=new T.Mesh(new T.CircleGeometry(R+30,64), new T.MeshStandardMaterial({color:0x050607, metalness:.75, roughness:.32, envMapIntensity:.25}));
  floor.rotation.x=-Math.PI/2; floor.position.y=-0.065; scene.add(floor);
  var halo=new T.Mesh(new T.PlaneGeometry(4,4), new T.MeshBasicMaterial({map:glowTex([[0,'rgba(255,215,140,.6)'],[.5,'rgba(255,190,80,.18)'],[1,'rgba(255,170,40,0)']]), transparent:true, depthWrite:false, blending:T.AdditiveBlending}));
  halo.rotation.x=-Math.PI/2; halo.position.set(0,-0.05,R+0.4); scene.add(halo);
  var dust=sparks(scene, 140, [10,6,6,R], 0.045, 0xffe0a0);

  var mobile=false;
  fit(renderer,cam,host,function(w){ mobile=w<760; cam.fov=mobile?42:34; cam.updateProjectionMatrix(); });
  var rot=0, target=0, vel=0, current=-1, drag=false, lx=0, moved=0, idle=0;
  function idx(){ var k=Math.round(-target/step)%N; return (k+N)%N; }
  function go(k){ var cur=-target/step, d=((k-cur)%N+N)%N; if(d>N/2) d-=N; target-=d*step; idle=0; }
  var api={ next:function(){target-=step;idle=0}, prev:function(){target+=step;idle=0}, go:function(code){ var k=doors.findIndex(function(d){return d.code===code}); if(k>=0) go(Math.round(-target/step)+(((k-Math.round(-target/step))%N)+N)%N - ( (((k-Math.round(-target/step))%N)+N)%N > N/2 ? N:0)); } };
  host.addEventListener('pointerdown',function(e){ if(e.target.closest('.sr-ui,button,a')) return; drag=true;lx=e.clientX;moved=0;host.setPointerCapture&&host.setPointerCapture(e.pointerId)});
  host.addEventListener('pointermove',function(e){ if(!drag) return; var dx=e.clientX-lx; lx=e.clientX; moved+=Math.abs(dx); target+=dx*0.006; idle=0; });
  host.addEventListener('pointerup',function(e){ if(!drag) return; drag=false; target=Math.round(target/step)*step;
    if(moved<6){ // click
      var r=host.getBoundingClientRect(), m=new T.Vector2(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1), rc=new T.Raycaster(); rc.setFromCamera(m,cam);
      var hit=rc.intersectObjects(items.map(function(o){return o.slab}))[0];
      if(hit){ var k=hit.object.userData.index; if(k===idx()){ if(opts.onPick) opts.onPick(doors[k].code); } else { go(k); } }
    }
  });
  host.addEventListener('pointercancel',function(){drag=false});
  var visible=onVisible(host,function(){}), clock=new T.Clock();
  function frame(){ var dt=Math.min(clock.getDelta(),0.05), t=clock.elapsedTime;
    if(visible()){
      idle+=dt; if(!drag && !reduce && idle>4.2){ target-=step; idle=0; }
      rot+=(target-rot)*Math.min(1,dt*(drag?14:3.2)); ring.rotation.y=rot;
      var k=idx(); if(k!==current){ current=k; if(opts.onChange) opts.onChange(doors[k], k, N); }
      items.forEach(function(o,i){ var a=i*step+rot, f=Math.cos(a); var s=0.82+0.22*Math.max(0,f); o.holder.scale.setScalar(s); });
      cam.position.set(Math.sin(t*0.2)*0.25, mobile?1.3:1.25, R+(mobile?6.9:6.2)); cam.lookAt(0,mobile?1.05:1.05,R*(mobile?0.42:0.35));
      spot.position.set(0,5.5,R+2.5); spot.target.position.set(0,0.8,R);
      dust(dt*0.3,t); renderer.render(scene,cam);
    }
    requestAnimationFrame(frame);
  }
  frame();
  return api;
};
})();
