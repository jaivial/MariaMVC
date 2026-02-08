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
