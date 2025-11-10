import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth check desactivado temporalmente:
  // No se requiere autenticación para ver Details mientras no esté implementado el login real.
  // Mantengo el manejo de errores en el fetch y la navegación de volver.

  // Task 3: Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Task 2: Fetch gift details using productId
  useEffect(() => {
    const fetchGift = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${urlConfig.backendUrl}/api/gifts/${productId}`;
        const response = await fetch(url);
        if (!response.ok) {
          // Manejo específico para 404
          if (response.status === 404) {
            setError('Producto no encontrado.');
            return;
          }
          throw new Error(`Fetch failed with status ${response.status}`);
        }
        const data = await response.json();
        setGift(data);
      } catch (err) {
        console.error('Failed to fetch gift details:', err);
        setError('No se pudieron obtener los detalles del producto.');
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchGift();
    }
  }, [productId]);

  // Task 4: Handle back click
  const handleBack = () => {
    navigate(-1);
  };

  // Utilidad: formatea timestamp en segundos (Unix) a fecha legible local
  const formatUnixToDate = (seconds) => {
    try {
      if (typeof seconds !== 'number' || Number.isNaN(seconds)) return 'N/D';
      const d = new Date(seconds * 1000);
      // Si la fecha no es válida
      if (isNaN(d.getTime())) return 'N/D';
      return d.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) {
      console.warn('No se pudo formatear la fecha:', e);
      return 'N/D';
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando detalles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={handleBack}>Volver</button>
      </div>
    );
  }

  const comments = Array.isArray(gift?.comments) ? gift.comments : [];

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <button className="btn btn-light" onClick={handleBack}>← Volver</button>
        </div>
        <div className="card-body">
          <h2 className="details-title mb-3">{gift?.name || 'Detalles del Producto'}</h2>

          <div className="image-placeholder-large mb-3">
            {gift?.image ? (
              <img src={gift.image} alt={gift?.name || 'Producto'} className="product-image-large" />
            ) : (
              <div className="no-image-available-large">No Image Available</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6">
              <p><strong>Categoria:</strong> {gift?.category ?? 'N/D'}</p>
              <p><strong>Condición:</strong> {gift?.condition ?? 'N/D'}</p>
              <p><strong>Fecha:</strong> {formatUnixToDate(gift?.date_added)}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Descripción:</strong></p>
              <p>{gift?.description ?? 'Sin descripción disponible.'}</p>
            </div>
          </div>

          <div className="comments-section mt-4">
            <h5>Comentarios</h5>
            {comments.length === 0 && (
              <p className="text-muted">No hay comentarios.</p>
            )}
            {comments.map((comment, index) => (
              <div key={index} className="mb-2">
                <span>• {comment}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
