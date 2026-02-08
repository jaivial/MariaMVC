const header = document.querySelector('.site-header');
const reveals = document.querySelectorAll('.reveal');

const onScroll = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 16);
};

onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.14 }
);
reveals.forEach((el) => io.observe(el));

// Rellax parallax layers
if (window.Rellax) {
  // eslint-disable-next-line no-new
  new Rellax('.parallax-layer', { center: true, round: true });
}

// Image parallax motion
if (window.simpleParallax) {
  const imgs = document.querySelectorAll('.parallax-image');
  if (imgs.length) {
    // eslint-disable-next-line no-new
    new simpleParallax(imgs, {
      scale: 1.12,
      delay: 0.4,
      orientation: 'up',
      overflow: true,
    });
  }
}

// Three.js ambient particles canvas
if (window.THREE) {
  const canvas = document.getElementById('three-hero-canvas');
  if (canvas) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000);
    camera.position.z = 4;

    const geometry = new THREE.BufferGeometry();
    const pointsCount = 260;
    const positions = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = (Math.random() - 0.5) * 6;
      positions[i + 2] = (Math.random() - 0.5) * 6;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xd6aa6a,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      particles.rotation.y += 0.0012;
      particles.rotation.x += 0.0006;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
  }
}
