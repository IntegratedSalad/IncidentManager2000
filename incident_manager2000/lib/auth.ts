export type UserRole = 'User' | 'Admin';

export const hasRole = (roles: string[], targetRole: UserRole): boolean => {
  return roles.includes(targetRole);
};

export const isAdmin = (roles: string[]): boolean => {
  return hasRole(roles, 'Admin');
};

export const canDeleteIncidents = (roles: string[]): boolean => {
  return isAdmin(roles);
};

export const canDeleteUsers = (roles: string[]): boolean => {
  return isAdmin(roles);
};

export const canCreateIncidents = (roles: string[]): boolean => {
  return roles.length > 0;
};

export const canUpdateIncidentStatus = (roles: string[]): boolean => {
  return roles.length > 0;
};

export const canAccessDashboard = (roles: string[]): boolean => {
  return roles.length > 0;
};

export const canViewUsersList = (roles: string[]): boolean => {
  return isAdmin(roles);
};

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    User: 'User',
    Admin: 'Administrator',
  };
  return roleNames[role] || role;
};
