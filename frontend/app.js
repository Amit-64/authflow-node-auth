// Frontend — wired to the AuthFlow Express API.
// All authentication is enforced server-side; these fetch() calls are just the UI layer.

const API = "http://127.0.0.1:3001";
const byId = (id) => document.getElementById(id);

// ─── Helper: show a status message ─────────────────────────────────────────────
function showMessage(el, text, type = "") {
  el.textContent = text;
  el.className = `message${type ? " " + type : ""}`;
}

// ─── Login page ────────────────────────────────────────────────────────────────
const loginForm = byId("loginForm");
if (loginForm) {
  const passwordInput = byId("password");
  const message = byId("message");

  // Toggle password visibility
  byId("togglePassword")?.addEventListener("click", () => {
    const showing = passwordInput.type === "text";
    passwordInput.type = showing ? "password" : "text";
    byId("togglePassword").textContent = showing ? "Show" : "Hide";
  });

  // Forgot password placeholder
  byId("forgotLink")?.addEventListener("click", (event) => {
    event.preventDefault();
    showMessage(message, "Password reset is not implemented in this demo.");
  });

  // Demo preview button (no auth needed)
  byId("demoBtn")?.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  // Login form submit — calls POST /api/auth/login
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = byId("email").value.trim();
    const password = passwordInput.value;
    if (!email || !password) return;

    showMessage(message, "Signing in…");

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",   // send/receive the HttpOnly cookie
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage(message, "Signed in! Redirecting…", "success");
        setTimeout(() => { window.location.href = "profile.html"; }, 400);
      } else {
        showMessage(message, data.message || "Login failed. Please try again.", "error");
      }
    } catch {
      showMessage(message, "Could not reach the server. Is the backend running?", "error");
    }
  });
}

// ─── Register page ─────────────────────────────────────────────────────────────
const registerForm = byId("registerForm");
if (registerForm) {
  const passwordInput = byId("password");
  const message = byId("message");

  // Toggle password visibility
  byId("togglePassword")?.addEventListener("click", () => {
    const showing = passwordInput.type === "text";
    passwordInput.type = showing ? "password" : "text";
    byId("togglePassword").textContent = showing ? "Show" : "Hide";
  });

  // Register form submit — calls POST /api/auth/register
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = byId("name").value.trim();
    const email = byId("email").value.trim();
    const password = passwordInput.value;
    if (!name || !email || !password) return;

    showMessage(message, "Creating your account…");

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage(message, "Account created! Redirecting to sign in…", "success");
        setTimeout(() => { window.location.href = "login.html"; }, 800);
      } else {
        showMessage(message, data.message || "Registration failed. Please try again.", "error");
      }
    } catch {
      showMessage(message, "Could not reach the server. Is the backend running?", "error");
    }
  });
}

// ─── Profile page ──────────────────────────────────────────────────────────────
const profilePage = byId("profileForm");
if (profilePage) {
  let profile = { name: "", email: "" };

  const initials = (name) =>
    name.trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase();

  const renderProfile = () => {
    const firstName = profile.name.trim().split(/\s+/)[0] || "there";
    byId("greetingName").textContent = firstName;
    byId("fullName").textContent = profile.name;
    byId("profileEmail").textContent = profile.email;
    byId("sideName").textContent = profile.name;
    document.querySelectorAll(".avatar").forEach((el) => {
      el.textContent = initials(profile.name);
    });
  };

  // On page load, fetch the authenticated user from the API
  (async () => {
    try {
      const res = await fetch(`${API}/api/users/me`, {
        credentials: "include",   // send the HttpOnly cookie automatically
      });

      if (res.status === 401) {
        // Not authenticated — redirect to login
        window.location.href = "login.html";
        return;
      }

      const data = await res.json();
      profile = { name: data.name, email: data.email };
      renderProfile();
    } catch {
      // Server unreachable — fall back to placeholder so the page still renders
      profile = { name: "Alex Morgan", email: "alex.morgan@example.com" };
      renderProfile();
    }
  })();

  // ── Edit modal ──────────────────────────────────────────────────────────────
  const modal = byId("editModal");
  const closeModal = () => { modal.hidden = true; };

  byId("editProfileBtn").addEventListener("click", () => {
    byId("editName").value = profile.name;
    byId("editEmail").value = profile.email;
    modal.hidden = false;
    byId("editName").focus();
  });

  byId("closeModal").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });

  // Local-only profile edit (a real PATCH /api/users/me would persist this)
  profilePage.addEventListener("submit", (event) => {
    event.preventDefault();
    profile = {
      name: byId("editName").value.trim(),
      email: byId("editEmail").value.trim(),
    };
    renderProfile();
    closeModal();
  });

  // ── Logout ──────────────────────────────────────────────────────────────────
  byId("logoutBtn").addEventListener("click", async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Even if the request fails, clear the UI and redirect
    }
    window.location.href = "login.html";
  });
}
