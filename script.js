// ===============================
// PAGE LOADER
// ===============================
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('loaded'), 250);
  }
});

// ===============================
// MOBILE MENU
// ===============================
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

// close mobile menu after clicking a link
document.querySelectorAll('nav ul li a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
  });
});

// ===============================
// REVEAL ANIMATION
// ===============================
const reveals = document.querySelectorAll('.reveal');

window.addEventListener('scroll', revealFunction);

function revealFunction() {
  const windowHeight = window.innerHeight;
  const revealPoint = 100;

  for (let i = 0; i < reveals.length; i++) {
    const revealTop = reveals[i].getBoundingClientRect().top;

    if (revealTop < windowHeight - revealPoint) {
      reveals[i].classList.add('active');
    }
  }
}

revealFunction();

// ===============================
// HEADER BACKGROUND ON SCROLL
// ===============================
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');

  if (window.scrollY > 50) {
    header.style.background = 'rgba(20,3,7,0.92)';
  } else {
    header.style.background = 'rgba(20,3,7,0.55)';
  }
});

// ===============================
// BACK TO TOP BUTTON
// ===============================
const toTopBtn = document.getElementById('toTopBtn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    toTopBtn.classList.add('show');
  } else {
    toTopBtn.classList.remove('show');
  }
});

toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===============================
// ACTIVE NAV LINK ON SCROLL
// ===============================
const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active-link');
    }
  });
});

// ===============================
// GALLERY MASONRY (auto row-span based on real image aspect ratio)
// ===============================
const galleryGrid = document.getElementById('galleryGrid');

function resizeGalleryItem(item) {
  const grid = galleryGrid;
  const rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')
  );
  const rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue('gap')
  );
  const img = item.querySelector('img');
  if (!img) return;

  const itemHeight = img.getBoundingClientRect().height;
  const rowSpan = Math.ceil((itemHeight + rowGap) / (rowHeight + rowGap));
  item.style.gridRowEnd = `span ${rowSpan}`;
}

function resizeAllGalleryItems() {
  if (!galleryGrid) return;
  const items = galleryGrid.querySelectorAll('.gallery-item');
  items.forEach((item) => {
    const img = item.querySelector('img');
    if (img.complete) {
      resizeGalleryItem(item);
    } else {
      img.addEventListener('load', () => resizeGalleryItem(item));
    }
  });
}

resizeAllGalleryItems();
window.addEventListener('resize', () => {
  clearTimeout(window.__galleryResizeTimer);
  window.__galleryResizeTimer = setTimeout(resizeAllGalleryItems, 200);
});

// re-layout whenever hidden items are revealedconst galleryToggleBtn = document.getElementById('galleryToggleBtn');

if (galleryToggleBtn) {
    galleryToggleBtn.addEventListener('click', () => {

        const allItems = galleryGrid.querySelectorAll('.gallery-item');
        const isShowingAll =
            galleryToggleBtn.classList.contains('showing-all');

        allItems.forEach((item, index) => {

            // First 9 images are always visible
            if (index >= 9) {
                if (isShowingAll) {
                    // Hide extra images
                    item.classList.add('gallery-hidden');
                    item.classList.remove('active');
                } else {
                    // Show extra images
                    item.classList.remove('gallery-hidden');
                    item.classList.add('reveal');

                    requestAnimationFrame(() => {
                        item.classList.add('active');
                    });
                }
            }

        });

        galleryToggleBtn.classList.toggle('showing-all');

        if (!isShowingAll) {
            galleryToggleBtn.querySelector('span').textContent =
                'View Less Photos';

            galleryToggleBtn.querySelector('i').style.transform =
                'rotate(180deg)';

        } else {
            galleryToggleBtn.querySelector('span').textContent =
                'View More Photos';

            galleryToggleBtn.querySelector('i').style.transform =
                'rotate(0deg)';
        }

        setTimeout(resizeAllGalleryItems, 60);
        setTimeout(resizeAllGalleryItems, 400);
    });
}

// ===============================
// LIGHTBOX
// ===============================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let galleryImages = [];
let currentImageIndex = 0;

