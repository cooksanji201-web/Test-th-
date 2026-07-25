// ===== TUỲ CHỈNH LỜI NHẮN Ở ĐÂY =====
const introLine = "Xin em đừng vội lướt đi…";
const storyLines = [
  "Có hàng tỷ người trên thế giới…",
  "Và vô số lần gặp gỡ tưởng như rất bình thường.",
  "Nhưng giữa tất cả những điều ngẫu nhiên ấy…",
  "Anh lại may mắn gặp được em.",
  "Từ lúc đó, những ngày bình thường của anh bỗng trở nên đáng nhớ hơn.",
  "Cảm ơn em vì đã xuất hiện."
];
// ======================================

const intro = document.getElementById("intro");
const story = document.getElementById("story");
const question = document.getElementById("question");
const finalScene = document.getElementById("final");
const introText = document.getElementById("introText");
const storyText = document.getElementById("storyText");
const startBtn = document.getElementById("startBtn");
const yesBtn = document.getElementById("yesBtn");
const maybeBtn = document.getElementById("maybeBtn");
const maybeNote = document.getElementById("maybeNote");
const secret = document.getElementById("tapSecret");
const musicBtn = document.getElementById("musicBtn");

let maybeCount = 0;
let tapCount = 0;
let secretTimer;
let audioCtx;
let musicOn = false;

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function typeText(el, text, speed=48){
  el.textContent = "";
  for(const ch of text){
    el.textContent += ch;
    await sleep(ch === "…" ? 220 : speed);
  }
}

function showScene(el){
  document.querySelectorAll(".scene").forEach(s => s.classList.remove("active"));
  el.classList.add("active");
}

async function begin(){
  startBtn.style.opacity = "0";
  startBtn.style.pointerEvents = "none";
  await typeText(introText, introLine, 52);
  await sleep(1100);
  showScene(story);
  for(const line of storyLines){
    await typeText(storyText, line, 43);
    await sleep(1350);
    storyText.style.opacity = "0";
    await sleep(420);
    storyText.textContent = "";
    storyText.style.opacity = "1";
  }
  showScene(question);
}

startBtn.addEventListener("click", begin);

maybeBtn.addEventListener("click", () => {
  maybeCount++;
  const notes = [
    "Suy nghĩ kỹ nhé… nhưng đừng lâu quá nha 🥺",
    "Anh vẫn đang chờ câu trả lời đó…",
    "Hay là mình thử cho nhau một cơ hội nhé?",
    "Nút này hình như không muốn bị bấm nữa rồi 😳"
  ];
  maybeNote.textContent = notes[Math.min(maybeCount - 1, notes.length - 1)];

  if(maybeCount >= 2){
    const maxX = Math.max(20, window.innerWidth - maybeBtn.offsetWidth - 20);
    const maxY = Math.max(20, window.innerHeight - maybeBtn.offsetHeight - 20);
    maybeBtn.style.position = "fixed";
    maybeBtn.style.left = Math.random() * maxX + "px";
    maybeBtn.style.top = Math.random() * maxY + "px";
    maybeBtn.style.zIndex = "10";
  }
});

yesBtn.addEventListener("click", () => {
  showScene(finalScene);
  launchCelebration();
});

document.addEventListener("click", () => {
  tapCount++;
  clearTimeout(secretTimer);
  secretTimer = setTimeout(() => tapCount = 0, 1800);
  if(tapCount >= 5){
    secret.classList.add("show");
    setTimeout(() => secret.classList.remove("show"), 4200);
    tapCount = 0;
  }
});

// Matrix background
const matrixCanvas = document.getElementById("matrix");
const mctx = matrixCanvas.getContext("2d");
let mw, mh, columns, drops, fontSize;

