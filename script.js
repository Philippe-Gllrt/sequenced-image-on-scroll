gsap.registerPlugin(ScrollTrigger);

// === CONFIGURATION ===
const frameCount = 540;
const framePath = index => `https://cdn.jsdelivr.net/gh/Philippe-Gllrt/sequenced-image-on-scroll@latest/frames/${String(index).padStart(4, '0')}.webp`;

const canvas = document.getElementById('sequence-canvas');
const context = canvas.getContext('2d');

const images = [];
let currentFrameIndex = { frame: 0 };

const DPR = window.devicePixelRatio || 1;
canvas.width = window.innerWidth * DPR;
canvas.height = window.innerHeight * DPR;
context.scale(DPR, DPR);

// === PRELOAD IMAGES ===
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = framePath(i);
  images.push(img);
}

// === RENDER FRAME FUNCTION ===
function render() {
  const img = images[Math.floor(currentFrameIndex.frame)];
  if (!img || !img.complete) return;

  context.clearRect(0, 0, canvas.width, canvas.height);

  const ratio = img.width / img.height;
  const canvasRatio = canvas.width / canvas.height;

  let drawWidth = canvas.width / DPR;
  let drawHeight = canvas.height / DPR;
  let offsetX = 0, offsetY = 0;

  if (canvasRatio > ratio) {
    drawHeight = drawWidth / ratio;
    offsetY = (canvas.height / DPR - drawHeight) / 2;
  } else {
    drawWidth = drawHeight * ratio;
    offsetX = (canvas.width / DPR - drawWidth) / 2;
  }

  context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// === SCROLLTRIGGER + GSAP ===
gsap.registerPlugin(ScrollTrigger);

gsap.to(currentFrameIndex, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: ".sequence-section",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    onUpdate: render
  }
});

// Initial frame render when first image loads
images[0].onload = render;

// === LENIS SMOOTH SCROLL ===
const lenis = new Lenis({
  lerp: 0.05, // feel free to adjust
  smooth: true
});

lenis.on('scroll', ScrollTrigger.update);

// Use GSAP’s ticker to run Lenis smoothly
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// === RESPONSIVE ===
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth * DPR;
  canvas.height = window.innerHeight * DPR;
  context.scale(DPR, DPR);
  render();
});

