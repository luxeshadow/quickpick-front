import { defineNuxtRouteMiddleware, navigateTo, useState } from '#imports';
import { useAuthStore } from '../features/auth/presentation/store/auth_store';

export default defineNuxtRouteMiddleware(to => {
  const auth = useAuthStore();
  const canAccessManager = useState<boolean>('can-access-manager', () => false);
  const token = auth.session?.token;
  const roles = auth.session?.user.roles;
  const path = to.path.replace(/\/+$/, '') || '/';

  canAccessManager.value = false;

  if (typeof token === 'string' && token.trim()) {
    if (Array.isArray(roles) && roles.includes('admin')) {
      canAccessManager.value = true;
    }
  }

  const authPages = [
    '/auth/login',
    '/auth/register',
    '/auth/otp',
    '/auth/forgot-password',
    '/auth/new-password',
    '/auth/forgotpassword',
    '/auth/newpassword',
    '/register',
    '/otp',
    '/forgot-password',
    '/forgotpassword',
    '/new-password',
    '/newpassword',
  ];

  if (authPages.includes(path)) {
    return;
  }

  const mediaPages = [
    '/media',
    '/media/scan',
    '/media/gallery',
    '/media/galery',
    '/gallery',
  ];

  if (mediaPages.includes(path)) {
    if (typeof to.query.token === 'string' && to.query.token.trim()) {
      return;
    }

    return navigateTo('/auth/login');
  }

  if (typeof token !== 'string' || !token.trim()) {
    return navigateTo('/auth/login');
  }

  const adminPages = ['/manager/plans', '/manager/users'];

  for (const adminPage of adminPages) {
    if (path === adminPage || path.startsWith(adminPage + '/')) {
      if (!canAccessManager.value) {
        return navigateTo('/manager/dashboard');
      }
    }
  }

  if (path === '/') {
    return navigateTo('/manager/dashboard');
  }
});
