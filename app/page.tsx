'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface TipoCambio {
  fecha?: string;
  referencia?: string;
  timestamp?: string;
}

export default function Home() {
  const [ultimoCambio, setUltimoCambio] = useState<TipoCambio | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Función para obtener el último tipo de cambio
  const fetchUltimoCambio = async () => {
    try {
      const response = await fetch('/api/tipoCambio');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.length > 0) {
        const ultimo = data[0];
        const unescapedXml = ultimo.xml_response.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        const fechaMatch = unescapedXml.match(/<fecha>(.*?)<\/fecha>/);
        const referenciaMatch = unescapedXml.match(/<referencia>(.*?)<\/referencia>/);
        
        setUltimoCambio({
          fecha: fechaMatch ? fechaMatch[1].trim() : 'No disponible',
          referencia: referenciaMatch ? referenciaMatch[1].trim() : 'No disponible',
          timestamp: new Date(ultimo.timestamp).toLocaleString(), // Formateamos el timestamp
        });
      }
    } catch (error) {
      setError('Error fetching tipo de cambio: ' + error.message);
    }
  };

  // Función para guardar el tipo de cambio
  const guardarTipoCambio = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/tipo-cambio/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ultimoCambio), // Enviamos el último tipo de cambio
      });

      if (response.ok) {
        const result = await response.text();
        alert(result); // Mostrar el mensaje devuelto por el backend
        fetchUltimoCambio(); // Actualizamos la vista con el tipo de cambio guardado
      } else {
        alert("Error al guardar el tipo de cambio.");
      }
    } catch (error) {
      console.error("Error al guardar el tipo de cambio:", error);
      alert("Hubo un problema al intentar guardar el tipo de cambio.");
    }
  };

  // Cargar el último tipo de cambio cuando se monta el componente
  useEffect(() => {
    fetchUltimoCambio();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f3e6ff', color: '#5e3b76', borderRadius: '8px', maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Último Tipo de Cambio</h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={guardarTipoCambio}
          style={{
            padding: '10px 20px',
            backgroundColor: '#8a2be2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Ver Tipo de Cambio Actual
        </button>
        <button
          onClick={() => router.push('/historial')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#b19cd9',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Ver Historial
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px', backgroundColor: '#ffffff', padding: '15px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <p><strong>Fecha:</strong> {ultimoCambio?.fecha || 'No disponible'}</p>
        <p><strong>Referencia:</strong> {ultimoCambio?.referencia || 'No disponible'}</p>
        <p><strong>Hora de Consulta:</strong> {ultimoCambio?.timestamp || 'No disponible'}</p>
      </div>
    </main>
  );
}
