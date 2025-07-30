import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { app } from "./firebase-config.js";

const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const messageDiv = document.getElementById('login-message');

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Login successful! Redirecting...';
        // Redirect based on user email or uid for admin
        setTimeout(() => {
          if (user.email === 'amitk25783@gmail.com') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'index.html';
          }
        }, 1500);
      } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = error.message || 'Login failed';
      }
    });

    // Google login button
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          alert('Google login successful!');
          if (user.email === 'amitk25783@gmail.com') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'index.html';
          }
        } catch (error) {
          alert('Google login failed: ' + error.message);
        }
      });
    }
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const messageDiv = document.getElementById('signup-message');

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = error.message || 'Registration failed';
      }
    });
  }
});
