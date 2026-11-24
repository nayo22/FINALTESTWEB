'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
        setError(err.message || 'no se cargó el comprobante');
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  if (loading) return <div>cargando</div>;
  if (error) return <div>{error}</div>;
  if (!request) return <div>solicitud no encontradaa</div>;

  return (
    <div>
      <h1 >comprobante del loan</h1>
      
      <div>
        <div>
          <span>ID de solicitud:</span>
          <p >{request.id}</p>
        </div>
        <div>
          <span>herramienta:</span>
          <p >{request.tool?.name} (Límite máx: {request.tool?.maxLimit} días)</p>
        </div>
        <div>
          <span >para qué:</span>
          <p >{request.purpose}</p>
        </div>
        <div>
          <span >días:</span>
          <p >{request.days}</p>
        </div>
      </div>

      <div >
        <Link 
          href="/loan-requests"
         
        >
           Volvber al listado
        </Link>
        <button
          onClick={() => window.print()}
          
        >
          imprimir comprobante
        </button>
      </div>
    </div>
  );
}