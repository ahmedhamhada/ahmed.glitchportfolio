/**
 * ========================================================
 * منطق التفاعل — Ahmed Hamada | Video Editing Portfolio
 * أنيميشن بسيط، استعراض سلس للفيديوهات، وتجربة مستخدم هادية
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  renderProjects();
  initVideoModal();
  initContactActions();
  initScrollReveal();
  initShowreelInteraction();
});

/* --------------------------------------------------------
   1. شريط التنقل والهيدر (Navbar & Scroll Handling)
   -------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // تأثير التمرير الهادئ على الهيدر
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // تحديد القسم الحالي أثناء التمرير
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.desktop-nav a[href*="${sectionId}"]`).forEach(el => {
          el.classList.add('active');
        });
      } else {
        document.querySelectorAll(`.desktop-nav a[href*="${sectionId}"]`).forEach(el => {
          el.classList.remove('active');
        });
      }
    });
  }, { passive: true });

  // فتح وإغلاق قائمة الموبايل
  mobileToggle?.addEventListener('click', () => {
    const isOpen = mobileDrawer?.classList.toggle('open');
    mobileToggle?.classList.toggle('active');
    mobileToggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // إغلاق القائمة عند الضغط على أي رابط
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('open');
      mobileToggle?.classList.remove('active');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // إغلاق القائمة بالضغط على Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      mobileDrawer.classList.remove('open');
      mobileToggle?.classList.remove('active');
      mobileToggle?.setAttribute('aria-expanded', 'false');
    }
  });
}

/* --------------------------------------------------------
   2. عرض المشاريع المختارة (Selected Work Rendering)
   -------------------------------------------------------- */
