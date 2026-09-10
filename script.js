/**
 * Yuvraj — Portfolio Interactivity & Live Showcase Simulation
 * Production-ready, zero dependencies, protected against duplicate execution
 */

(function () {
  "use strict";

  // Prevent multiple initializations if script is loaded multiple times
  if (window.__PORTFOLIO_INIT_DONE__) return;
  window.__PORTFOLIO_INIT_DONE__ = true;

  function initPortfolio() {
    const htmlRoot = document.documentElement;

    // ------------------------------------------------------------------------
    // 1. Theme Management (Day / Night Switcher)
    // ------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function getPreferredTheme() {
      try {
        const stored = localStorage.getItem("portfolio-theme");
        if (stored === "light" || stored === "dark") return stored;
      } catch (e) {}
      try {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
          return "light";
        }
      } catch (e) {}
      return "dark";
    }

    function applyTheme(targetTheme) {
      const theme = targetTheme === "light" ? "light" : "dark";
      htmlRoot.setAttribute("data-theme", theme);

      try {
        localStorage.setItem("portfolio-theme", theme);
      } catch (e) {}

      try {
        if (themeMeta) {
          themeMeta.setAttribute("content", theme === "light" ? "#f8fafc" : "#0a0c10");
        }
      } catch (e) {}
    }

    // Initialize theme state
    applyTheme(getPreferredTheme());

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const currentTheme = htmlRoot.getAttribute("data-theme") === "light" ? "light" : "dark";
        const nextTheme = currentTheme === "light" ? "dark" : "light";
        applyTheme(nextTheme);
      });
    }

    try {
      if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (e) {
          try {
            if (!localStorage.getItem("portfolio-theme")) {
              applyTheme(e.matches ? "light" : "dark");
            }
          } catch (err) {}
        });
      }
    } catch (e) {}

    // ------------------------------------------------------------------------
    // 2. Mobile Navigation Drawer & Hamburger Toggle
    // ------------------------------------------------------------------------
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.getElementById("site-nav");

    function setNavState(isOpen) {
      if (!siteNav) return;
      siteNav.classList.toggle("is-open", isOpen);
      if (menuToggle) {
        menuToggle.classList.toggle("is-active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
      }
    }

    if (menuToggle) {
      menuToggle.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = siteNav ? siteNav.classList.contains("is-open") : false;
        setNavState(!isOpen);
      });
    }

    // Close when tapping any link inside the mobile nav
    if (siteNav) {
      siteNav.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
          setNavState(false);
        });
      });
    }

    // Close when tapping outside the menu on mobile
    document.addEventListener("click", function (e) {
      if (siteNav && siteNav.classList.contains("is-open")) {
        if (!siteNav.contains(e.target) && (!menuToggle || !menuToggle.contains(e.target))) {
          setNavState(false);
        }
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && siteNav && siteNav.classList.contains("is-open")) {
        setNavState(false);
      }
    });

    // ------------------------------------------------------------------------
    // 3. Project Filter Tabs
    // ------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll(".filter-pill");
    const projectCards = document.querySelectorAll(".featured-card");

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const filterValue = btn.getAttribute("data-filter");

        projectCards.forEach(function (card) {
          const category = card.getAttribute("data-category");
          if (filterValue === "all" || category === filterValue) {
            card.classList.remove("is-hidden");
            card.style.opacity = "0";
            card.style.transform = "translateY(8px)";
            setTimeout(function () {
              card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 30);
          } else {
            card.classList.add("is-hidden");
          }
        });
      });
    });

    // ------------------------------------------------------------------------
    // 4. Statz Hero Widget Live Metrics Simulation
    // ------------------------------------------------------------------------
    const mockCpuVal = document.getElementById("mock-cpu-val");
    const mockCpuBar = document.getElementById("mock-cpu-bar");
    const mockGpuVal = document.getElementById("mock-gpu-val");
    const mockGpuBar = document.getElementById("mock-gpu-bar");
    const mockNetVal = document.getElementById("mock-net-val");
    const mockNetBar = document.getElementById("mock-net-bar");

    function updateMetrics() {
      if (!mockCpuVal || !mockGpuVal) return;

      const newCpu = Math.floor(Math.random() * 13) + 14;
      mockCpuVal.textContent = newCpu + "%";
      if (mockCpuBar) mockCpuBar.style.width = newCpu + "%";

      const newGpu = Math.floor(Math.random() * 25) + 28;
      mockGpuVal.textContent = newGpu + "%";
      if (mockGpuBar) mockGpuBar.style.width = newGpu + "%";

      const newNet = (Math.random() * 3.2 + 1.1).toFixed(1);
      if (mockNetVal) mockNetVal.textContent = "↓ " + newNet + " MB/s";
      if (mockNetBar) mockNetBar.style.width = Math.min(95, Math.floor(newNet * 25)) + "%";
    }

    setInterval(updateMetrics, 3000);

    // ------------------------------------------------------------------------
    // 5. Copy Email to Clipboard with Toast Notification
    // ------------------------------------------------------------------------
    const copyHeroBtn = document.getElementById("copy-email-hero");
    const copyBottomBtn = document.getElementById("copy-email-bottom");
    const copyToast = document.getElementById("copy-toast");
    const emailAddress = "yuvarma@hotmail.com";
    let toastTimer = null;

    function showCopyToast(msg) {
      if (!copyToast) return;
      copyToast.textContent = msg || "✓ yuvarma@hotmail.com copied to clipboard!";
      copyToast.classList.add("is-visible");

      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        copyToast.classList.remove("is-visible");
      }, 2600);
    }

    async function copyEmail() {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailAddress);
          showCopyToast("✓ yuvarma@hotmail.com copied to clipboard!");
          return;
        }
      } catch (err) {}

      window.prompt("Copy email address:", emailAddress);
    }

    if (copyHeroBtn) copyHeroBtn.addEventListener("click", copyEmail);
    if (copyBottomBtn) copyBottomBtn.addEventListener("click", copyEmail);

    // ------------------------------------------------------------------------
    // 6. Dynamic Year
    // ------------------------------------------------------------------------
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPortfolio);
  } else {
    initPortfolio();
  }
})();
