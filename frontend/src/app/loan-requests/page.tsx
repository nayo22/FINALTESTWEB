'use client';

import Link from "next/link";
import { apiFetch } from "../../lib/api";
import type { Tool } from "../../lib/loan-types";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';


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
        setError(err.message || 'hubo un error al cargar');
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
    <div >
      <div >
        <h1>solicitudes de loan</h1>
        <Link 
          href="/loan-requests/new" 
 >
          add nueva solicitud
        </Link>
      </div>

      
      <div>
        <label htmlFor="toolFilter">filtrar por tipo d herramienta:</label>
        <select
          id="toolFilter"
          value={toolFilter}
          onChange={handleFilterChange}
        
        ><option value="all">todas las tools</option>
          <option value="one">electric drill</option>
          <option value="two">sewing machine</option>
          
        </select>
      </div>

      {loading && <p>Loading</p>}
      {error && <p >{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p>no hay solicitudes</p>
      )}

      <div>
        {requests.map((req) => (
          <div key={req.id} >
            <div>
              <p >Herramienta: {req.tool?.name}</p>
              <p >Propósito: {req.purpose}</p>
              <p >Duración: {req.days} días</p>
            </div>
            <Link 
              href={`/loan-requests/${req.id}`}
              
            >
            vVer Comprobante
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}