function resizeMatrix(){
  const dpr = Math.min(devicePixelRatio || 1, 2);
  mw = innerWidth; mh = innerHeight;
  matrixCanvas.width = mw * dpr;
  matrixCanvas.height = mh * dpr;
  matrixCanvas.style.width = mw + "px";
  matrixCanvas.style.height = mh + "px";
  mctx.setTransform(dpr,0,0,dpr,0,0);
  fontSize = Math.max(14, Math.min(20, mw / 38));
  columns = Math.ceil(mw / fontSize);
  drops = Array.from({length:columns}, () => Math.random() * -90);
  mctx.font = fontSize + "px monospace";
}
function drawMatrix(){
  mctx.fillStyle = "rgba(2,4,3,.09)";
  mctx.fillRect(0,0,mw,mh);
  mctx.fillStyle = "#41f873";
  const chars = "アイウエオカキクケコサシスセソ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for(let i=0;i<drops.length;i++){
    const ch = chars[Math.floor(Math.random()*chars.length)];
    const x = i*fontSize, y = drops[i]*fontSize;
    mctx.fillText(ch,x,y);
    if(y>mh && Math.random()>.975) drops[i]=0;
    drops[i]+=0.72+Math.random()*.5;
  }
  requestAnimationFrame(drawMatrix);
}

// Celebration particles
const fx = document.getElementById("fx");
const fctx = fx.getContext("2d");
let fw, fh, particles = [], hearts = [];
function resizeFx(){
  const dpr = Math.min(devicePixelRatio || 1, 2);
  fw = innerWidth; fh = innerHeight;
  fx.width = fw*dpr; fx.height = fh*dpr;
  fx.style.width = fw+"px"; fx.style.height = fh+"px";
  fctx.setTransform(dpr,0,0,dpr,0,0);
}
function launchCelebration(){
  for(let i=0;i<180;i++){
    const a=Math.random()*Math.PI*2, s=2+Math.random()*7;
    particles.push({x:fw/2,y:fh*.45,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:80+Math.random()*60,size:2+Math.random()*4});
  }
  for(let i=0;i<45;i++){
    hearts.push({x:Math.random()*fw,y:fh+Math.random()*300,vy:1+Math.random()*2.4,size:16+Math.random()*26,life:220+Math.random()*120});
  }
}
function drawFx(){
  fctx.clearRect(0,0,fw,fh);
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.life--;
    fctx.globalAlpha=Math.max(0,p.life/120);
    fctx.fillStyle=`hsl(${Math.random()*360} 90% 65%)`;
    fctx.beginPath();fctx.arc(p.x,p.y,p.size,0,Math.PI*2);fctx.fill();
  });
  hearts.forEach(h=>{
    h.y-=h.vy;h.life--;
    fctx.globalAlpha=Math.max(0,h.life/240);
    fctx.font=h.size+"px serif";
    fctx.fillText("❤",h.x,h.y);
  });
  particles=particles.filter(p=>p.life>0);
  hearts=hearts.filter(h=>h.life>0);
  fctx.globalAlpha=1;
  requestAnimationFrame(drawFx);
}

// simple ambient music generated in browser, no audio file needed
function toggleMusic(){
  if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  musicOn = !musicOn;
  musicBtn.textContent = musicOn ? "♪" : "♫";
  if(musicOn) playAmbient();
}
function playAmbient(){
  if(!musicOn || !audioCtx) return;
  const now=audioCtx.currentTime;
  const notes=[261.63,329.63,392,523.25];
  notes.forEach((freq,i)=>{
    const osc=audioCtx.createOscillator();
    const gain=audioCtx.createGain();
    osc.type="sine";osc.frequency.value=freq;
    gain.gain.setValueAtTime(0,now+i*.45);
    gain.gain.linearRampToValueAtTime(.035,now+i*.45+.15);
    gain.gain.exponentialRampToValueAtTime(.001,now+i*.45+1.8);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(now+i*.45);osc.stop(now+i*.45+1.9);
  });
  setTimeout(playAmbient,2200);
}
musicBtn.addEventListener("click", toggleMusic);

addEventListener("resize",()=>{resizeMatrix();resizeFx()});
resizeMatrix();resizeFx();drawMatrix();drawFx();
