document.addEventListener("DOMContentLoaded", function () {

const EMAILJS_PUBLIC_KEY          = "dEu6NpYPedZYJO_Zs";
const EMAILJS_SERVICE_ID          = "service_9k4ws9k";
const EMAILJS_CONTACT_TEMPLATE_ID = "template_x1tndxd";
const EMAILJS_NEWSLETTER_TEMPLATE_ID = "template_co4s6np";

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/* ── Inject modal HTML + CSS once ── */
(function injectModal() {
  const style = document.createElement("style");
  style.textContent = `
    #cf-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      padding: 1rem;
    }
    #cf-overlay.show {
      opacity: 1;
      pointer-events: all;
    }
    #cf-modal {
      background: #fff;
      border-radius: 20px;
      padding: 2.8rem 2.4rem 2.2rem;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 30px 80px rgba(0,0,0,0.2);
      transform: translateY(30px) scale(0.96);
      transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease;
      opacity: 0;
      position: relative;
    }
    #cf-overlay.show #cf-modal {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    #cf-modal .cf-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.4rem;
    }
    #cf-modal.success .cf-icon-wrap { background: #edfaf2; }
    #cf-modal.error   .cf-icon-wrap { background: #fdecea; }

    #cf-modal .cf-icon-wrap svg { width: 34px; height: 34px; }

    #cf-modal h4 {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: #111;
    }
    #cf-modal p {
      font-size: 0.93rem;
      color: #666;
      margin: 0 0 1.8rem;
      line-height: 1.6;
    }
    #cf-modal button.cf-close-btn {
      display: inline-block;
      padding: 0.65rem 2rem;
      border-radius: 50px;
      border: none;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      letter-spacing: 0.02em;
    }
    #cf-modal button.cf-close-btn:hover { opacity: 0.85; transform: scale(1.03); }
    #cf-modal.success button.cf-close-btn { background: #17a667; color: #fff; }
    #cf-modal.error   button.cf-close-btn { background: #e53935; color: #fff; }

    /* SVG check / x icons */
    .cf-icon-success { stroke: #17a667; }
    .cf-icon-error   { stroke: #e53935; }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "cf-overlay";
  overlay.innerHTML = `
    <div id="cf-modal">
      <div class="cf-icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="cf-svg"></svg>
      </div>
      <h4 id="cf-modal-title"></h4>
      <p  id="cf-modal-body"></p>
      <button class="cf-close-btn" id="cf-close-btn">Got it</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Close on button or backdrop click
  document.getElementById("cf-close-btn").addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
})();

function showModal(type, title, body) {
  const overlay = document.getElementById("cf-overlay");
  const modal   = document.getElementById("cf-modal");
  const svg     = modal.querySelector(".cf-svg");

  modal.className = type; // 'success' or 'error'
  document.getElementById("cf-modal-title").textContent = title;
  document.getElementById("cf-modal-body").textContent  = body;

  svg.innerHTML = type === "success"
    ? `<polyline points="20 6 9 17 4 12" class="cf-icon-success"/>`
    : `<line x1="18" y1="6" x2="6" y2="18" class="cf-icon-error"/><line x1="6" y1="6" x2="18" y2="18" class="cf-icon-error"/>`;

  overlay.classList.add("show");
}

function closeModal() {
  document.getElementById("cf-overlay").classList.remove("show");
}

/* ── Contact form ── */
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const btn  = form.querySelector("button[type='submit']");

    const originalText = btn.innerHTML;
    btn.disabled  = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending…`;

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, form);
      form.reset();
      showModal("success", "Message Sent! 🎉", "Thanks for reaching out! We'll get back to you as soon as possible.");
    } catch (error) {
      console.error(error);
      showModal("error", "Oops! Something went wrong.", "Could not send your message. Please try again in a moment.");
    } finally {
      btn.disabled  = false;
      btn.innerHTML = originalText;
    }
  });
}

/* ── Newsletter form ── */
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const btn  = document.getElementById("newsletter-btn");
    const original = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span>`;

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_NEWSLETTER_TEMPLATE_ID, form);
      form.reset();
      showModal("success", "Subscribed! 🎉", "Thank you for subscribing to Sugam Travel newsletter. We'll keep you updated with the best travel deals!");
    } catch (error) {
      console.error(error);
      showModal("error", "Oops!", "Something went wrong. Please try again.");
    } finally {
      btn.disabled  = false;
      btn.innerHTML = original;
    }
  });
}

});