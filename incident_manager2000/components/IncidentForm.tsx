'use client';

import { useState } from 'react';
import { Incident } from '@/lib/types';

interface IncidentFormProps {
  onSubmit: (data: Incident) => Promise<void>;
}

export default function IncidentForm({ onSubmit }: IncidentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Incident>({
    title: '',
    description: '',
    reportedBy: '',
    status: 'OPEN',
    priority: 'MEDIUM',
    category: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        reportedBy: '',
        status: 'OPEN',
        priority: 'MEDIUM',
        category: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Report New Incident</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Incident title"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Reporter Email *
          </label>
          <input
            type="email"
            name="reportedBy"
            value={formData.reportedBy}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Malware">Malware</option>
            <option value="Phishing">Phishing</option>
            <option value="DDoS">DDoS</option>
            <option value="Data Breach">Data Breach</option>
            <option value="Unauthorized Access">Unauthorized Access</option>
            <option value="System Outage">System Outage</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the incident in detail..."
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition"
        >
          {loading ? 'Submitting...' : 'Submit Incident'}
        </button>
      </div>
    </form>
  );
}
