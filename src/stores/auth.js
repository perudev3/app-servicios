import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';  // 👈 importa el cliente

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const user = ref(null);
  const token = ref(null);
  const role = ref(null);
  const isAuthenticated = ref(false);

  const isClient = computed(() => role.value === 'client');
  const isProfessional = computed(() => role.value === 'professional');
  const isAdmin = computed(() => role.value === 'admin');

  const initAuth = () => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole');
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedAuth === 'true' && storedRole && storedToken) {
      isAuthenticated.value = true;
      role.value = storedRole;
      token.value = storedToken;
      user.value = storedUser ? JSON.parse(storedUser) : null;
    }
  };

  const login = async (email, password, selectedRole) => {
    try {
      const { data } = await api.post('/login', {  // 👈 tu endpoint de Laravel
        email,
        password,
        role: selectedRole
      });

      if (data.success) {
        user.value = data.user;
        token.value = data.token;
        role.value = data.role;
        isAuthenticated.value = true;

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        router.push(`/dashboard/${data.role}`);
        return { success: true };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      // Captura errores HTTP de Laravel (401, 422, etc.)
      const message = error.response?.data?.message || error.message || 'Error al iniciar sesión';
      console.error('Login error:', message);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password, selectedRole) => {
    try {
      const { data } = await api.post('/register', {  // 👈 tu endpoint de Laravel
        name,
        email,
        password,
        role: selectedRole
      });

      if (data.success) {
        return await login(email, password, selectedRole);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Error al registrarse';
      console.error('Register error:', message);
      return { success: false, error: message };
    }
  };

  // En auth.js - reemplaza el método logout
  const logout = async () => {
    try {
      await api.post('/logout')  // revoca el token en Passport
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      user.value = null
      token.value = null
      role.value = null
      isAuthenticated.value = false

      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userRole')
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      router.push('/login')
    }
  };

  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData };
    localStorage.setItem('user', JSON.stringify(user.value));
  };

  return {
    user, token, role, isAuthenticated,
    isClient, isProfessional, isAdmin,
    initAuth, login, register, logout, updateUser,
  };
});