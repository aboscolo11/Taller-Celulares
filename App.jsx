// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  guardarReparacion, 
  obtenerReparaciones, 
  eliminarReparacion, 
  actualizarEstado,
  escucharReparaciones
} from './firebase';
import './index.css';

function App() {
  const [reparaciones, setReparaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formData, setFormData] = useState({
    cliente: '',
    telefono: '',
    equipo: '',
    modelo: '',
    problema: '',
    costoRepuesto: '',
    costoManoObra: ''
  });

  // Cargar reparaciones al iniciar y suscribirse en tiempo real
  useEffect(() => {
    setCargando(true);
    const unsubscribe = escucharReparaciones((data) => {
      setReparaciones(data);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  const cargarReparaciones = async () => {
    setCargando(true);
    try {
      const data = await obtenerReparaciones();
      setReparaciones(data);
    } catch (error) {
      console.error(error);
      alert('❌ Error al cargar las reparaciones');
    }
    setCargando(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cliente || !formData.equipo) {
      alert('⚠️ El nombre del cliente y el equipo son obligatorios');
      return;
    }

    try {
      const total = (parseFloat(formData.costoRepuesto) || 0) + (parseFloat(formData.costoManoObra) || 0);
      
      await guardarReparacion({
        cliente: formData.cliente.trim(),
        telefono: formData.telefono.trim(),
        equipo: formData.equipo.trim(),
        modelo: formData.modelo.trim(),
        problema: formData.problema.trim(),
        costoRepuesto: parseFloat(formData.costoRepuesto) || 0,
        costoManoObra: parseFloat(formData.costoManoObra) || 0,
        total: total
      });

      // Resetear formulario
      setFormData({
        cliente: '',
        telefono: '',
        equipo: '',
        modelo: '',
        problema: '',
        costoRepuesto: '',
        costoManoObra: ''
      });

      await cargarReparaciones();
      alert('✅ Reparación guardada exitosamente');
    } catch (error) {
      alert('❌ Error al guardar: ' + error.message);
    }
  };

  const handleEliminar = async (id, cliente) => {
    if (confirm(`¿Eliminar la reparación de ${cliente}?`)) {
      try {
        await eliminarReparacion(id);
        await cargarReparaciones();
        alert('✅ Reparación eliminada');
      } catch (error) {
        alert('❌ Error al eliminar');
      }
    }
  };

  const handleCambiarEstado = async (id, estadoActual) => {
    const estados = ['Pendiente', 'En reparación', 'Reparado', 'Entregado'];
    const index = estados.indexOf(estadoActual);
    const nuevoEstado = estados[(index + 1) % estados.length];
    
    try {
      await actualizarEstado(id, nuevoEstado);
      await cargarReparaciones();
    } catch (error) {
      alert('❌ Error al actualizar estado');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calcularTotal = () => {
    const repuesto = parseFloat(formData.costoRepuesto) || 0;
    const manoObra = parseFloat(formData.costoManoObra) || 0;
    return repuesto + manoObra;
  };

  const calcularGananciasMensuales = () => {
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    let totalRepuestos = 0;
    let totalManoObra = 0;
    let totalGanancia = 0;

    reparaciones.forEach((rep) => {
      if (rep.fechaIngreso) {
        const fecha = new Date(rep.fechaIngreso);
        if (fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual) {
          totalRepuestos += rep.costoRepuesto || 0;
          totalManoObra += rep.costoManoObra || 0;
          totalGanancia += rep.total || 0;
        }
      }
    });

    return { totalRepuestos, totalManoObra, totalGanancia };
  };

  const ganancias = calcularGananciasMensuales();

  const getEstadoColor = (estado) => {
    const colores = {
      'Pendiente': '#f39c12',
      'En reparación': '#3498db',
      'Reparado': '#2ecc71',
      'Entregado': '#95a5a6'
    };
    return colores[estado] || '#95a5a6';
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🔧 Taller de Celulares</h1>
        <p>Gestión de reparaciones</p>
      </header>

      <main className="main-content">
        {/* RESUMEN DE GANANCIAS MENSUALES */}
        <section className="summary-section">
          <div className="summary-card repuesto">
            <h3>💳 Repuestos</h3>
            <div className="amount">${ganancias.totalRepuestos.toFixed(2)}</div>
          </div>
          <div className="summary-card mano-obra">
            <h3>🔧 Mano de obra</h3>
            <div className="amount">${ganancias.totalManoObra.toFixed(2)}</div>
          </div>
          <div className="summary-card total">
            <h3>💰 Total mes</h3>
            <div className="amount">${ganancias.totalGanancia.toFixed(2)}</div>
          </div>
        </section>

        {/* FORMULARIO */}
        <section className="form-section">
          <h2>📝 Nueva Reparación</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>Cliente *</label>
                <input
                  type="text"
                  name="cliente"
                  value={formData.cliente}
                  onChange={handleChange}
                  placeholder="Nombre del cliente"
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono de contacto"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Equipo *</label>
                <input
                  type="text"
                  name="equipo"
                  value={formData.equipo}
                  onChange={handleChange}
                  placeholder="Ej: iPhone, Samsung, Motorola"
                  required
                />
              </div>
              <div className="form-group">
                <label>Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  placeholder="Ej: iPhone 12, Galaxy S21"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Problema reportado</label>
              <textarea
                name="problema"
                value={formData.problema}
                onChange={handleChange}
                placeholder="Describe el problema del equipo"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Costo repuesto ($)</label>
                <input
                  type="number"
                  name="costoRepuesto"
                  value={formData.costoRepuesto}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Mano de obra ($)</label>
                <input
                  type="number"
                  name="costoManoObra"
                  value={formData.costoManoObra}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group total-display">
                <strong>💰 Total: ${calcularTotal().toFixed(2)}</strong>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              💾 Guardar Reparación
            </button>
          </form>
        </section>

        {/* LISTA DE REPARACIONES */}
        <section className="list-section">
          <h2>📋 Reparaciones ({reparaciones.length})</h2>
          
          {cargando ? (
            <p className="loading">Cargando...</p>
          ) : reparaciones.length === 0 ? (
            <p className="empty-message">📭 No hay reparaciones registradas</p>
          ) : (
            <div className="reparaciones-grid">
              {reparaciones.map((rep) => (
                <div key={rep.id} className="reparacion-card">
                  <div className="card-header">
                    <h3>{rep.cliente}</h3>
                    <span 
                      className="estado-badge"
                      style={{ backgroundColor: getEstadoColor(rep.estado) }}
                    >
                      {rep.estado || 'Pendiente'}
                    </span>
                  </div>
                  
                  <div className="card-body">
                    <p><strong>📱 Equipo:</strong> {rep.equipo} {rep.modelo && `(${rep.modelo})`}</p>
                    <p><strong>📞 Teléfono:</strong> {rep.telefono || 'No especificado'}</p>
                    <p><strong>🔧 Problema:</strong> {rep.problema || 'No especificado'}</p>
                    <p><strong>💰 Total:</strong> ${(rep.total || 0).toFixed(2)}</p>
                    <p><strong>📅 Fecha:</strong> {rep.fechaIngreso ? new Date(rep.fechaIngreso).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="btn-estado"
                      onClick={() => handleCambiarEstado(rep.id, rep.estado)}
                    >
                      🔄 Cambiar estado
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleEliminar(rep.id, rep.cliente)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;