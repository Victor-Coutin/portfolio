(function(){
  var GH='<svg viewBox="0 0 24 24"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>';
  var T=[['HTML','&lt;/&gt;'],['CSS','{ }'],['JavaScript','JS'],['Python','Py'],['C','C'],['SQL','DB'],['Figma','Fg'],['Git','Git'],['GitHub',GH]];
  document.getElementById('tech').innerHTML=T.map(function(t){return '<div><i>'+t[1]+'</i>'+t[0]+'</div>'}).join('');

  /* fundo: trilhas finas com pulsos verdes */
  var c=document.getElementById('bg'),x=c.getContext('2d'),W,H,paths=[],pulses=[],last=0;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function mk(){
    paths=[];pulses=[];
    var n=Math.max(4,Math.round(W/230));
    for(var i=0;i<n;i++){
      var px=(i+.5)*W/n+(Math.random()-.5)*80,py=-20,pts=[[px,py]],dir=Math.random()<.5?-1:1;
      while(py<H+40){
        var v=70+Math.random()*170;py+=v;pts.push([px,py]);
        if(py>=H+40)break;
        var d=40+Math.random()*60;px+=dir*d;py+=d;pts.push([px,py]);dir=Math.random()<.4?-dir:dir;
        if(px<20)dir=1;if(px>W-20)dir=-1;
      }
      var L=[0];for(var k=1;k<pts.length;k++)L.push(L[k-1]+Math.hypot(pts[k][0]-pts[k-1][0],pts[k][1]-pts[k-1][1]));
      paths.push({p:pts,L:L,T:L[L.length-1]});
      pulses.push({s:-Math.random()*600,v:90+Math.random()*90});
    }
  }
  function at(P,d){
    d=Math.max(0,Math.min(P.T,d));
    for(var k=1;k<P.L.length;k++)if(d<=P.L[k]){var t=(d-P.L[k-1])/(P.L[k]-P.L[k-1]);return[P.p[k-1][0]+(P.p[k][0]-P.p[k-1][0])*t,P.p[k-1][1]+(P.p[k][1]-P.p[k-1][1])*t]}
    return P.p[P.p.length-1];
  }
  function draw(){
    x.clearRect(0,0,W,H);
    x.lineJoin='round';x.lineWidth=1;x.strokeStyle='rgba(255,255,255,.07)';
    paths.forEach(function(P){x.beginPath();P.p.forEach(function(q,i){i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.stroke()});
    if(reduce)return;
    paths.forEach(function(P,i){
      var s=pulses[i].s,tail=170,n=14;
      if(s<0)return;
      for(var j=0;j<n;j++){
        var a=at(P,s-tail*(j+1)/n),b=at(P,s-tail*j/n);
        x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);
        x.strokeStyle='rgba(61,245,160,'+(0.75*(1-j/n))+')';x.lineWidth=1.6;x.stroke();
      }
      var h=at(P,s);x.beginPath();x.arc(h[0],h[1],2.2,0,7);x.fillStyle='#3df5a0';x.fill();
    });
  }
  function size(){
    var r=window.devicePixelRatio||1;W=innerWidth;H=innerHeight;
    c.width=W*r;c.height=H*r;x.setTransform(r,0,0,r,0,0);mk();draw();
  }
  function loop(t){
    var dt=Math.min(.05,(t-last)/1000||0);last=t;
    pulses.forEach(function(p,i){p.s+=p.v*dt;if(p.s>paths[i].T+200)p.s=-Math.random()*500});
    draw();requestAnimationFrame(loop);
  }
  size();addEventListener('resize',size);
  if(!reduce)requestAnimationFrame(loop);
})();
