import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileForm = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    // Add other profile fields as needed
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/profile');
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('/api/profile/update', profileData);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Mi Perfil</h3>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Guardar Cambios
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
