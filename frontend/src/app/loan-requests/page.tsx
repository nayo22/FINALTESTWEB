'use client';

import Link from "next/link";
import { apiFetch } from "../../lib/api";
import type { Tool } from "../../lib/loan-types";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api';

interface LoanRequest {
  id: string;
  purpose: string;
  days: number;
  tool: {
    id: string;
    name: string;
    maxLimit: number;
  };
}

export default function LoanRequestsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toolFilter = searchParams.get('tool') || 'all';

  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const endpoint = toolFilter && toolFilter !== 'all' 
          ? `/loan-requests?tool=${toolFilter}` 
          : '/loan-requests';
        
        const data = await apiGet(endpoint);
        setRequests(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar las solicitudes');
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [toolFilter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      router.push('/loan-requests');
    } else {
      router.push(`/loan-requests?tool=${value}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Solicitudes de Préstamo</h1>
        <Link 
          href="/loan-requests/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Nueva Solicitud
        </Link>
      </div>

      
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="toolFilter" className="font-medium text-gray-700">Filtrar por herramienta:</label>
        <select
          id="toolFilter"
          value={toolFilter}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="all">All tools</option>
          
        </select>
      </div>

      {loading && <p>Cargando solicitudes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p className="text-gray-500">No hay solicitudes registradas.</p>
      )}

      <div className="grid gap-4">
        {requests.map((req) => (
          <div key={req.id} className="border p-4 rounded shadow-sm bg-white flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">Herramienta: {req.tool?.name}</p>
              <p className="text-gray-600 text-sm">Propósito: {req.purpose}</p>
              <p className="text-gray-500 text-xs">Duración: {req.days} días</p>
            </div>
            <Link 
              href={`/loan-requests/${req.id}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Ver Comprobante
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}