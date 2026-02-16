/* ============================================
   App.js - UI Interactions & Animations
   S&P 500 Market Intelligence
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // Reading Progress Bar
  // ============================================
  const progressBar = document.querySelector('.reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + '%';
    });
  }

  // ============================================
  // Scroll Animations (Intersection Observer)
  // ============================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger child animations
        const children = entry.target.querySelectorAll('[data-delay]');
        children.forEach(function(child) {
          const delay = child.getAttribute('data-delay');
          child.style.transitionDelay = delay + 'ms';
          child.classList.add('visible');
        });
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(function(el) {
    observer.observe(el);
  });

  // ============================================
  // Smooth Navigation
  // ============================================
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 70; // nav height
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      // Update active state
      navLinks.forEach(function(l) { l.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(function(section) {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // ============================================
  // Tab Switching
  // ============================================
  const tabGroups = document.querySelectorAll('.tabs');
  tabGroups.forEach(function(group) {
    const tabs = group.querySelectorAll('.tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        const targetId = this.getAttribute('data-tab');
        const parent = this.closest('.section, .card, .chart-container') || document;

        // Update tabs
        tabs.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');

        // Update content
        const panels = parent.querySelectorAll('.tab-panel');
        panels.forEach(function(panel) {
          panel.style.display = panel.id === targetId ? 'block' : 'none';
        });
      });
    });
  });

  // ============================================
  // Counter Animation
  // ============================================
  function animateCounter(element, target, duration) {
    const start = 0;
    const startTime = performance.now();
    const suffix = element.getAttribute('data-suffix') || '';
    const prefix = element.getAttribute('data-prefix') || '';
    const decimals = parseInt(element.getAttribute('data-decimals')) || 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease out quart
      const current = start + (target - start) * eased;

      element.textContent = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Observe counters
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseFloat(entry.target.getAttribute('data-counter'));
        animateCounter(entry.target, target, 1500);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(counter) {
    counterObserver.observe(counter);
  });

  // ============================================
  // Stat Bar Animations
  // ============================================
  const statBars = document.querySelectorAll('.stat-bar-fill');
  const barObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
      }
    });
  }, { threshold: 0.3 });

  statBars.forEach(function(bar) {
    bar.style.width = '0%';
    barObserver.observe(bar);
  });

  // ============================================
  // Risk Meter Animation
  // ============================================
  const riskNeedle = document.querySelector('.risk-meter-needle');
  if (riskNeedle) {
    const riskObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const position = riskNeedle.getAttribute('data-position');
          riskNeedle.style.left = position + '%';
        }
      });
    }, { threshold: 0.5 });
    riskObserver.observe(riskNeedle.parentElement);
  }

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navLinksContainer = document.querySelector('.nav-links');
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', function() {
      navLinksContainer.classList.toggle('mobile-open');
      this.textContent = navLinksContainer.classList.contains('mobile-open') ? '\u2715' : '\u2630';
    });
  }

  // ============================================
  // Tooltip for data points
  // ============================================
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  tooltipTriggers.forEach(function(trigger) {
    trigger.addEventListener('mouseenter', function() {
      const text = this.getAttribute('data-tooltip');
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = text;
      tooltip.style.cssText = 'position:absolute;background:rgba(0,0,0,0.9);color:#f5f5f7;padding:8px 12px;border-radius:8px;font-size:12px;pointer-events:none;z-index:9999;border:1px solid rgba(255,255,255,0.1);max-width:250px;';
      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 8 + window.scrollY) + 'px';
      tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';

      this._tooltip = tooltip;
    });

    trigger.addEventListener('mouseleave', function() {
      if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
      }
    });
  });

  // ============================================
  // Print-friendly date
  // ============================================
  // Nav date: show current date
  const navDateElements = document.querySelectorAll('.nav-date');
  const now = new Date();
  const navDateStr = now.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  navDateElements.forEach(function(el) {
    el.textContent = navDateStr;
  });

  // Report date: hardcoded to the report's publication date
  const reportDateElements = document.querySelectorAll('.report-date');
  reportDateElements.forEach(function(el) {
    el.textContent = 'February 13, 2026';
  });

});
