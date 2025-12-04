export interface Incident {
  id?: number;
  title: string;
  description: string;
  reportedBy: string;
  reportedAt?: string;
  status: string;
  priority: string;
  category: string;
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: string;
  comments?: string[];
  attachments?: string[];
}

export interface User {
  id?: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'IT_EMPLOYEE';
}

export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type UserRole = 'ADMIN' | 'EMPLOYEE' | 'IT_EMPLOYEE';
