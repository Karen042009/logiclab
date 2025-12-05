document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
       1. General Site Functionality
       ========================================= */

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || !href.startsWith("#")) return;

      e.preventDefault();
      const targetElement = document.querySelector(href);

      if (targetElement) {
        // Account for fixed header (approx 80px)
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Mobile Menu Toggle (Generic)
  const nav = document.querySelector("nav");
  if (nav && !document.querySelector(".mobile-menu-toggle")) {
    const mobileMenuToggle = document.createElement("div");
    mobileMenuToggle.className = "mobile-menu-toggle";
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.style.cursor = "pointer";
    mobileMenuToggle.style.fontSize = "1.5rem";
    mobileMenuToggle.style.color = "var(--white, #fff)";

    // Add specific styles for positioning if needed in CSS
    // Usually navbar needs 'display: flex' and 'align-items: center'

    const navContainer = nav.querySelector(".container") || nav;
    navContainer.appendChild(mobileMenuToggle);

    mobileMenuToggle.addEventListener("click", function () {
      const navLinks = document.querySelector(".nav-links");
      if (navLinks) {
        navLinks.style.display =
          navLinks.style.display === "flex" ? "none" : "flex";
        // Add class for CSS animation if available
        navLinks.classList.toggle("active");
      }
    });
  }

  /* =========================================
       2. ML Project Detail Page Functionality
       ========================================= */

  // --- Syntax Highlighting Initialization ---
  if (typeof hljs !== "undefined") {
    document.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
  }

  // --- Description Toggle (Show More/Less) ---
  const toggleBtn = document.getElementById("description-toggle");
  const content = document.getElementById("description-content");

  if (toggleBtn && content) {
    // Check text length to decide if button is needed
    const textElement = content.querySelector(".description-text");
    const textLength = textElement ? textElement.innerText.length : 0;

    // If text is short (less than 300 chars), hide button and show all
    if (textLength < 300) {
      toggleBtn.style.display = "none";
      content.classList.remove("collapsed");
      content.classList.add("expanded");
    } else {
      // Initial state: Collapsed
      content.classList.add("collapsed");

      toggleBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const isCollapsed = content.classList.contains("collapsed");
        const btnText = this.querySelector(".toggle-text");

        if (isCollapsed) {
          // Expand
          content.classList.remove("collapsed");
          content.classList.add("expanded");
          this.classList.add("expanded");
          if (btnText) btnText.textContent = "Փակել";
        } else {
          // Collapse
          content.classList.remove("expanded");
          content.classList.add("collapsed");
          this.classList.remove("expanded");
          if (btnText) btnText.textContent = "Կարդալ";

          // Smooth scroll back to header if user is far down
          const card = content.closest(".section-card");
          if (card) {
            const offset =
              card.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
        }
      });
    }
  }

  // --- Code Tabs Switching ---
  window.showCode = function (filename) {
    // Hide all contents
    document.querySelectorAll(".code-content").forEach((div) => {
      div.classList.remove("active");
      div.style.display = "none"; // Ensure hidden
    });

    // Deactivate all buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Show target
    const targetDiv = document.getElementById("code-" + filename);
    if (targetDiv) {
      targetDiv.classList.add("active");
      targetDiv.style.display = "block";
    }

    // Activate button - find button by text content or logic
    // (This relies on the onclick event passed from HTML)
    const buttons = document.querySelectorAll(".tab-btn");
    buttons.forEach((btn) => {
      if (btn.innerText.includes(filename)) {
        btn.classList.add("active");
      }
    });
  };

  // --- Copy to Clipboard Function ---
  window.copyCode = function (elementId) {
    const codeElement = document.getElementById(elementId);
    if (!codeElement) return;

    const codeText = codeElement.innerText || codeElement.textContent;

    navigator.clipboard
      .writeText(codeText)
      .then(() => {
        // Find the button that triggered this
        // Since we can't easily get 'this' from the inline call without passing it,
        // we search for the button inside the header of the active code block.
        const activeBlock = codeElement.closest(".code-content");
        const btn = activeBlock.querySelector(".btn-copy");

        if (btn) {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Պատճենված!';
          btn.style.background = "#43e97b"; // Success green
          btn.style.color = "#fff";

          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = ""; // Revert to CSS default
            btn.style.color = "";
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        alert("Չհաջողվեց պատճենել կոդը");
      });
  };

  // --- Handle Tab Button Clicks (Event Delegation) ---
  // This makes the HTML onclick="showCode(...)" work better with the UI logic
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all siblings
      const parent = this.parentNode;
      parent
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      // Add to self
      this.classList.add("active");
    });
  });
});