function renderProjects() {
  const container = document.getElementById('projects-container');
  if (!container || typeof PROJECTS_DATA === 'undefined') return;

  container.innerHTML = PROJECTS_DATA.map((project, index) => {
    const delayClass = `reveal-delay-${(index % 4) + 1}`;
    const isLandscape = project.aspectRatio === '16/9';
    const hasVideo = Boolean(project.videoUrl && !project.videoUrl.includes('youtube.com') && !project.videoUrl.includes('youtu.be') && !project.videoUrl.includes('instagram.com') && project.videoUrl.trim() !== '');

    return `
      <article class="project-card ${isLandscape ? 'card-landscape' : 'card-portrait'} reveal ${delayClass}" data-id="${project.id}">
        <div class="project-thumb-box js-open-project" data-id="${project.id}" tabindex="0" role="button" aria-label="تشغيل ${project.title}">
          ${hasVideo ? `
            <video class="card-video-element" src="${project.videoUrl}#t=0.5" preload="metadata" muted playsinline loop></video>
          ` : `
            <div style="background:#080D14; width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:var(--text-dim);">
              <span>${project.badge || 'فيديو'}</span>
            </div>
          `}
          <div class="project-thumb-overlay">
            <div class="project-tags-top">
              <span class="project-badge-cat">${project.categoryName}</span>
              <span class="media-badge" style="font-family:monospace; direction:ltr;">${project.duration}</span>
            </div>
            <div class="project-play-btn" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <div class="project-tags-bottom">
              <span class="media-badge" style="background:rgba(11,15,23,0.85);">${project.badge}</span>
            </div>
          </div>
        </div>
        <div class="project-info">
          <h3 class="project-title">${project.title}</h3>
          <div class="project-actions">
            <button type="button" class="btn-watch-link js-open-project" data-id="${project.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>مشاهدة الفيديو</span>
            </button>
            <span class="project-category-tag">${project.categoryName}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // تفاعل المعاينة الهادئة عند تمرير الماوس فوق كارت الفيديو (Silent Hover Preview)
  container.querySelectorAll('.project-card').forEach(card => {
    const video = card.querySelector('video.card-video-element');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0.5;
    });
  });
}

/* --------------------------------------------------------
   3. نافذة استعراض الفيديو المنبثقة (Video Modal Player)
   -------------------------------------------------------- */
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalMediaWrap = document.getElementById('modal-media-wrap');
  const modalFooterText = document.getElementById('modal-footer-text');

  function openModal(title, contentHtml, footerHtml = '') {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalMediaWrap) modalMediaWrap.innerHTML = contentHtml;
    if (modalFooterText) modalFooterText.innerHTML = footerHtml;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // إيقاف تشغيل الفيديو عند الإغلاق لتجنب استمرار الصوت
    if (modalMediaWrap) {
      modalMediaWrap.innerHTML = '';
    }
  }

  // الضغط على Showreel في قسم الهيرو
  document.querySelectorAll('.js-open-showreel').forEach(el => {
    el.addEventListener('click', () => {
      openModal(
        'Showreel 2025 | أحمد حمادة',
        `
        <div style="width:100%; display:flex; justify-content:center; background:#000;">
          <video src="assets/reel-1.mp4" controls autoplay playsinline style="max-height:65vh; max-width:100%; border-radius:6px;"></video>
        </div>
        `,
        `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; flex-wrap:wrap; gap:10px;">
          <span style="color:var(--text-muted); font-size:0.86rem;">استعراض المونتاج وإيقاع التقطيع • أحمد حمادة</span>
          <a href="#contact" class="btn btn-primary btn-sm" id="modal-start-project">تواصل لبدء مشروعك</a>
        </div>
        `
      );

      document.getElementById('modal-start-project')?.addEventListener('click', () => {
        closeModal();
      });
    });
  });

  // الضغط على أي كارت مشروع في المعرض
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.js-open-project');
    if (!trigger) return;

    const projectId = parseInt(trigger.dataset.id, 10);
    const project = (typeof PROJECTS_DATA !== 'undefined') ? PROJECTS_DATA.find(p => p.id === projectId) : null;
    if (!project) return;

    if (project.videoUrl && project.videoUrl.trim() !== '') {
      let videoEmbed = '';
      const isLandscape = project.aspectRatio === '16/9';
      if (project.videoUrl.includes('youtube.com') || project.videoUrl.includes('youtu.be')) {
        videoEmbed = `<iframe src="${project.videoUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:460px; border:none; border-radius:10px;"></iframe>`;
      } else if (project.videoUrl.includes('instagram.com')) {
        videoEmbed = `<iframe src="${project.videoUrl}" allowfullscreen style="width:100%; height:460px; border:none; border-radius:10px;"></iframe>`;
      } else {
        videoEmbed = `
        <div style="width:100%; display:flex; justify-content:center; align-items:center; background:#000; padding:10px; border-radius:12px;">
          <video src="${project.videoUrl}" controls autoplay playsinline style="${isLandscape ? 'max-height:72vh; width:100%; max-width:860px; aspect-ratio:16/9;' : 'max-height:75vh; aspect-ratio:9/16; width:auto;'} border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,0.6);"></video>
        </div>
        `;
      }
      openModal(
        project.title,
        videoEmbed,
        `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%; flex-wrap:wrap; gap:12px;">
          <span style="font-size:0.84rem; color:var(--accent-yellow); font-weight:700;">${project.role}</span>
          <a href="https://wa.me/201280370806?text=${encodeURIComponent('أهلًا أحمد، شفت نموذج: ' + project.title + ' في البورتفوليو وحابب أعمل فيديو مشابه لمحتواي.')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
            تحدث معي حول هذا النموذج
          </a>
        </div>
        `
      );
    } else {
      openModal(
        project.title,
        `
        <div style="display:flex; flex-direction:column; align-items:center; padding:32px 20px; text-align:center; max-width:520px; margin:0 auto;">
          <div style="width:140px; aspect-ratio:9/16; border-radius:12px; overflow:hidden; border:2px solid var(--primary-blue); margin-bottom:18px;">
            <img src="${project.thumbnail || 'assets/story.jpeg'}" alt="${project.title}" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <h4 style="font-size:1.2rem; font-weight:800; margin-bottom:8px; color:var(--text-main);">${project.title}</h4>
          <span style="font-size:0.8rem; color:var(--accent-yellow); font-weight:700; margin-bottom:12px;">${project.categoryName} • ${project.duration}</span>
          <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.7; margin-bottom:18px;">${project.description}</p>
          <div style="background:rgba(11,15,23,0.7); border:1px solid var(--border-subtle); border-radius:8px; padding:12px 16px; width:100%; text-align:right;">
            <div style="font-size:0.75rem; color:var(--accent-yellow); font-weight:700; margin-bottom:4px;">دوري في المشروع:</div>
            <div style="font-size:0.84rem; color:var(--text-main);">${project.role}</div>
          </div>
        </div>
        `,
        `
        <a href="https://wa.me/201280370806?text=${encodeURIComponent('أهلًا أحمد، عجبني نموذج: ' + project.title + ' وحابب أسألك عن تفاصيل مشابهة.')}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
          تحدث معي حول هذا النوع
        </a>
        `
      );
    }
  });

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------
   4. التفاعل مع وسائل التواصل ونسخ الرقم (Contact Actions)
   -------------------------------------------------------- */
function initContactActions() {
  const copyBtn = document.getElementById('copy-phone-btn');
  const toast = document.getElementById('toast-notice');
  const toastText = document.getElementById('toast-text');
  const whatsappMainBtn = document.getElementById('whatsapp-main-btn');
  const topicChips = document.querySelectorAll('.topic-chip');

  const phoneNumber = '01280370806';
  const baseWhatsAppUrl = 'https://wa.me/201280370806';
  const defaultMessage = 'أهلًا أحمد، شفت البورتفوليو وحابب أتكلم معاك عن مشروع مونتاج.';

  copyBtn?.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(phoneNumber);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = phoneNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showToast('تم نسخ رقم الواتساب: ' + phoneNumber);
    } catch (err) {
      showToast('رقم الواتساب: ' + phoneNumber);
    }
  });

  function showToast(msg) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // تخصيص رسالة الواتساب عند اختيار العميل لمجال الاهتمام
  topicChips.forEach(chip => {
    chip.addEventListener('click', () => {
      topicChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const topic = chip.dataset.topic;
      let customizedMsg = defaultMessage;

      if (topic === 'reels') {
        customizedMsg = 'أهلًا أحمد، شفت البورتفوليو وحابب أتكلم معاك عن خدمة مونتاج ريلز وفيديوهات قصيرة.';
      } else if (topic === 'script') {
        customizedMsg = 'أهلًا أحمد، شفت البورتفوليو ومحتاج مساعدة في كتابة سكريبت وتنظيم فكرة محتوى قابلة للتصوير.';
      } else if (topic === 'ideas') {
        customizedMsg = 'أهلًا أحمد، عندي براند شخصي ومحتاج أفكار محتوى وزوايا جديدة تناسب مجالي.';
      } else if (topic === 'podcast') {
        customizedMsg = 'أهلًا أحمد، عندي بودكاست وحابب أستخرج منه مقاطع ريلز قصيرة وجذابة.';
      }

      if (whatsappMainBtn) {
        whatsappMainBtn.href = `${baseWhatsAppUrl}?text=${encodeURIComponent(customizedMsg)}`;
      }
    });
  });
}

/* --------------------------------------------------------
   5. أنيميشن الظهور الانسيابي (Scroll Reveal Observer)
   -------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }
}

/* --------------------------------------------------------
   6. التفاعل مع عرض الشوريل ومؤشر الصوت (Showreel Interaction)
   -------------------------------------------------------- */
function initShowreelInteraction() {
  const showreelCard = document.querySelector('.showreel-card');
  const eqBars = document.querySelectorAll('.eq-bar');

  if (!showreelCard || !eqBars.length) return;

  showreelCard.addEventListener('mouseenter', () => {
    eqBars.forEach((bar, i) => {
      bar.style.animationDuration = `${0.6 + (i % 3) * 0.2}s`;
    });
  });

  showreelCard.addEventListener('mouseleave', () => {
    eqBars.forEach(bar => {
      bar.style.animationDuration = '';
    });
  });
}
