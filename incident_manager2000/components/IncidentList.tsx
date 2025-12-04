'use client';

import { Incident } from '@/lib/types';
import IncidentCard from './IncidentCard';

interface IncidentListProps {
  incidents: Incident[];
  onRefresh: () => void;
}

export default function IncidentList({ incidents, onRefresh }: IncidentListProps) {
  if (incidents.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">No incidents found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {incidents.map((incident) => (
        <IncidentCard 
          key={incident.id} 
          incident={incident}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}