function refreshGalleryImagesList() {
  galleryImages = Array.from(galleryGrid.querySelectorAll('.gallery-item img'));
}

function openLightbox(index) {
  refreshGalleryImagesList();
  currentImageIndex = index;
  const img = galleryImages[currentImageIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showNextImage(direction) {
  refreshGalleryImagesList();
  // only cycle through currently visible images
  const visibleImages = galleryImages.filter((img) => {
    const item = img.closest('.gallery-item');
    return !item.classList.contains('gallery-hidden');
  });

  let idx = visibleImages.findIndex((img) => img.src === lightboxImg.src);
  idx = (idx + direction + visibleImages.length) % visibleImages.length;
  lightboxImg.src = visibleImages[idx].src;
  lightboxImg.alt = visibleImages[idx].alt;
}

if (galleryGrid) {
  galleryGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    refreshGalleryImagesList();
    const img = item.querySelector('img');
    const index = galleryImages.indexOf(img);
    openLightbox(index);
  });
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', () => showNextImage(-1));
if (lightboxNext) lightboxNext.addEventListener('click', () => showNextImage(1));

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showNextImage(-1);
  if (e.key === 'ArrowRight') showNextImage(1);
});

// ===============================
// REELS: play one at a time
// ===============================
const reelCards = document.querySelectorAll('.reel-card:not(.reel-more)');

reelCards.forEach((card) => {
  const video = card.querySelector('.reel-video');
  const playBtn = card.querySelector('.reel-play-btn');
  const overlay = card.querySelector('.reel-play-overlay');

  const playThisVideo = () => {
    // pause every other reel video first
    reelCards.forEach((otherCard) => {
      if (otherCard !== card) {
        const otherVideo = otherCard.querySelector('.reel-video');
        otherVideo.pause();
        otherCard.classList.remove('playing');
      }
    });

    video.play();
  };

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playThisVideo();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      if (video.paused) {
        playThisVideo();
      } else {
        video.pause();
      }
    });
  }

  video.addEventListener('play', () => {
    card.classList.add('playing');
    // ensure only one plays
    reelCards.forEach((otherCard) => {
      if (otherCard !== card) {
        otherCard.querySelector('.reel-video').pause();
        otherCard.classList.remove('playing');
      }
    });
  });

  video.addEventListener('pause', () => {
    card.classList.remove('playing');
  });

  video.addEventListener('ended', () => {
    card.classList.remove('playing');
  });
});

// ===============================
// DATE PICKER (jQuery UI)
// ===============================
if (window.jQuery && jQuery.fn.datepicker) {
  jQuery(function ($) {
    $('#datepicker').datepicker({
      minDate: 0,
      dateFormat: 'dd-mm-yy',
    });
  });
}

// ===============================
// ACADEMY "ENROLL NOW" -> prefill contact form
// ===============================
document.querySelectorAll('.enroll-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const course = btn.getAttribute('data-course');
    const occasionSelect = document.getElementById('occasion');
    if (occasionSelect && course) {
      occasionSelect.value = course;
    }
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });
});

// ===============================
// BOOKING FORM -> SEND DETAILS TO WHATSAPP
// ===============================
const form = document.getElementById('bookingForm');
const OWNER_WHATSAPP_NUMBER = '919461287664'; // country code + number, no + or spaces

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const date = document.getElementById('datepicker').value.trim();
  const occasion = document.getElementById('occasion').value.trim();
  const venue = document.getElementById('venue').value.trim();
  const requirements = document.getElementById('requirements').value.trim();

  if (phone.replace(/\D/g, '').length < 10) {
    alert('Please enter a valid contact number');
    return;
  }

  if (!occasion) {
    alert('Please select an occasion or course');
    return;
  }

  const message =
    `*New Booking Request — Knu Makeovers & Academy*\n\n` +
    `*Name:* ${name}\n` +
    `*Email:* ${email}\n` +
    `*Phone:* ${phone}\n` +
    `*Occasion / Course:* ${occasion}\n` +
    (date ? `*Date:* ${date}\n` : '') +
    `*Venue:* ${venue}\n` +
    (requirements ? `*Requirements:* ${requirements}\n` : '');

  const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, '_blank');

  form.reset();
});
