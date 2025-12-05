/* main.js - interaction & animations */

document.addEventListener('DOMContentLoaded', function(){

  // 1. Initialize 3D Background (Three.js)
  initThreeJS();

  // 2. AOS (Scroll Animations)
  if(window.AOS) AOS.init({ duration: 800, once: true, offset: 100 });

  // 3. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if(menuToggle){
    menuToggle.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));
  }

  // 4. Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        mobileMenu.classList.add('hidden'); // Close menu on click
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // 5. Product Filter Logic
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', () => {
      // Style updates
      document.querySelectorAll('.filter-btn').forEach(b=> {
        b.classList.remove('bg-red-600','text-white','shadow-md');
        b.classList.add('bg-gray-100','text-gray-600');
      });
      btn.classList.remove('bg-gray-100','text-gray-600');
      btn.classList.add('bg-red-600','text-white','shadow-md');

      // Filtering logic
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('#productGrid > div').forEach(card=>{
        const cat = card.getAttribute('data-category') || 'all';
        if(filter==='all' || filter === cat){
          card.style.display = '';
          // Reset animation
          card.classList.remove('aos-animate');
          setTimeout(()=> card.classList.add('aos-animate'), 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Number Counters
  const counters = document.querySelectorAll('.counter');
  const runCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const duration = 1500;
    let start = 0;
    const step = (timestamp) => {
      start += Math.ceil(target / (duration / 16));
      if(start >= target) start = target;
      el.textContent = start.toLocaleString();
      if(start < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        runCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => obs.observe(c));

  // 7. Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const form = new FormData(contactForm);
      const name = form.get('name') || '';
      const email = form.get('email') || '';
      const message = form.get('message') || '';
      
      const subject = encodeURIComponent('Inquiry from ' + name);
      const body = encodeURIComponent('Name: '+name+'\nEmail: '+email+'\n\nMessage:\n'+message);
      
      // Open Mail Client
      window.location.href = `mailto:chandufiresafetyhsn@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});

/**
 * THREE.JS INTERACTIVE BACKGROUND
 * Creates a floating particle mesh that rotates and reacts to mouse.
 */
function initThreeJS() {
  const container = document.getElementById('three-canvas-container');
  if(!container) return;

  // Scene Setup
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Geometry: Particles
  const geometry = new THREE.BufferGeometry();
  const count = 600;
  const posArray = new Float32Array(count * 3);

  for(let i = 0; i < count * 3; i++) {
    // Spread particles wide
    posArray[i] = (Math.random() - 0.5) * 60; 
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Material (Red Points)
  const material = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xcc0000, // Brand Red
    transparent: true,
    opacity: 0.8,
  });

  // Mesh
  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  // Mouse Interaction Variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Automatic smooth rotation
    particlesMesh.rotation.y += 0.002;
    particlesMesh.rotation.x += 0.001;

    // Interactive easing rotation based on mouse
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
