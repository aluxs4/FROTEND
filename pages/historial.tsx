'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TipoCambio {
  id: number;
  xml_response: string;
  timestamp: string;
  fecha?: string;
  referencia?: string;
}

export default function Historial() {
  const [tiposCambio, setTiposCambio] = useState<TipoCambio[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTiposCambio = async () => {
      try {
        const response = await fetch('/api/tipoCambio');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TipoCambio[] = await response.json();

        const parsedData = data.map((tipo) => {
          const unescapedXml = tipo.xml_response.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          const fechaMatch = unescapedXml.match(/<fecha>(.*?)<\/fecha>/);
          const referenciaMatch = unescapedXml.match(/<referencia>(.*?)<\/referencia>/);

          return {
            ...tipo,
            fecha: fechaMatch ? fechaMatch[1].trim() : 'No disponible',
            referencia: referenciaMatch ? referenciaMatch[1].trim() : 'No disponible',
          };
        });

        setTiposCambio(parsedData);
      } catch (error) {
        setError('Error fetching tipo de cambio: ' + error.message);
      }
    };

    fetchTiposCambio();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f3e6ff', color: '#5e3b76', borderRadius: '8px', maxWidth: '800px', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Historial de Tipo de Cambio</h1>
      
      <button
        onClick={() => router.push('/')}
        style={{
          display: 'block',
          margin: '0 auto 20px',
          padding: '10px 20px',
          backgroundColor: '#8a2be2',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Regresar
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#ffffff', borderRadius: '5px' }}>
        <thead>
          <tr style={{ backgroundColor: '#dcd0ff' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Fecha</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Referencia</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Hora de Consulta</th>
          </tr>
        </thead>
        <tbody>
          {tiposCambio.map((tipo) => (
            <tr key={tipo.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{tipo.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{tipo.fecha}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{tipo.referencia}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{new Date(tipo.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
