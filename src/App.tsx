// @ts-nocheck
import { useState, useRef, useEffect } from "react";

const GOLD = "#e8c96d";
const SUPA_URL = "https://njqfexhltjwpgvctmyaw.supabase.co";
const SUPA_KEY = "sb_publishable_wqRnYf5pnp68Qo6-McfwyA_JNYrh2VC";
const EDGE_FN = SUPA_URL + "/functions/v1/claude-proxy";
const GOLDDIM = "#a07820";
const BG = "#000000";
const WHITE = "#d4c9a8";
const DIM = "#aaaaaa";
const TOTAL = 23;

const STRIPE = {
  basic:"https://buy.stripe.com/4gM5kFaVYfjN7EX0vMafS00",
  pro:"https://buy.stripe.com/14A00l8NQ0oTbVd3HYafS01",
  studio:"https://buy.stripe.com/fZubJ35BE3B53oHdiyafS02",
};

const G = (v, sm) => ({
  background: v==="gold" ? `linear-gradient(135deg,${GOLDDIM},${GOLD})` : "transparent",
  border: v==="gold" ? "none" : `1px solid ${GOLD}`,
  color: v==="gold" ? "#000" : GOLD,
  borderRadius:0, fontWeight:900,
  padding: sm ? "5px 14px" : "10px 26px",
  fontSize: sm ? 11 : 13,
  cursor:"pointer", letterSpacing:2, textTransform:"uppercase",
  fontFamily:"'Rajdhani',sans-serif",
});
const Sp = { minHeight:"100vh", background:BG, color:WHITE, fontFamily:"'Rajdhani',sans-serif", paddingBottom:160 };
const H1 = { fontFamily:"'Cinzel',serif", color:GOLD, letterSpacing:5, textTransform:"uppercase", margin:0 };
const Card = (x) => ({ background:"#0a0a0a", border:`1px solid ${GOLDDIM}`, borderRadius:0, padding:18, ...(x||{}) });

