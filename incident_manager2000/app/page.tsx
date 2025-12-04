'use client';

import { useState, useEffect } from 'react';
import IncidentList from '@/components/IncidentList';
import IncidentForm from '@/components/IncidentForm';
import Navigation from '@/components/Navigation';
import { incidentAPI } from '@/lib/api';
import { Incident } from '@/lib/types';

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  useEffect(() => {
    loadIncidents();
  }, [filter]);

  const loadIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Incident[];
      if (filter === 'all') {
        data = await incidentAPI.getAll();
      } else {
        const status = filter === 'open' ? 'OPEN' : 'RESOLVED';
        data = await incidentAPI.getByStatus(status);
      }
      setIncidents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncident = async (data: Incident) => {
    try {
      await incidentAPI.create(data);
      setShowForm(false);
      loadIncidents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create incident');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Incident Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and track security incidents
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {showForm ? 'Cancel' : 'New Incident'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <IncidentForm onSubmit={handleCreateIncident} />
          </div>
        )}

        <div className="mb-6 flex gap-2">
          {(['all', 'open', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading incidents...</p>
          </div>
        ) : (
          <IncidentList incidents={incidents} onRefresh={loadIncidents} />
        )}
      </main>
    </div>
  );
}
