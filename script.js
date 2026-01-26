const htmlEl = document.documentElement;
const hero = document.getElementById("home");
const fab = document.getElementById("themeFab");

/* Get the <i> icon INSIDE the button */
const fabIcon = fab.querySelector("i");

/* ===============================
   Hero Background
=============================== */
function setHeroBackgroundForTheme(mode) {
  hero.style.backgroundImage =
    mode === "dark"
      ? "url('assets/black.png')"
      : "url('assets/white.png')";

  hero.classList.toggle("text-light", mode === "dark");
  hero.classList.toggle("text-dark", mode === "light");
}

/* ===============================
   Theme Switcher
=============================== */
function setTheme(mode) {
  htmlEl.setAttribute("data-bs-theme", mode);
  setHeroBackgroundForTheme(mode);

  /* Change icon */
  fabIcon.className =
    mode === "light"
      ? "fa-solid fa-moon"
      : "bi bi-sun-fill";

  localStorage.setItem("dw-bs-theme", mode);
}

/* ===============================
   Init theme
=============================== */
const savedTheme = localStorage.getItem("dw-bs-theme") || "dark";
setTheme(savedTheme);

/* ===============================
   Toggle theme
=============================== */
fab.addEventListener("click", () => {
  const current = htmlEl.getAttribute("data-bs-theme");
  const next = current === "dark" ? "light" : "dark";
  setTheme(next);
});





  const form = document.getElementById("contactForm");
  const toast = document.getElementById("toast");
  const sendBtn = document.getElementById("sendBtn");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");

  function showToast(message, type = "success") {
    toast.textContent = message;
    toast.style.backgroundColor = type === "error" ? "#ff3b30" : "#1c1c1e";
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4000);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Start loading state
    btnText.textContent = "Sending...";
    btnLoader.classList.remove("d-none");
    sendBtn.disabled = true;

    // Wait for 1s before actually sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();


    // ✅ Added Code: Day + Date + Time + Location
  const now = new Date();
  const dayDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  let location = "Unknown";
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (res.ok) {
      const data = await res.json();
      location = `${data.city}, ${data.region}, ${data.country_name}`;
    }
  } catch (err) {
    console.error("Location fetch error:", err);
  }

    const payload = {
      content:
         "```" +
      `📩 Portfolio User Request:\n\n` +
      `Name     :     ${name}\n` +
      `Email    :     ${email}\n` +
      `Message  :     ${message}` +
      "```" +
      "```" +
      `📌 Hidden Details \n\n` +
      `Date     :     ${dayDate}\n` +
      `Time     :     ${time}\n` +
      `Location :     ${location}` +
      "```",
    };


    const webhookURL = ""; // 🔴 Replace with your real webhook URL

    try {
      const response = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast("✅ Message sent successfully!");
        form.reset();

        // 🎉 Confetti animation
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      } else {
        showToast("❌ Failed to send message.", "error");
      }
    } catch (error) {
      showToast("⚠️ An error occurred. See console.", "error");
      console.error("Discord webhook error:", error);
    }

    // Reset button
    btnText.textContent = "Send Message";
    btnLoader.classList.add("d-none");
    sendBtn.disabled = false;
  });


const menuBtn = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

/* Auto close menu when link is clicked */
document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    menuBtn.classList.remove("active");
    mobileMenu.classList.remove("active");
  });
});
