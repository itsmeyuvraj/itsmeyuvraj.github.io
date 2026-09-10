/**
 * Yuvraj — Portfolio Interactivity & Live Showcase Simulation
 * Fully defensive, zero external dependencies, safe in Private Browsing
 */

(function () {
  "use strict";

  function initPortfolio() {
    // ------------------------------------------------------------------------
    // 1. Theme Management (Dark / Light Mode)
    // ------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById("theme-toggle");
    const htmlRoot = document.documentElement;
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function getPreferredTheme() {
      try {
        const storedTheme = localStorage.getItem("preferred-theme");
        if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
      } catch (e) {
        // Storage disabled or blocked in private mode
      }
      try {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
          return "light";
        }
      } catch (e) {}
      return "dark";
    }

    function applyTheme(theme) {
      try {
        htmlRoot.setAttribute("data-theme", theme);
      } catch (e) {}

      try {
        localStorage.setItem("preferred-theme", theme);
      } catch (e) {}

      try {
        if (themeMeta) {
          themeMeta.setAttribute("content", theme === "light" ? "#f8fafc" : "#0a0c10");
        }
      } catch (e) {}
    }

    // Apply theme immediately
    applyTheme(getPreferredTheme());

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", function () {
        const currentTheme = htmlRoot.getAttribute("data-theme") || "dark";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
      });
    }

    try {
      if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (e) {
          try {
            if (!localStorage.getItem("preferred-theme")) {
              applyTheme(e.matches ? "light" : "dark");
            }
          } catch (err) {}
        });
      }
    } catch (e) {}

    // ------------------------------------------------------------------------
    // 2. Mobile Navigation Drawer
    // ------------------------------------------------------------------------
    const menuToggle = document.querySelector(".menu-toggle");
    const siteNav = document.getElementById("site-nav");

    function toggleNav(forceState) {
      if (!siteNav) return;
      const isOpen = typeof forceState === "boolean" ? forceState : !siteNav.classList.contains("is-open");
      siteNav.classList.toggle("is-open", isOpen);
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", String(isOpen));
      }
    }

    if (menuToggle) {
      menuToggle.addEventListener("click", function (e) {
        e.stopPropagation();
        toggleNav();
      });
    }

    if (siteNav) {
      siteNav.querySelectorAll(".nav-link").forEach(function (link) {
        link.addEventListener("click", function () {
          toggleNav(false);
        });
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && siteNav && siteNav.classList.contains("is-open")) {
        toggleNav(false);
      }
    });

    document.addEventListener("click", function (e) {
      if (
        siteNav &&
        siteNav.classList.contains("is-open") &&
        !siteNav.contains(e.target) &&
        (!menuToggle || !menuToggle.contains(e.target))
      ) {
        toggleNav(false);
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
    const emailAddress = "hello@itsmeyuvraj.dev";
    let toastTimer = null;

    function showCopyToast(msg) {
      if (!copyToast) return;
      copyToast.textContent = msg || "✓ hello@itsmeyuvraj.dev copied to clipboard!";
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
          showCopyToast("✓ hello@itsmeyuvraj.dev copied to clipboard!");
          return;
        }
      } catch (err) {}

      // Fallback
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
