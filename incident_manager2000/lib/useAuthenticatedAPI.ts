import { useAuth } from '@/context/AuthContext';
import { incidentAPI, userAPI, fetchWithToken } from './api';

/**
 * Hook do automatycznego dołączania Bearer tokenu do żądań API
 * Upraszcza wywoływanie funkcji API bez konieczności ręcznego przekazywania tokenu
 */
export const useAuthenticatedAPI = () => {
  const { accessToken } = useAuth();

  return {
    incidentAPI: {
      getAll: () => incidentAPI.getAll(accessToken || undefined),
      getById: (id: number) => incidentAPI.getById(id, accessToken || undefined),
      getByStatus: (status: string) => incidentAPI.getByStatus(status, accessToken || undefined),
      getByPriority: (priority: string) => incidentAPI.getByPriority(priority, accessToken || undefined),
      getByReporter: (email: string) => incidentAPI.getByReporter(email, accessToken || undefined),
      getByAssignee: (email: string) => incidentAPI.getByAssignee(email, accessToken || undefined),
      create: (data: any) => incidentAPI.create(data, accessToken || undefined),
      update: (id: number, data: any) => incidentAPI.update(id, data, accessToken || undefined),
      delete: (id: number) => incidentAPI.delete(id, accessToken || undefined),
    },
    userAPI: {
      getAll: () => userAPI.getAll(accessToken || undefined),
      getById: (id: number) => userAPI.getById(id, accessToken || undefined),
      getByEmail: (email: string) => userAPI.getByEmail(email, accessToken || undefined),
      getByRole: (role: string) => userAPI.getByRole(role, accessToken || undefined),
      create: (data: any) => userAPI.create(data, accessToken || undefined),
      update: (id: number, data: any) => userAPI.update(id, data, accessToken || undefined),
      delete: (id: number) => userAPI.delete(id, accessToken || undefined),
    },
    // Bezpośredni dostęp do funkcji fetchWithToken dla niestandardowych żądań
    fetchWithToken: (url: string, options?: RequestInit) =>
      fetchWithToken(url, { ...options, token: accessToken || undefined }),
  };
};
