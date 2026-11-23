'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiGet } from '@/lib/api';
import Link from 'next/link';

interface LoanRequestDetail {
  id: string;
  purpose: string;
  days: number;
  tool: {
    id: string;
    name: string;
    maxLimit: number;
  };
}

export default function LoanRequestDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [request, setRequest] = useState<LoanRequestDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchDetail() {
      try {
        const data = await apiGet(`/loan-requests/${id}`);
        setRequest(data);
      } catch (err: any) {
        setError(err.message || 'No se pudo cargar el comprobante');
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-6">Cargando comprobante...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!request) return <div className="p-6">Solicitud no encontrada.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-4 border-b pb-2">Comprobante de Préstamo</h1>
      
      <div className="space-y-3 mb-6">
        <div>
          <span className="font-semibold text-gray-700">ID de Solicitud:</span>
          <p className="text-gray-900 font-mono text-sm">{request.id}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Herramienta Solicitada:</span>
          <p className="text-gray-900">{request.tool?.name} (Límite máx: {request.tool?.maxLimit} días)</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Propósito:</span>
          <p className="text-gray-900">{request.purpose}</p>
        </div>
        <div>
          <span className="font-semibold text-gray-700">Días solicitados:</span>
          <p className="text-gray-900">{request.days}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link 
          href="/loan-requests"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Volver al listado
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-black transition"
        >
          Imprimir Comprobante
        </button>
      </div>
    </div>
  );
}