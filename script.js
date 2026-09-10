/**
 * Yuvraj — Portfolio Interactivity & Live Showcase Simulation
 */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlRoot = document.documentElement;
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const getPreferredTheme = () => {
    const storedTheme = localStorage.getItem("preferred-theme");
    if (storedTheme) return storedTheme;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const applyTheme = (theme) => {
    htmlRoot.setAttribute("data-theme", theme);
    localStorage.setItem("preferred-theme", theme);
    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "light" ? "#f8fafc" : "#0a0c10");
    }
  };

  // Initialize theme
  applyTheme(getPreferredTheme());

  themeToggleBtn?.addEventListener("click", () => {
    const currentTheme = htmlRoot.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });

  // Listen for OS scheme change if user hasn't overridden
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (!localStorage.getItem("preferred-theme")) {
      applyTheme(e.matches ? "light" : "dark");
    }
  });

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.getElementById("site-nav");

  const toggleNav = (forceState) => {
    const isOpen = typeof forceState === "boolean" ? forceState : !siteNav.classList.contains("is-open");
    siteNav.classList.toggle("is-open", isOpen);
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
  };

  menuToggle?.addEventListener("click", () => toggleNav());

  // Close when clicking any nav anchor
  siteNav?.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => toggleNav(false));
  });

  // Close on Escape or click outside
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && siteNav?.classList.contains("is-open")) {
      toggleNav(false);
    }
  });

  document.addEventListener("click", (e) => {
    if (
      siteNav?.classList.contains("is-open") &&
      !siteNav.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      toggleNav(false);
    }
  });

  // --------------------------------------------------------------------------
  // 3. Project Filter Tabs
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll(".filter-pill");
  const projectCards = document.querySelectorAll(".featured-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      filterButtons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("is-hidden");
          card.style.opacity = "0";
          card.style.transform = "translateY(8px)";
          setTimeout(() => {
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

  // --------------------------------------------------------------------------
  // 4. Statz Hero Widget Live Metrics Simulation
  // --------------------------------------------------------------------------
  const mockCpuVal = document.getElementById("mock-cpu-val");
  const mockCpuBar = document.getElementById("mock-cpu-bar");
  const mockGpuVal = document.getElementById("mock-gpu-val");
  const mockGpuBar = document.getElementById("mock-gpu-bar");
  const mockNetVal = document.getElementById("mock-net-val");
  const mockNetBar = document.getElementById("mock-net-bar");

  // Subtle live pulse to show the menu bar monitor in action
  const updateMetrics = () => {
    if (!mockCpuVal || !mockGpuVal) return;

    // Natural CPU fluctuation (14% - 26%)
    const newCpu = Math.floor(Math.random() * 13) + 14;
    mockCpuVal.textContent = `${newCpu}%`;
    mockCpuBar.style.width = `${newCpu}%`;

    // Natural GPU fluctuation (28% - 52%)
    const newGpu = Math.floor(Math.random() * 25) + 28;
    mockGpuVal.textContent = `${newGpu}%`;
    mockGpuBar.style.width = `${newGpu}%`;

    // Network throughput fluctuation
    const newNet = (Math.random() * 3.2 + 1.1).toFixed(1);
    mockNetVal.textContent = `↓ ${newNet} MB/s`;
    mockNetBar.style.width = `${Math.min(95, Math.floor(newNet * 25))}%`;
  };

  // Run periodic live updates every 3 seconds
  setInterval(updateMetrics, 3000);

  // --------------------------------------------------------------------------
  // 5. Copy Email to Clipboard with Toast Notification
  // --------------------------------------------------------------------------
  const copyHeroBtn = document.getElementById("copy-email-hero");
  const copyBottomBtn = document.getElementById("copy-email-bottom");
  const copyToast = document.getElementById("copy-toast");
  const emailAddress = "hello@itsmeyuvraj.dev";

  let toastTimer = null;

  const showCopyToast = (customMessage) => {
    if (!copyToast) return;
    copyToast.textContent = customMessage || "✓ Email copied to clipboard!";
    copyToast.classList.add("is-visible");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      copyToast.classList.remove("is-visible");
    }, 2600);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      showCopyToast("✓ hello@itsmeyuvraj.dev copied to clipboard!");
    } catch {
      // Fallback prompt if clipboard API is restricted
      window.prompt("Copy email address:", emailAddress);
    }
  };

  copyHeroBtn?.addEventListener("click", copyEmail);
  copyBottomBtn?.addEventListener("click", copyEmail);

  // --------------------------------------------------------------------------
  // 6. Footer Dynamic Year
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
