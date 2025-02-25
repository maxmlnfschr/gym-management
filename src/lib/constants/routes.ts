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
  MEMBER_DETAIL: '/members/:id',
  MEMBER_MEMBERSHIP: '/members/:id/membership',
  MEMBER_EDIT: '/members/:id/edit',

  // Access
  ACCESS: '/access',
  ACCESS_LOGS: '/access/logs',

  // Admin
  SETTINGS: '/settings',
} as const;