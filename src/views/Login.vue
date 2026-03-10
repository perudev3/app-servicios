<template>
  <div class="login-page">
    <div class="login-background">
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>
      <div class="bg-grid"></div>
    </div>

    <div class="login-container">
      <!-- Logo Header -->
      <div class="login-header">
        <div class="brand">
          <span class="brand-icon">⚡</span>
          <span class="brand-name">IServices</span>
        </div>
        <p class="tagline">Conecta. Contrata. Crece.</p>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <div class="card-glow"></div>

        <h1 class="login-title">
          {{ isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta' }}
        </h1>
        <p class="login-subtitle">
          {{
            isLogin
              ? 'Ingresa tus credenciales para continuar'
              : 'Únete a nuestra comunidad de profesionales'
          }}
        </p>

        <!-- Role Selection (only for register) -->
        <div v-if="!isLogin" class="role-selector">
          <div
            v-for="role in roles"
            :key="role.value"
            @click="selectedRole = role.value"
            :class="['role-option', { active: selectedRole === role.value }]"
          >
            <span class="role-icon">{{ role.icon }}</span>
            <div class="role-info">
              <div class="role-name">{{ role.name }}</div>
              <div class="role-desc">{{ role.desc }}</div>
            </div>
            <div class="role-check">
              <span v-if="selectedRole === role.value">✓</span>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="login-form">
          <div v-if="!isLogin" class="form-group">
            <label class="form-label">Nombre completo</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                type="text"
                v-model="formData.name"
                placeholder="Juan Pérez"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <div class="input-wrapper">
              <span class="input-icon">✉️</span>
              <input
                type="email"
                v-model="formData.email"
                placeholder="tu@email.com"
                class="form-input"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                placeholder="••••••••"
                class="form-input"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="toggle-password"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <div v-if="isLogin" class="form-extras">
            <label class="checkbox-label">
              <input type="checkbox" v-model="rememberMe" />
              <span>Recordarme</span>
            </label>
            <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <div v-if="errorMessage" class="error-message">
            ⚠️ {{ errorMessage }}
          </div>

          <button type="submit" class="submit-btn" :disabled="isLoading">
            <span>{{ isLoading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta') }}</span>
            <span class="btn-arrow">{{ isLoading ? '⏳' : '→' }}</span>
          </button>
        </form>

        <!-- Social Login -->
        <div class="social-divider">
          <span>O continúa con</span>
        </div>

        <div class="social-buttons">
          <button class="social-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
        </div>

        <!-- Toggle Login/Register -->
        <div class="toggle-mode">
          <span v-if="isLogin">
            ¿No tienes cuenta?
            <a @click="isLogin = false" class="toggle-link">Regístrate</a>
          </span>
          <span v-else>
            ¿Ya tienes cuenta?
            <a @click="isLogin = true" class="toggle-link">Inicia sesión</a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const isLogin = ref(true);
const showPassword = ref(false);
const rememberMe = ref(false);
const selectedRole = ref('client');
const isLoading = ref(false);      // 👈 nuevo
const errorMessage = ref('');      // 👈 nuevo

const formData = ref({
  name: '',
  email: '',
  password: '',
});

const roles = [
  {
    value: 'client',
    name: 'Cliente',
    icon: '👤',
    desc: 'Busco contratar servicios',
  },
  {
    value: 'professional',
    name: 'Profesional',
    icon: '💼',
    desc: 'Ofrezco mis servicios',
  },
];

const handleSubmit = async () => {
  isLoading.value = true;
  errorMessage.value = '';          // 👈 limpiar error anterior

  try {
    let result;

    if (isLogin.value) {
      result = await authStore.login(
        formData.value.email,
        formData.value.password,
        selectedRole.value
      );
    } else {
      result = await authStore.register(
        formData.value.name,
        formData.value.email,
        formData.value.password,
        selectedRole.value
      );
    }

    // 👈 si el store devuelve error, mostrarlo
    if (!result.success) {
      errorMessage.value = result.error;
    }

  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', -apple-system, sans-serif;
}

.login-background {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  z-index: 0;
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.4;
  animation: orbFloat 25s infinite ease-in-out;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: #3b82f6;
  top: -200px;
  right: -100px;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: #8b5cf6;
  bottom: -150px;
  left: -100px;
  animation-delay: -10s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: #ec4899;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -5s;
}

@keyframes orbFloat {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(80px, -100px) scale(1.1);
  }
  66% {
    transform: translate(-60px, 80px) scale(0.9);
  }
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.brand-icon {
  font-size: 48px;
  filter: drop-shadow(0 8px 20px rgba(59, 130, 246, 0.6));
}

.brand-name {
  font-size: 36px;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
}

.tagline {
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.login-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 48px 40px;
  position: relative;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

.card-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.3),
    rgba(139, 92, 246, 0.3)
  );
  border-radius: 32px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s;
}

.login-card:hover .card-glow {
  opacity: 1;
}

.login-title {
  font-size: 32px;
  font-weight: 900;
  color: white;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.login-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  margin-bottom: 32px;
  line-height: 1.5;
}

.role-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.role-option:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.role-option.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.role-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.role-info {
  flex: 1;
}

.role-name {
  color: white;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 2px;
}

.role-desc {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

.role-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 800;
  opacity: 0;
  transition: opacity 0.3s;
}

.role-option.active .role-check {
  opacity: 1;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 600;
  padding-left: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 18px;
  font-size: 18px;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 16px 20px 16px 52px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
  outline: none;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.12);
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.toggle-password {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.toggle-password:hover {
  opacity: 1;
}

.form-extras {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  cursor: pointer;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.forgot-link {
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-link:hover {
  color: #60a5fa;
}

.submit-btn {
  width: 100%;
  padding: 18px 32px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 17px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);
  margin-top: 8px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.5);
}

.btn-arrow {
  font-size: 20px;
  transition: transform 0.3s;
}

.submit-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.social-divider {
  position: relative;
  text-align: center;
  margin: 32px 0 24px;
}

.social-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.social-divider span {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  padding: 8px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border-radius: 20px;
}

.social-buttons {
  display: grid;
  gap: 12px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.social-btn svg {
  width: 20px;
  height: 20px;
}

.toggle-mode {
  text-align: center;
  margin-top: 28px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.toggle-link {
  color: #3b82f6;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s;
}

.toggle-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.feature-icon {
  font-size: 24px;
}

.feature-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 768px) {
  .login-card {
    padding: 36px 28px;
  }

  .login-title {
    font-size: 28px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .social-buttons {
    grid-template-columns: 1fr;
  }
}

.error-message {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

</style>
