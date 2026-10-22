// main.js

document.addEventListener("DOMContentLoaded", function() {
  // Reveal on scroll
  const revealElements = document.querySelectorAll('.reveal');
  const revealOptions = { threshold: 0.1 };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, revealOptions);
  revealElements.forEach(el => revealObserver.observe(el));

  // Skill bar animation
  const skillBars = document.querySelectorAll('.bar');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const skillValue = bar.getAttribute('data-skill');
        // Animate from 0% to the data-skill value
        bar.style.width = skillValue + '%';
      }
    });
  }, { threshold: 0.1 });
  skillBars.forEach(bar => barObserver.observe(bar));

  // Carousel Setup
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // The gallery is present only on the Projects page.
  if (!carousel || !prevBtn || !nextBtn) return;

  // Array to store media paths (images & videos)
  const mediaPaths = [
    { type: 'image', src: '../assets/projects/project1.jpg' },
    { type: 'image', src: '../assets/projects/project2.jpg' },
    { type: 'image', src: '../assets/projects/project3.jpg' },
    { type: 'image', src: '../assets/projects/project4.jpg' },
    { type: 'image', src: '../assets/projects/project5.jpg' },
    { type: 'video', src: '../assets/video/demo1.mp4' },
    { type: 'video', src: '../assets/video/demo2.mp4' }
  ];

  let currentIndex = 0;

  // Load media into the carousel
  function loadMedia() {
    carousel.innerHTML = ''; // Clear previous media
    mediaPaths.forEach((media) => {
      let mediaElement;

      if (media.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = media.src;
        mediaElement.alt = 'Project Image';
      } else if (media.type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.src = media.src;
        mediaElement.muted = true; // Mute video
        mediaElement.loop = true; // Loop video
        mediaElement.autoplay = true; // Autoplay video
        mediaElement.controls = false; // Hide controls
      }

      mediaElement.classList.add('carousel-item');
      carousel.appendChild(mediaElement);
    });

    updateCarousel();
  }

  // Update carousel position
  function updateCarousel() {
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
  }

  // Next Button
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % mediaPaths.length;
    updateCarousel();
  });

  // Previous Button
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + mediaPaths.length) % mediaPaths.length;
    updateCarousel();
  });

// Initialize carousel
loadMedia();
});