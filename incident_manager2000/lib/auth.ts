/**
 * Authorization utility functions
 * Used for role-based access control on the frontend
 */

export type UserRole = 'User' | 'Admin';

/**
 * Check if a user has a specific role
 */
export const hasRole = (roles: string[], targetRole: UserRole): boolean => {
  return roles.includes(targetRole);
};

/**
 * Check if user is an admin
 */
export const isAdmin = (roles: string[]): boolean => {
  return hasRole(roles, 'Admin');
};

/**
 * Check if user can delete incidents
 */
export const canDeleteIncidents = (roles: string[]): boolean => {
  return isAdmin(roles);
};

/**
 * Check if user can delete users
 */
export const canDeleteUsers = (roles: string[]): boolean => {
  return isAdmin(roles);
};

/**
 * Check if user can create incidents
 */
export const canCreateIncidents = (roles: string[]): boolean => {
  // All authenticated users can create incidents
  return roles.length > 0;
};

/**
 * Check if user can update incident status
 */
export const canUpdateIncidentStatus = (roles: string[]): boolean => {
  // All authenticated users can update incident status
  return roles.length > 0;
};

/**
 * Check if user can view the dashboard
 */
export const canAccessDashboard = (roles: string[]): boolean => {
  // All authenticated users can access dashboard
  return roles.length > 0;
};

/**
 * Check if user can view users list
 */
export const canViewUsersList = (roles: string[]): boolean => {
  return isAdmin(roles);
};

/**
 * Get user-friendly role name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    User: 'User',
    Admin: 'Administrator',
  };
  return roleNames[role] || role;
};
