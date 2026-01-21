'use client';

import { Incident } from '@/lib/types';
import { useAuthenticatedAPI } from '@/lib/useAuthenticatedAPI';
import { useAuthorization } from '@/components/ProtectedByRole';
import { useState } from 'react';

interface IncidentCardProps {
  incident: Incident;
  onRefresh: () => void;
}

export default function IncidentCard({ incident, onRefresh }: IncidentCardProps) {
  const [updating, setUpdating] = useState(false);
  const { canDeleteIncidents } = useAuthorization();
  const { incidentAPI } = useAuthenticatedAPI();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'text-blue-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'CRITICAL':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await incidentAPI.update(incident.id!, { ...incident, status: newStatus });
      onRefresh();
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this incident?')) return;
    setUpdating(true);
    try {
      await incidentAPI.delete(incident.id!);
      onRefresh();
    } finally {
      setUpdating(false);
    }
  };

  const formattedDate = incident.reportedAt
    ? new Date(incident.reportedAt).toLocaleDateString()
    : 'N/A';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {incident.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            ID: #{incident.id}
          </p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(incident.status)}`}>
          {incident.status}
        </span>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">{incident.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Category</p>
          <p className="font-semibold text-gray-900 dark:text-white">{incident.category}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Priority</p>
          <p className={`font-semibold ${getPriorityColor(incident.priority)}`}>
            {incident.priority}
          </p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Reported By</p>
          <p className="font-semibold text-gray-900 dark:text-white text-xs">{incident.reportedBy}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Date</p>
          <p className="font-semibold text-gray-900 dark:text-white text-xs">{formattedDate}</p>
        </div>
      </div>

      {incident.assignedTo && (
        <div className="mb-4 text-sm">
          <p className="text-gray-600 dark:text-gray-400">Assigned To</p>
          <p className="font-semibold text-gray-900 dark:text-white">{incident.assignedTo}</p>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <select
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          value={incident.status}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        {canDeleteIncidents && (
          <button
            onClick={handleDelete}
            disabled={updating}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm rounded transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
