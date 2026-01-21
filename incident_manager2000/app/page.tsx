'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IncidentList from '@/components/IncidentList';
import IncidentForm from '@/components/IncidentForm';
import Navigation from '@/components/Navigation';
import { useAuthenticatedAPI } from '@/lib/useAuthenticatedAPI';
import { Incident } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, accessToken } = useAuth();
  const { incidentAPI } = useAuthenticatedAPI();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  

  useEffect(() => {
    console.log('[page] useEffect triggered:', { isLoading, accessToken: accessToken ? accessToken.substring(0, 20) + '...' : 'null' });
    if (!isLoading && accessToken) {
      console.log('[page] Calling loadIncidents');
      loadIncidents();
    }
  }, [filter, isLoading, accessToken]);

  const loadIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[loadIncidents] Starting with accessToken:', accessToken ? accessToken.substring(0, 20) + '...' : 'none');
      let data: Incident[];
      if (filter === 'all') {
        console.log('[loadIncidents] Calling getAll()');
        data = await incidentAPI.getAll();
      } else {
        const status = filter === 'open' ? 'OPEN' : 'RESOLVED';
        console.log('[loadIncidents] Calling getByStatus:', status);
        data = await incidentAPI.getByStatus(status);
      }
      console.log('[loadIncidents] Got data:', data);
      setIncidents(data);
    } catch (err) {
      console.error('[loadIncidents] Error:', err);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-sm text-yellow-700">Debug: Token exists: {accessToken ? 'YES' : 'NO'} | Loading: {loading.toString()} | Filter: {filter}</p>
        </div>
        
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
