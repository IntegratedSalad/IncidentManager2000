'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import * as AuthUtils from '@/lib/auth';

interface ProtectedProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const ProtectedByRole: React.FC<ProtectedProps> = ({
  children,
  requiredRoles = [],
  requireAll = false,
  fallback = null,
}) => {
  const { isAuthenticated, roles, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  if (requiredRoles.length === 0) {
    // No specific roles required, just needs to be authenticated
    return <>{children}</>;
  }

  const hasRequiredRoles = requireAll
    ? requiredRoles.every((role) => roles.includes(role))
    : requiredRoles.some((role) => roles.includes(role));

  if (!hasRequiredRoles) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

interface ConditionalRenderProps {
  children: React.ReactNode;
  admin?: React.ReactNode;
  user?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedRender: React.FC<ConditionalRenderProps> = ({
  children,
  admin = null,
  user = null,
  fallback = null,
}) => {
  const { isAdmin, isAuthenticated, roles, isLoading } = useAuth();

  if (isLoading) {
    return fallback ? <>{fallback}</> : <div className="text-gray-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  if (isAdmin && admin) {
    return <>{admin}</>;
  }

  if (!isAdmin && user) {
    return <>{user}</>;
  }

  return <>{children}</>;
};

export const useAuthorization = () => {
  const { roles } = useAuth();

  return {
    canDeleteIncidents: AuthUtils.canDeleteIncidents(roles),
    canDeleteUsers: AuthUtils.canDeleteUsers(roles),
    canCreateIncidents: AuthUtils.canCreateIncidents(roles),
    canUpdateIncidentStatus: AuthUtils.canUpdateIncidentStatus(roles),
    canAccessDashboard: AuthUtils.canAccessDashboard(roles),
    canViewUsersList: AuthUtils.canViewUsersList(roles),
    hasRole: (role: string) => AuthUtils.hasRole(roles, role as any),
    isAdmin: AuthUtils.isAdmin(roles),
  };
};

interface ProtectedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  requiredRoles?: string[];
  fallbackText?: string;
  children: React.ReactNode;
}

export const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  requiredRoles = [],
  fallbackText = 'Access Denied',
  children,
  disabled = false,
  ...buttonProps
}) => {
  const auth = useAuthorization();

  const hasAccess =
    requiredRoles.length === 0 || requiredRoles.some((role) => auth.hasRole(role));

  if (!hasAccess) {
    return (
      <button
        disabled
        title={fallbackText}
        className="opacity-50 cursor-not-allowed"
        {...buttonProps}
      >
        {children}
      </button>
    );
  }

  return (
    <button disabled={disabled} {...buttonProps}>
      {children}
    </button>
  );
};
