import { createRouter, createWebHistory } from 'vue-router';

// Landing Page Components
import Landing from '@/views/Landing.vue';
import Login from '@/views/Login.vue';

// Dashboard Clientes
import DashboardClient from '@/views/DashboardClient.vue';

// Dashboard Profesionales
import DashboardProfessional from '@/views/DashboardProfessional.vue';

// Dashboard Admin
import DashboardAdmin from '@/views/DashboardAdmin.vue';
import UsuariosScreen from '@/views/admin/UsuariosScreen.vue';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
    meta: {
      title: 'ServiceHub - Encuentra profesionales de confianza',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Iniciar Sesión - ServiceHub',
    },
  },
  {
    path: '/dashboard/client',
    name: 'DashboardClient',
    component: DashboardClient,
    meta: {
      requiresAuth: true,
      role: 'client',
      title: 'Dashboard Cliente - ServiceHub',
    },
  },
  {
    path: '/dashboard/professional',
    component: DashboardProfessional,
    meta: {
      requiresAuth: true,
      role: 'professional',
    },
    children: [
      {
        path: '',
        name: 'ProfessionalHome',
        component: () => import('@/views/profesional/ProfessionalHome.vue')
      },
      {
        path: 'profile',
        name: 'ProfileProfesional',
        component: () => import('@/views/profesional/ProfessionalProfile.vue')
      }
    ]
  },
  {
    path: '/dashboard/admin',
    component: DashboardAdmin,
    meta: {
      requiresAuth: true,
      role: 'admin',
      title: 'Panel Admin - ServiceHub',
    },
    children: [
      {
        path: '',
        name: 'DashboardAdmin',
        component: () => import('@/views/admin/AdminHome.vue'),
        meta: {
          requiresAuth: true,
          role: 'admin',
          title: 'Panel Admin - ServiceHub',
        },
      },
      {
        path:'users',
        name:'AdminUsers',
        component: UsuariosScreen,
        meta: {
          requiresAuth: true,
          role: 'admin',
          title: 'Panel Usuarios - ServiceHub',
        },
      }
    ]
  },
  {
    // Redirect old routes
    path: '/dashboard',
    redirect: (to) => {
      const userRole = localStorage.getItem('userRole');
      return `/dashboard/${userRole || 'client'}`;
    },
  },
  {
    // 404 Not Found
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
});

// Navigation Guard - Authentication
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'ServiceHub';

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Not authenticated, redirect to login
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } else if (
    to.meta.requiresAuth &&
    to.meta.role &&
    to.meta.role !== userRole
  ) {
    // Authenticated but wrong role
    console.warn(
      `Access denied: User role '${userRole}' doesn't match required role '${to.meta.role}'`
    );
    next(`/dashboard/${userRole}`);
  } else if (to.path === '/login' && isAuthenticated) {
    // Already logged in, redirect to dashboard
    next(`/dashboard/${userRole}`);
  } else {
    // Allow navigation
    next();
  }
});

// After each navigation
router.afterEach((to, from) => {
  // Log navigation (useful for analytics)
  if (import.meta.env.DEV) {
    console.log(`Navigated from ${from.path} to ${to.path}`);
  }
});

export default router;
