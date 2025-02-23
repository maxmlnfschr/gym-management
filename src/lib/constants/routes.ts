export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Main routes
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  // Members
  MEMBERS: '/members',
  MEMBER_NEW: '/members/new',
  MEMBER_DETAIL: '/members/:id',
  MEMBER_EDIT: '/members/:id/edit',

  // Access
  ACCESS: '/access',
  ACCESS_LOGS: '/access/logs',

  // Admin
  SETTINGS: '/settings',
} as const;