// ====================== FIXED P8VideoGenerator ======================
function P8VideoGenerator({ onSave, mediaLib }) {
  const canvasRef=useRef(null);
  const [prompt,setPrompt]=useState("");
  const [title,setTitle]=useState("");
  const [duration,setDuration]=useState(30);
  const [colorGrade,setColorGrade]=useState("gold");
  const [generating,setGenerating]=useState(false);
  const [progress,setProgress]=useState(0);
  const [log,setLog]=useState([]);
  const [videoUrl,setVideoUrl]=useState("");
  const [saved,setSaved]=useState(false);
  const [showText,setShowText]=useState(false);
  const [refImageUrl,setRefImageUrl]=useState("");
  const [showLibrary,setShowLibrary]=useState(false);
  const [fps,setFps]=useState(30);
  const [resolution,setResolution]=useState("1080p");
  const [genre,setGenre]=useState("cinematic");
  const [aiScene,setAiScene]=useState(null);
  const [aiLoading,setAiLoading]=useState(false);
  const refImgRef=useRef(null);
  const videoRef=useRef(null);
  const addLog=(msg)=>setLog(p=>[...p,msg]);

  const GRADES=[
    {id:"gold",label:"Gold & Black",bg:"#000000",fg:"#e8c96d",accent:"#a07820"},
    {id:"teal",label:"Teal & Dark",bg:"#0a1a1a",fg:"#4dd9c0",accent:"#1a5a52"},
    {id:"crimson",label:"Crimson",bg:"#0a0000",fg:"#ff4444",accent:"#880000"},
    {id:"silver",label:"Silver Screen",bg:"#111",fg:"#cccccc",accent:"#888888"},
    {id:"amber",label:"Warm Amber",bg:"#0a0800",fg:"#ffaa33",accent:"#885500"},
    {id:"arctic",label:"Arctic Blue",bg:"#000a1a",fg:"#88ccff",accent:"#003366"},
    {id:"neon",label:"Neon Night",bg:"#000000",fg:"#ff00ff",accent:"#00ffff"},
    {id:"forest",label:"Forest Green",bg:"#000a00",fg:"#44ff88",accent:"#004420"},
  ];

  const GENRES=[
    {id:"cinematic",label:"🎬 Cinematic",desc:"Dark dramatic"},
    {id:"documentary",label:"📽 Documentary",desc:"Clean authoritative"},
    {id:"horror",label:"👁 Horror",desc:"Dark disturbing"},
    {id:"romance",label:"💛 Romance",desc:"Warm intimate"},
    {id:"scifi",label:"🚀 Sci-Fi",desc:"Futuristic epic"},
    {id:"comedy",label:"😄 Comedy",desc:"Bright energetic"},
    {id:"action",label:"⚡ Action",desc:"Fast intense"},
    {id:"animation",label:"✨ Animation",desc:"Vivid stylised"},
    {id:"musical",label:"🎵 Musical",desc:"Rhythmic vibrant"},
    {id:"thriller",label:"🔪 Thriller",desc:"Tense atmospheric"},
    {id:"nature",label:"🌿 Nature",desc:"Organic flowing"},
    {id:"historical",label:"🏛 Historical",desc:"Epic period"},
  ];

  const grade=GRADES.find(g=>g.id===colorGrade)||GRADES[0];

  const analyseWithClaude=async()=>{
    if(!prompt.trim())return;
    setAiLoading(true);setAiScene(null);
    try{
      const res=await fetch(EDGE_FN,{method:"POST",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+SUPA_KEY,"apikey":SUPA_KEY},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,
          messages:[{role:"user",content:`You are a professional cinema director analysing a scene prompt to build a canvas-rendered film clip.

PROMPT: "${prompt}"
GENRE: ${genre}
COLOUR GRADE: ${colorGrade}

Return ONLY valid JSON, no markdown, no explanation:
{
  "sceneType": "cosmic|city|dawn|landscape|interior|abstract",
  "skyColor": "#hex",
  "groundColor": "#hex",
  "primaryColor": "#hex",
  "accentColor": "#hex",
  "starField": true|false,
  "earthGlow": true|false,
  "cityLights": true|false,
  "humanFigure": true|false,
  "silhouette": "none|person|city",
  "fogLayer": true|false,
  "lightBeams": true|false,
  "rays": true|false,
  "sunRise": true|false,
  "groundLayer": true|false,
  "horizon": true|false,
  "particles": true|false,
  "particleCount": 60,
  "waves": false,
  "titleLines": ["line 1","line 2"],
  "mood": "description of mood",
  "cinematicNote": "one sentence director note"
}`}]})});
      const d=await res.json();
      if(d.content&&d.content[0]){
        try{
          const txt=d.content[0].text.trim().replace(/```json|```/g,"").trim();
          const parsed=JSON.parse(txt);
          setAiScene(parsed);
          addLog("✦ Claude analysed: "+parsed.sceneType+" · "+parsed.mood);
          addLog("  "+parsed.cinematicNote);
        }catch(e){addLog("Scene analysed — using smart defaults");}
      }
    }catch(e){addLog("Analysing from prompt directly...");}
    setAiLoading(false);
  };

  const generateVideo=async()=>{
    if(!prompt.trim()){alert("Describe your scene first");return;}
    setGenerating(true);setProgress(0);setLog([]);setVideoUrl("");setSaved(false);

    const canvas=canvasRef.current;
    const dims=resolution==="4K"?{w:3840,h:2160}:resolution==="720p"?{w:1280,h:720}:{w:1920,h:1080};
    canvas.width=dims.w;canvas.height=dims.h;
    const W=dims.w,H=dims.h;
    const ctx=canvas.getContext("2d");
    const totalFrames=duration*fps;

    addLog("🎬 MandaStrong Cinema Engine initialising...");
    addLog("📐 "+W+"×"+H+" · "+fps+"fps · "+duration+"s · "+genre);

    let scene=aiScene||{};
    if(!aiScene){
      addLog("🔍 Parsing scene from prompt...");
      const ft=prompt.toLowerCase();
      scene.sceneType=ft.includes("space")||ft.includes("planet")||ft.includes("galaxy")||ft.includes("cosmos")?"cosmic":
        ft.includes("city")||ft.includes("street")||ft.includes("building")||ft.includes("urban")?"city":
        ft.includes("dawn")||ft.includes("sunrise")||ft.includes("golden hour")||ft.includes("morning")?"dawn":
        ft.includes("dark")||ft.includes("alone")||ft.includes("interior")||ft.includes("room")||ft.includes("spotlight")?"interior":
        ft.includes("landscape")||ft.includes("field")||ft.includes("horizon")?"landscape":"abstract";
      scene.starField=ft.includes("star")||ft.includes("space")||ft.includes("galaxy")||ft.includes("night sky");
      scene.earthGlow=ft.includes("earth")||ft.includes("planet")||ft.includes("globe")||ft.includes("from space");
      scene.cityLights=ft.includes("window")||ft.includes("city light")||ft.includes("lit building");
      scene.humanFigure=ft.includes("person")||ft.includes("figure")||ft.includes("human")||ft.includes("crowd")||ft.includes("people")||ft.includes("man ")||ft.includes("woman ");
      scene.silhouette=ft.includes("crowd")||ft.includes("people")?"city":ft.includes("alone")||ft.includes("single")||ft.includes("one person")?"person":"none";
      scene.fogLayer=ft.includes("fog")||ft.includes("mist")||ft.includes("haze")||ft.includes("smoke");
      scene.lightBeams=ft.includes("beam")||ft.includes("shaft")||ft.includes("spotlight")||ft.includes("ray");
      scene.rays=ft.includes("ray")||ft.includes("radiating")||ft.includes("light expand");
      scene.sunRise=ft.includes("dawn")||ft.includes("sunrise")||ft.includes("golden dawn")||ft.includes("golden hour");
      scene.groundLayer=ft.includes("ground")||ft.includes("earth")||ft.includes("floor")||ft.includes("field")||ft.includes("garden");
      scene.horizon=ft.includes("horizon")||ft.includes("skyline");
      scene.particles=true;
      scene.particleCount=ft.includes("dense")?100:ft.includes("sparse")?20:60;
      scene.waves=ft.includes("ocean")||ft.includes("sea")||ft.includes("water")||ft.includes("wave");
      const genreColors={
        cinematic:{sky:"#000000",ground:"#0a0500",primary:"#e8c96d",accent:"#a07820"},
        documentary:{sky:"#050508",ground:"#080508",primary:"#d4c9a8",accent:"#888888"},
        horror:{sky:"#020008",ground:"#050003",primary:"#cc2222",accent:"#440000"},
        romance:{sky:"#080010",ground:"#0a0508",primary:"#ff88aa",accent:"#cc4466"},
        scifi:{sky:"#000008",ground:"#000a0a",primary:"#44ccff",accent:"#0044aa"},
        comedy:{sky:"#020510",ground:"#050a05",primary:"#ffdd44",accent:"#ff8822"},
        action:{sky:"#050000",ground:"#0a0300",primary:"#ff6600",accent:"#cc2200"},
        animation:{sky:"#000510",ground:"#050010",primary:"#aa44ff",accent:"#ff44aa"},
        musical:{sky:"#000508",ground:"#050008",primary:"#ff44cc",accent:"#44ffcc"},
        thriller:{sky:"#000000",ground:"#020202",primary:"#445566",accent:"#223344"},
        nature:{sky:"#000a05",ground:"#030a00",primary:"#44ff88",accent:"#228844"},
        historical:{sky:"#050300",ground:"#0a0700",primary:"#ccaa44",accent:"#886622"},
      };
      const gc=genreColors[genre]||genreColors.cinematic;
      scene.skyColor=gc.sky;scene.groundColor=gc.ground;
      scene.primaryColor=grade.fg;scene.accentColor=grade.accent;
    }

    addLog("Scene: "+scene.sceneType+" · human:"+scene.humanFigure+" · city:"+scene.cityLights+" · stars:"+scene.starField);

    const mimeType=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";
    const stream=canvas.captureStream(fps);
    const recorder=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:resolution==="4K"?40000000:12000000});
    const chunks=[];
    recorder.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data);};
    recorder.start(100);
    addLog("● Recording...");

    const parseHex=(hex)=>{const h=(hex||"#888888").replace("#","");return[parseInt(h.slice(0,2),16)||0,parseInt(h.slice(2,4),16)||0,parseInt(h.slice(4,6),16)||0];};
    const [fgR,fgG,fgB]=parseHex(scene.primaryColor||grade.fg);
    const [skyR,skyG,skyB]=parseHex(scene.skyColor||grade.bg);
    const [gndR,gndG,gndB]=parseHex(scene.groundColor||"#0a0500");
    const numP=Math.min(200,scene.particleCount||60);

    let refImg=null;
    if(refImageUrl){
      try{refImg=new Image();await new Promise(r=>{refImg.onload=r;refImg.onerror=r;refImg.src=refImageUrl;});}catch(e){refImg=null;}
    }

    const stars=Array.from({length:300},(_,i)=>({x:(i*2791+i*i*37)%W,y:(i*1847+i*i*13)%H,r:i%7===0?2.2:i%3===0?1.4:0.8,tw:i*0.7,speed:0.3+i%3*0.2}));
    const buildings=Array.from({length:40},(_,i)=>({x:i*(W/39),w:14+i%7*28,h:H*0.06+i%11*H*0.09}));
    const grainCanvas=document.createElement("canvas");grainCanvas.width=W;grainCanvas.height=H;
    const grainCtx=grainCanvas.getContext("2d");const grainData=grainCtx.createImageData(W,H);
    for(let i=0;i<grainData.data.length;i+=4){const v=Math.random()*30-15;grainData.data[i]=128+v;grainData.data[i+1]=128+v;grainData.data[i+2]=128+v;grainData.data[i+3]=22;}
    grainCtx.putImageData(grainData,0,0);

    const drawFrame=(frame)=>{   // ← fixed: frame is now a parameter
      const t=frame/totalFrames;const sec=frame/fps;
      const ease=x=>x<0.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
      const bgGrad=ctx.createLinearGradient(0,0,0,H);
      bgGrad.addColorStop(0,`rgb(${skyR},${skyG},${skyB})`);bgGrad.addColorStop(1,`rgb(${gndR},${gndG},${gndB})`);
      ctx.fillStyle=bgGrad;ctx.fillRect(0,0,W,H);
      if(refImg){ctx.save();ctx.globalAlpha=0.18;ctx.drawImage(refImg,0,0,W,H);ctx.restore();}
      if(scene.starField){
        stars.forEach(s=>{const tw=0.25+Math.sin(sec*s.speed+s.tw)*0.3;ctx.fillStyle=`rgba(255,255,240,${Math.max(0,tw)})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();});
        for(let n=0;n<3;n++){const nx=W*(0.2+n*0.3),ny=H*(0.2+n*0.15);const ng=ctx.createRadialGradient(nx,ny,0,nx,ny,W*0.18);ng.addColorStop(0,`rgba(${fgR},${fgG},${fgB},0.04)`);ng.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=ng;ctx.fillRect(0,0,W,H);}
      }
      if(scene.earthGlow){const earthY=H*0.78+Math.sin(sec*0.08)*H*0.015;const eg=ctx.createRadialGradient(W*0.5,earthY,H*0.04,W*0.5,earthY,H*0.52);eg.addColorStop(0,"rgba(30,80,180,0.65)");eg.addColorStop(0.4,"rgba(20,60,140,0.3)");eg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=eg;ctx.fillRect(0,H*0.28,W,H*0.72);ctx.save();ctx.beginPath();ctx.arc(W*0.5,H*1.12,H*0.75,Math.PI*1.1,Math.PI*1.9);ctx.strokeStyle="rgba(80,140,255,0.55)";ctx.lineWidth=4;ctx.stroke();ctx.restore();}
      if(scene.sunRise){const sp=Math.min(1,ease(t*1.4));const sunY=H*(0.82-sp*0.32);const sunGlow=ctx.createRadialGradient(W*0.5,sunY,0,W*0.5,sunY,H*0.55);sunGlow.addColorStop(0,`rgba(255,220,100,${0.85*sp})`);sunGlow.addColorStop(0.3,`rgba(255,150,30,${0.4*sp})`);sunGlow.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sunGlow;ctx.fillRect(0,0,W,H);}
      if(scene.rays||scene.lightBeams){const numRays=scene.lightBeams?8:5;for(let i=0;i<numRays;i++){const angle=-0.6+i*(1.2/numRays)+Math.sin(sec*0.15+i)*0.03;const alpha=0.06+Math.sin(sec*0.3+i*0.8)*0.04;ctx.save();ctx.translate(W*0.5,0);ctx.rotate(angle);const ray=ctx.createLinearGradient(0,0,0,H*1.8);ray.addColorStop(0,`rgba(${fgR},${fgG},${fgB},${alpha})`);ray.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=ray;const rw=80+i*20;ctx.fillRect(-rw/2,0,rw,H*1.8);ctx.restore();}}
      if(scene.waves){for(let w=0;w<4;w++){const wAlpha=0.08-w*0.015;ctx.strokeStyle=`rgba(${fgR},${fgG},${fgB},${wAlpha})`;ctx.lineWidth=1.5+w;ctx.beginPath();for(let x=0;x<=W;x+=3){const wy=H*(0.55+w*0.09)+Math.sin(x*0.005+sec*(0.6+w*0.25)+w*1.2)*H*(0.028+w*0.012);x===0?ctx.moveTo(x,wy):ctx.lineTo(x,wy);}ctx.stroke();}}
      if(scene.sceneType==="city"||scene.cityLights||scene.silhouette==="city"){ctx.fillStyle="rgba(0,0,0,0.92)";buildings.forEach(b=>{ctx.fillRect(b.x,H-b.h,b.w,b.h);if(scene.cityLights){for(let wy=H-b.h+8;wy<H-8;wy+=16){for(let wx=b.x+4;wx<b.x+b.w-6;wx+=10){if(Math.sin(wx*7+wy*5+frame*0.012)>0.05){const lit=0.25+Math.sin(wx*11+wy*7+sec*0.4)*0.3;const flicker=Math.random()>0.998?0:1;ctx.fillStyle=`rgba(${fgR},${fgG},${fgB},${Math.max(0,lit)*flicker})`;ctx.fillRect(wx,wy,6,8);}}}});if(scene.groundLayer){const sg=ctx.createLinearGradient(0,H*0.88,0,H);sg.addColorStop(0,`rgba(${fgR},${fgG},${fgB},0.06)`);sg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sg;ctx.fillRect(0,H*0.88,W,H*0.12);}}}
      if(scene.groundLayer&&scene.sceneType!=="city"){const gg=ctx.createLinearGradient(0,H*0.7,0,H);gg.addColorStop(0,`rgba(${gndR},${gndG},${gndB},0)`);gg.addColorStop(0.3,`rgba(${gndR+10},${gndG+8},${gndB+5},0.8)`);gg.addColorStop(1,`rgba(${Math.min(255,gndR+20)},${Math.min(255,gndG+15)},${Math.min(255,gndB+10)},1)`);ctx.fillStyle=gg;ctx.fillRect(0,H*0.7,W,H*0.3);}
      if(scene.humanFigure||scene.silhouette==="person"){const fx=W*0.42;const fh=H*0.32;const fw=fh*0.18;const fy=H*0.68-fh;const fg2=ctx.createRadialGradient(fx,fy+fh*0.5,0,fx,fy+fh*0.5,fw*6);fg2.addColorStop(0,`rgba(${fgR},${fgG},${fgB},0.12)`);fg2.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=fg2;ctx.fillRect(fx-fw*6,fy-fw,fw*12,fh*1.5);ctx.fillStyle="rgba(0,0,0,0.88)";ctx.fillRect(fx-fw/2,fy+fh*0.28,fw,fh*0.72);ctx.beginPath();ctx.arc(fx,fy+fh*0.22,fw*0.55,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(fx,fy+fh*0.35,fw*0.8,fw*0.3,0,0,Math.PI*2);ctx.fill();}
      if(scene.silhouette==="city"&&scene.humanFigure){const crowdY=H*0.78;for(let c=0;c<60;c++){const cx=(c*W/59)+Math.sin(c*1.7+sec*0.1)*8;const ch=H*(0.08+Math.sin(c*0.9)*0.04);const cw=H*0.025;ctx.fillStyle=`rgba(0,0,0,${0.7+c%3*0.1})`;ctx.fillRect(cx-cw/2,crowdY-ch,cw,ch);ctx.beginPath();ctx.arc(cx,crowdY-ch,cw*0.6,0,Math.PI*2);ctx.fill();if(c%4===0){ctx.fillStyle=`rgba(${fgR},${fgG},${fgB},0.15)`;ctx.fillRect(cx-cw*0.4,crowdY-ch*0.5,cw*0.8,cw*1.1);}}}
      if(scene.fogLayer){const fogY=scene.groundLayer?H*0.65:H*0.45;for(let fl=0;fl<5;fl++){const fogOffset=Math.sin(sec*0.15+fl*1.2)*W*0.04;const fog=ctx.createLinearGradient(0,fogY+fl*H*0.06,0,fogY+fl*H*0.06+H*0.18);fog.addColorStop(0,`rgba(${skyR+20},${skyG+20},${skyB+20},${0.18-fl*0.025})`);fog.addColorStop(1,"rgba(0,0,0,0)");ctx.save();ctx.translate(fogOffset,0);ctx.fillStyle=fog;ctx.fillRect(-W*0.1,fogY+fl*H*0.06,W*1.2,H*0.18);ctx.restore();}}
      if(scene.particles!==false){for(let i=0;i<numP;i++){const speed=0.08+i%4*0.04;const px=(i*2791+frame*speed*(0.8+i%3*0.3)+i*Math.sin(sec*0.1+i))%W;const py=((i*1847+frame*(0.05+i%2*0.025))%H);const ptw=0.12+Math.sin(frame*0.05+i*1.4)*0.22;const pr=i%9===0?2.8:i%4===0?1.8:i%2===0?1.1:0.6;ctx.fillStyle=`rgba(${fgR},${fgG},${fgB},${Math.max(0,ptw)})`;ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);ctx.fill();}}
      const vig=ctx.createRadialGradient(W/2,H/2,W*0.15,W/2,H/2,W*0.78);vig.addColorStop(0,"rgba(0,0,0,0)");vig.addColorStop(0.7,"rgba(0,0,0,0.25)");vig.addColorStop(1,"rgba(0,0,0,0.92)");ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
      ctx.save();ctx.globalAlpha=0.04;ctx.drawImage(grainCanvas,Math.random()*4-2,Math.random()*4-2);ctx.restore();
      ctx.fillStyle="#000";ctx.fillRect(0,0,W,H*0.055);ctx.fillRect(0,H*0.945,W,H*0.055);
      if(showText){
        const lines=aiScene?.titleLines||[title||""];
        lines.filter(Boolean).forEach((line,i)=>{
          const ls=(i+0.5)/(lines.length+1);const le=ls+0.7/(lines.length+1);
          if(t>=ls-0.05&&t<=le+0.08){
            const lt=Math.min(1,(t-(ls-0.05))/0.07);const fo=t>le?Math.max(0,1-(t-le)/0.07):1;
            ctx.globalAlpha=lt*fo;ctx.fillStyle=i===0?grade.fg:"#ffffff";
            ctx.font=`${i===0?"900":"700"} ${Math.round(i===0?H*0.065:H*0.044)}px Arial Black,sans-serif`;
            ctx.textAlign="center";ctx.shadowColor=grade.fg;ctx.shadowBlur=i===0?28:0;
            ctx.fillText(line.toUpperCase(),W/2,H*0.5+(i-lines.length/2)*(H*0.1));
            ctx.shadowBlur=0;ctx.globalAlpha=1;
          }
        });
      }
      if(t<0.04){ctx.fillStyle=`rgba(0,0,0,${1-t/0.04})`;ctx.fillRect(0,0,W,H);}
      if(t>0.94){ctx.fillStyle=`rgba(0,0,0,${(t-0.94)/0.06})`;ctx.fillRect(0,0,W,H);}
    };

    addLog("🎞 Rendering "+totalFrames+" frames...");
    const msPerFrame=1000/fps;

    await new Promise(resolve=>{
      let frame=0;
      const renderNext=()=>{
        if(frame>=totalFrames){resolve(null);return;}
        drawFrame(frame);
        setProgress(Math.round((frame/totalFrames)*88));
        if(frame%(fps*3)===0&&frame>0)addLog("  "+Math.round(frame/fps)+"s / "+duration+"s");
        frame++;
        setTimeout(renderNext,msPerFrame);
      };
      renderNext();
    });

    addLog("⬛ Finalising...");setProgress(94);
    await new Promise(r=>setTimeout(r,600));
    recorder.stop();
    await new Promise(r=>{recorder.onstop=r;});
    const blob=new Blob(chunks,{type:mimeType});
    const url=URL.createObjectURL(blob);
    setVideoUrl(url);setProgress(100);
    addLog("✅ COMPLETE — "+(blob.size/1024/1024).toFixed(1)+"MB · "+duration+"s · "+resolution);
    setTimeout(()=>{if(videoRef.current){videoRef.current.load();videoRef.current.play().catch(()=>{});}},200);
    setGenerating(false);
  };

  const saveToLibrary=async()=>{
    if(!videoUrl)return;
    try{
      const response=await fetch(videoUrl);const blob=await response.blob();
      const fileName=(title||"Scene")+"_"+genre+"_"+resolution+"_"+duration+"s.webm";
      const file=new File([blob],fileName,{type:"video/webm"});
      if(onSave)onSave({id:Date.now()+Math.random(),name:fileName,type:"video/webm",url:URL.createObjectURL(file),file});
    }catch(e){
      if(onSave)onSave({id:Date.now()+Math.random(),name:(title||"Scene")+"_"+duration+"s.webm",type:"video/webm",url:videoUrl});
    }
    setSaved(true);
  };

  const libVideos=(mediaLib||[]).filter(a=>a.type&&a.type.startsWith("video"));
  const libImages=(mediaLib||[]).filter(a=>a.type&&a.type.startsWith("image"));

  return (
    <div style={{...Sp}}>
      <canvas ref={canvasRef} style={{display:"none"}}/>
      <input ref={refImgRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
        const f=e.target.files&&e.target.files[0];
        if(f)setRefImageUrl(URL.createObjectURL(f));
      }}/>

      <div style={{padding:"10px 20px",borderBottom:`2px solid ${GOLD}`,background:"#020200",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:10,color:GOLD,letterSpacing:5,fontWeight:700}}>AI WORKSTATION 04 · CLAUDE-POWERED CINEMA ENGINE · MANDASTRONG STUDIO</div>
          <h1 style={{...H1,fontSize:22,margin:0}}>🎬 VIDEO GENERATOR — DESCRIBE ANY SCENE. MAKE ANY MOVIE.</h1>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{color:"#22c55e",fontSize:11,fontWeight:900,letterSpacing:2}}>● ENGINE READY</div>
          <div style={{color:GOLD,fontSize:11,fontWeight:700}}>{resolution} · {fps}FPS</div>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"300px 1fr 280px",minHeight:"calc(100vh - 116px)"}}>

        <div style={{borderRight:`1px solid ${GOLDDIM}`,background:"#020200",display:"flex",flexDirection:"column",overflowY:"auto"}}>
          <div style={{padding:12,flex:1}}>

            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:8}}>MOVIE GENRE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:12}}>
              {GENRES.map(g=>(
                <button key={g.id} onClick={()=>setGenre(g.id)}
                  style={{background:genre===g.id?"#0a0800":"#000",border:`1px solid ${genre===g.id?GOLD:GOLDDIM}`,padding:"6px 8px",cursor:"pointer",textAlign:"left"}}>
                  <div style={{color:genre===g.id?GOLD:WHITE,fontSize:11,fontWeight:900}}>{g.label}</div>
                  <div style={{color:DIM,fontSize:9}}>{g.desc}</div>
                </button>
              ))}
            </div>

            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:5}}>SCENE TITLE</div>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Chapter 1 — Opening Scene"
              style={{width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"8px",color:WHITE,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif",marginBottom:10}}/>

            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:5}}>DESCRIBE YOUR SCENE</div>
            <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}
              placeholder={"Describe any scene in plain English.\n\nExamples:\n• A lone figure walks across a frozen tundra at night under a sky full of stars\n• City streets at 3am. Rain. Neon reflections. Empty.\n• A child runs through a sunlit meadow toward the camera\n• Deep space. A planet slowly rotating. City lights on the dark side.\n\nAny genre. Any story. Any mood."}
              style={{width:"100%",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"10px",color:WHITE,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"'Rajdhani',sans-serif",lineHeight:1.8,height:150,resize:"none",marginBottom:8}}/>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
              <button onClick={analyseWithClaude} disabled={aiLoading||!prompt.trim()}
                style={{...G("out",true),fontSize:9,opacity:aiLoading||!prompt.trim()?0.5:1}}>
                {aiLoading?"⟳ ANALYSING...":"✦ CLAUDE ANALYSE"}
              </button>
              {aiScene&&<div style={{background:"#0a0800",border:`1px solid ${GOLD}`,padding:"4px 8px",fontSize:9,color:GOLD,fontWeight:900,textAlign:"center"}}>✓ CLAUDE READY</div>}
            </div>

            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:6}}>COLOUR GRADE</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:12}}>
              {GRADES.map(g=>(
                <button key={g.id} onClick={()=>setColorGrade(g.id)}
                  style={{background:colorGrade===g.id?g.fg:"#111",border:`1px solid ${colorGrade===g.id?g.fg:GOLDDIM}`,color:colorGrade===g.id?"#000":WHITE,padding:"5px 6px",cursor:"pointer",fontSize:10,fontWeight:900}}>
                  {g.label}
                </button>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
              <div>
                <div style={{color:GOLD,fontSize:9,letterSpacing:2,marginBottom:4}}>RESOLUTION</div>
                {["720p","1080p","4K"].map(r=>(
                  <button key={r} onClick={()=>setResolution(r)} style={{background:resolution===r?GOLD:"#111",border:`1px solid ${resolution===r?"#000":GOLDDIM}`,color:resolution===r?"#000":WHITE,padding:"3px 8px",cursor:"pointer",fontSize:9,fontWeight:900,marginRight:3,marginBottom:3}}>{r}</button>
                ))}
              </div>
              <div>
                <div style={{color:GOLD,fontSize:9,letterSpacing:2,marginBottom:4}}>FRAME RATE</div>
                {[24,30,60].map(f=>(
                  <button key={f} onClick={()=>setFps(f)} style={{background:fps===f?GOLD:"#111",border:`1px solid ${fps===f?"#000":GOLDDIM}`,color:fps===f?"#000":WHITE,padding:"3px 8px",cursor:"pointer",fontSize:9,fontWeight:900,marginRight:3,marginBottom:3}}>{f}</button>
                ))}
              </div>
            </div>

            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{color:GOLD,fontSize:9,letterSpacing:2,fontWeight:900}}>DURATION</span>
              <span style={{color:WHITE,fontSize:10,fontWeight:900}}>{duration}s</span>
            </div>
            <input type="range" min={3} max={120} value={duration} onChange={e=>setDuration(+e.target.value)} style={{width:"100%",accentColor:GOLD,marginBottom:12}}/>

            <div style={{display:"flex",gap:6,marginBottom:12}}>
              <button onClick={()=>setShowText(false)} style={{...G(showText===false?"gold":"out",true),flex:1,fontSize:9}}>🎬 VISUALS ONLY</button>
              <button onClick={()=>setShowText(true)} style={{...G(showText===true?"gold":"out",true),flex:1,fontSize:9}}>📝 WITH TITLE TEXT</button>
            </div>

            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:6}}>UPLOAD REFERENCE IMAGE</div>
            <div style={{color:DIM,fontSize:9,marginBottom:6,lineHeight:1.5}}>Upload any image to influence the mood, colour and atmosphere of your scene.</div>
            {refImageUrl?(
              <div style={{position:"relative",marginBottom:12}}>
                <img src={refImageUrl} alt="ref" style={{width:"100%",height:80,objectFit:"cover",border:`1px solid ${GOLD}`}}/>
                <button onClick={()=>setRefImageUrl("")} style={{position:"absolute",top:4,right:4,background:"#000",border:`1px solid ${GOLD}`,color:GOLD,padding:"1px 6px",cursor:"pointer",fontSize:10}}>✕</button>
              </div>
            ):(
              <div>
                <div onClick={()=>refImgRef.current&&refImgRef.current.click()}
                  style={{border:`1px dashed ${GOLDDIM}`,padding:"10px",textAlign:"center",cursor:"pointer",marginBottom:6}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=GOLD}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=GOLDDIM}>
                  <div style={{color:WHITE,fontSize:10,fontWeight:700}}>⬆ CLICK TO UPLOAD IMAGE</div>
                  <div style={{color:DIM,fontSize:9,marginTop:2}}>JPG · PNG · WEBP</div>
                </div>
                {libImages.length>0&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3,marginBottom:6}}>
                    {libImages.slice(0,8).map(a=>(
                      <img key={a.id} src={a.url} alt="" onClick={()=>setRefImageUrl(a.url)}
                        style={{width:"100%",height:36,objectFit:"cover",border:`1px solid ${refImageUrl===a.url?GOLD:GOLDDIM}`,cursor:"pointer"}}/>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{padding:10,borderTop:`1px solid ${GOLDDIM}`,flexShrink:0}}>
            <button onClick={generateVideo} disabled={generating||!prompt.trim()}
              style={{...G("gold",false),width:"100%",padding:"14px",fontSize:13,letterSpacing:3,opacity:generating||!prompt.trim()?0.5:1}}>
              {generating?"⟳ RENDERING "+progress+"%":"🎬 GENERATE CLIP"}
            </button>
          </div>
        </div>

        <div style={{background:"#000",display:"flex",flexDirection:"column"}}>
          <div style={{background:"#000",position:"relative",width:"100%",paddingTop:"56.25%",borderBottom:`1px solid ${GOLDDIM}`,overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {videoUrl?(
                <video key={videoUrl} ref={videoRef} src={videoUrl} controls autoPlay loop muted playsInline style={{width:"100%",height:"100%",objectFit:"contain"}}/>
              ):(
                <div style={{textAlign:"center",padding:20,position:"relative",zIndex:1}}>
                  {refImageUrl&&<img src={refImageUrl} alt="ref" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:0.12}}/>}
                  <div style={{fontSize:42,marginBottom:8}}>🎬</div>
                  <div style={{color:grade.fg,fontSize:13,letterSpacing:3,fontWeight:900}}>{title||"YOUR SCENE"}</div>
                  <div style={{color:DIM,fontSize:10,marginTop:4}}>{GENRES.find(g=>g.id===genre)?.label} · {grade.label} · {duration}s · {resolution}</div>
                  {aiScene&&<div style={{color:"#22c55e",fontSize:10,marginTop:6,fontWeight:900}}>✦ CLAUDE SCENE READY</div>}
                  {!prompt.trim()&&<div style={{color:GOLDDIM,fontSize:10,marginTop:10,lineHeight:1.8,maxWidth:300}}>Describe your scene on the left panel.<br/>Any genre. Any story. Any mood.<br/>Then hit GENERATE CLIP.</div>}
                </div>
              )}
              {generating&&(
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"#000"}}>
                  <div style={{width:progress+"%",height:"100%",background:`linear-gradient(90deg,${GOLDDIM},${GOLD})`,transition:"width .15s"}}/>
                </div>
              )}
            </div>
          </div>

          {videoUrl&&!generating&&(
            <div style={{padding:"8px 14px",borderBottom:`1px solid ${GOLDDIM}`,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
              <a href={videoUrl} download={(title||"scene").replace(/\s+/g,"_")+"_"+resolution+"_"+duration+"s.webm"}
                style={{...G("out",false),padding:"8px",fontSize:10,textDecoration:"none",textAlign:"center",display:"block"}}>⬇ DOWNLOAD</a>
              <button onClick={saveToLibrary} style={{...G(saved?"out":"gold",false),padding:"8px",fontSize:10}}>{saved?"✓ SAVED TO LIBRARY":"💾 SAVE TO LIBRARY"}</button>
              <button onClick={()=>{setVideoUrl("");setLog([]);setSaved(false);setAiScene(null);setTitle("");setPrompt("");}} style={{...G("out",false),padding:"8px",fontSize:10}}>🔄 NEW SCENE</button>
            </div>
          )}

          {libVideos.length>0&&(
            <div style={{borderBottom:`1px solid ${GOLDDIM}`}}>
              <div style={{padding:"4px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:GOLD,fontSize:9,letterSpacing:2,fontWeight:900}}>LIBRARY — {libVideos.length} CLIPS</span>
                <button onClick={()=>setShowLibrary(p=>!p)} style={{background:"none",border:"none",color:GOLD,cursor:"pointer",fontSize:10}}>{showLibrary?"▲":"▼"}</button>
              </div>
              {showLibrary&&(
                <div style={{display:"flex",gap:5,padding:"0 8px 8px",overflowX:"auto"}}>
                  {libVideos.map(a=>(
                    <div key={a.id} onClick={()=>{setVideoUrl(a.url);setSaved(true);}} style={{flexShrink:0,width:90,cursor:"pointer",border:`1px solid ${GOLDDIM}`}}>
                      <video src={a.url} style={{width:"100%",height:50,objectFit:"cover"}} muted/>
                      <div style={{color:WHITE,fontSize:8,padding:"2px 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name.slice(0,12)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{flex:1,overflowY:"auto",padding:12,background:"#010100"}}>
            {log.length>0?(
              <div>
                <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:6}}>● RENDER LOG</div>
                {log.map((l,i)=>(
                  <div key={i} style={{color:i===log.length-1?"#22c55e":"#444",fontSize:10,lineHeight:1.9,fontFamily:"monospace"}}>{l}</div>
                ))}
              </div>
            ):(
              <div style={{textAlign:"center",padding:"20px",color:GOLDDIM}}>
                <div style={{fontSize:24,marginBottom:8}}>🎬</div>
                <div style={{fontSize:10,lineHeight:2,letterSpacing:1}}>CLAUDE-POWERED CINEMA ENGINE<br/>Describe any scene. Upload any image.<br/>Generate a real video clip.<br/>Save to library. Send to timeline.</div>
              </div>
            )}
          </div>
        </div>

        <div style={{borderLeft:`1px solid ${GOLDDIM}`,background:"#020200",overflowY:"auto"}}>
          <div style={{padding:"10px 12px",borderBottom:`1px solid ${GOLDDIM}`}}>
            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900}}>✦ SCENE INTELLIGENCE</div>
          </div>
          <div style={{padding:12}}>
            {aiScene?(
              <div>
                <div style={{...Card(),marginBottom:10,padding:10,border:`1px solid ${GOLD}`,background:"#0a0800"}}>
                  <div style={{color:"#22c55e",fontSize:9,fontWeight:900,letterSpacing:2,marginBottom:6}}>✦ CLAUDE ANALYSIS</div>
                  <div style={{color:GOLD,fontSize:11,fontWeight:900,marginBottom:4}}>{aiScene.sceneType?.toUpperCase()}</div>
                  <div style={{color:WHITE,fontSize:10,lineHeight:1.7}}>{aiScene.mood}</div>
                  <div style={{color:GOLD,fontSize:9,marginTop:6,lineHeight:1.6,fontStyle:"italic"}}>{aiScene.cinematicNote}</div>
                </div>
                <div style={{...Card(),marginBottom:10,padding:10}}>
                  <div style={{color:GOLD,fontSize:9,letterSpacing:2,marginBottom:6}}>ELEMENTS ACTIVE</div>
                  {[["Stars",aiScene.starField],["Earth Glow",aiScene.earthGlow],["City Lights",aiScene.cityLights],["Human Figure",aiScene.humanFigure],["Fog",aiScene.fogLayer],["Light Beams",aiScene.lightBeams],["Sun Rise",aiScene.sunRise],["Particles",aiScene.particles]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{color:v?WHITE:DIM,fontSize:10}}>{l}</span>
                      <span style={{color:v?"#22c55e":"#333",fontSize:9,fontWeight:900}}>{v?"✓":"-"}</span>
                    </div>
                  ))}
                </div>
              </div>
            ):(
              <div style={{...Card(),marginBottom:10,padding:10}}>
                <div style={{color:GOLD,fontSize:9,letterSpacing:2,marginBottom:6}}>AUTO DETECTION</div>
                <div style={{color:DIM,fontSize:9,marginBottom:8,lineHeight:1.6}}>Type your scene description and hit CLAUDE ANALYSE for AI-powered scene building, or just hit GENERATE and the engine will parse your prompt automatically.</div>
                {[["Space/Cosmos",["space","planet","galaxy","cosmos","earth","stars"]],["City/Urban",["city","street","building","urban","window"]],["Human Present",["person","figure","human","crowd","man","woman"]],["Fog/Mist",["fog","mist","haze","smoke"]],["Light Beams",["beam","ray","shaft","spotlight"]],["Ocean/Water",["ocean","sea","water","wave","river"]]].map(([label,keys])=>{
                  const active=keys.some(k=>prompt.toLowerCase().includes(k));
                  return(
                    <div key={label} style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{color:active?WHITE:DIM,fontSize:10}}>{label}</span>
                      <span style={{color:active?"#22c55e":"#333",fontSize:9,fontWeight:900}}>{active?"✓ DETECTED":"—"}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:8}}>QUICK SCENE PRESETS</div>
            <div style={{color:DIM,fontSize:9,marginBottom:8,lineHeight:1.5}}>Click any preset to load it as your starting point, then customise it.</div>
            {[
              ["🌌 Deep Space","Earth from deep space. Planet glowing blue and white. Stars everywhere. City lights on the dark side. Atmosphere burning gold at the edges."],
              ["🌆 City Night","City street at night. Crowd of people moving through heavy fog. Every window blazing. Ground level. Buildings rising on both sides."],
              ["🌅 Golden Dawn","Single human figure standing on flat open ground at dawn. Sun rising from below flooding everything gold. Wide horizon."],
              ["👤 Spotlight","Single human figure standing completely alone in total darkness. One beam of light straight down. Deep fog at the edges. Nothing else."],
              ["🌊 Ocean Night","Dark ocean at night. Full moon reflected on the water. Thin horizon line. Stars above. Slow rolling waves."],
              ["🏙 Epic Skyline","Dense city skyline at night from above. Every window blazing gold. Fog at street level. Particles rising like embers."],
              ["🌋 Wasteland","Vast cracked landscape under a dark heavy sky. Weak broken light barely reaching down. Fog closing in. Sparse particles drifting."],
              ["🎭 Empty Stage","Interior darkness. Single spotlight from above onto one figure. Complete black everywhere else. Deep fog at the edges."],
            ].map(([label,p])=>(
              <button key={label} onClick={()=>setPrompt(p)}
                style={{width:"100%",textAlign:"left",background:"#000",border:`1px solid ${GOLDDIM}`,padding:"6px 8px",cursor:"pointer",marginBottom:3,display:"block"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=GOLD}
                onMouseLeave={e=>e.currentTarget.style.borderColor=GOLDDIM}>
                <div style={{color:WHITE,fontSize:10,fontWeight:700}}>{label}</div>
              </button>
            ))}

            <div style={{color:GOLD,fontSize:9,letterSpacing:3,fontWeight:900,marginBottom:6,marginTop:12}}>ACTIVE GRADE</div>
            <div style={{background:grade.bg,border:`1px solid ${grade.fg}`,padding:"8px 10px"}}>
              <div style={{color:grade.fg,fontSize:11,fontWeight:900,marginBottom:4}}>{GRADES.find(g=>g.id===colorGrade)?.label}</div>
              <div style={{display:"flex",gap:4}}>
                {[grade.bg,grade.fg,grade.accent].map((c,i)=>(
                  <div key={i} style={{width:20,height:20,background:c,border:"1px solid #333"}}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====================== FIXED P13 WITH SYNC BUTTON ======================
function P13({ go, mediaLib, timeline, setTimeline }) {
  const [tracks,setTracks]=useState(["VIDEO TRACK","AUDIO TRACK","TEXT / TITLES"]);
  return (
    <div style={{...Sp,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontSize:11,color:GOLD,letterSpacing:4,fontWeight:700}}>EDITING WORKSPACE</div>
          <h1 style={{...H1,fontSize:24,margin:0}}>TIMELINE EDITOR</h1>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setTracks(p=>[...p,`TRACK ${p.length+1}`])} style={{...G("out",true)}}>+ ADD TRACK</button>
          <button onClick={()=>{
            const allAssets=Object.values(timeline).flat();
            if(allAssets.length===0){alert("Add clips to tracks first.");return;}
            const synced={};
            Object.keys(timeline).forEach((k,i)=>{
              synced[k]=(timeline[k]||[]).map(a=>({...a,startTime:0,syncGroup:"master"}));
            });
            setTimeline(synced);
            alert("✓ All tracks synced to master timeline. Same start point. Ready to render.");
          }} style={{...G("gold",true),fontSize:11,letterSpacing:1}}>⚡ SYNC ALL TRACKS</button>
          <button onClick={()=>go(16)} style={{...G("gold",false)}}>→ RENDER</button>
          <button onClick={()=>setTimeline({})} style={{...G("out",true)}}>CLEAR ALL</button>
        </div>
      </div>

      {/* Your original P13 content goes here (preview, tracks, drag & drop, etc.) */}
      {/* Paste the rest of your original P13 code below this point */}
    </div>
  );
}

// Rest of your App component (pages mapping, Header, Footer, etc.) — keep exactly as you had it originally.

export default function App() {
  const [page,setPage]=useState(1);
  const [menu,setMenu]=useState(false);

  const [user,setUser]=useState({name:"Guest",plan:"Guest",isAdmin:false});
  const [mediaLib,setMediaLib]=useState([]);
  const [timeline,setTimeline]=useState({});

  const go=p=>{setPage(p);};

  const saveAsset=a=>setMediaLib(p=>[...p,a]);

  const pages={
    1:<P1 go={go}/>,
    8:<P8VideoGenerator onSave={saveAsset} mediaLib={mediaLib}/>,
    13:<P13 go={go} mediaLib={mediaLib} timeline={timeline} setTimeline={setTimeline}/>,
    // add your other pages here
  };

  return (
    <div style={{background:"#000",minHeight:"100vh",fontFamily:"'Rajdhani',sans-serif"}}>
      <Header go={go} setMenu={setMenu}/>
      {menu&&<QAMenu go={go} onClose={()=>setMenu(false)} user={user}/>}
      <div style={{minHeight:"calc(100vh - 116px)"}}>{pages[page]||<P1 go={go}/>}</div>
      <Footer page={page} go={go} onSave={()=>{}}/>
    </div>
  );
}