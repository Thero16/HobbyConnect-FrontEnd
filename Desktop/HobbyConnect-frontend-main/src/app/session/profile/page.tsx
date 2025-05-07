'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import { Pencil, Plus, X as XIcon } from 'lucide-react';

export default function ProfilePage() {
  // Datos del perfil
  const [nombre, setNombre] = useState('aqui nombre');
  const [correo, setCorreo] = useState('aqui correo');
  const [sobreMi, setSobreMi] = useState('aqui sobre mi');

  // Modales
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [draftName, setDraftName] = useState(nombre);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [draftHobby, setDraftHobby] = useState('');

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [draftAbout, setDraftAbout] = useState(sobreMi);

  // Lista de hobbies
  const [hobbies, setHobbies] = useState<string[]>([]);

  // Estado para verificar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      setIsAuthenticated(true);
      const user = JSON.parse(userData);
      // Actualizar los estados con los datos del usuario
      setNombre(user.nombre || 'aqui nombre');
      setCorreo(user.correo || 'aqui correo');
      setSobreMi(user.descripcion || ''); // Si descripcion es null, usamos un string vacío
      setHobbies(user.hobbies || []); // Si hobbies es null, usamos un array vacío
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Foto
  const handlePhotoClick = () => {
    document.getElementById('photoInput')?.click();
  };

  // Nombre
  const openNameModal = () => {
    setDraftName(nombre);
    setIsNameModalOpen(true);
  };
  const closeNameModal = () => setIsNameModalOpen(false);
  const saveName = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No autenticado');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuario`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre: draftName }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar el nombre');
      }

      setNombre(draftName);
      // Actualizar localStorage con el nuevo nombre
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      userData.nombre = draftName;
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsNameModalOpen(false);
    } catch (err) {
      const error = err as Error;
      console.error(error);
      alert(error.message || 'Error al actualizar el nombre');
    }
  };

  // Hobbies
  const openAddModal = () => {
    setDraftHobby('');
    setIsAddModalOpen(true);
  };
  const closeAddModal = () => setIsAddModalOpen(false);
  const saveHobby = async () => {
    if (!draftHobby.trim()) {
      alert('El hobby no puede estar vacío');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('userData');
      if (!token || !userData) throw new Error('No autenticado');

      const user = JSON.parse(userData);
      const userId = user.id;

      const response = await fetch(
        `https://hobbyconnect-production.up.railway.app/usuario/${userId}/hobbies`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ hobby: draftHobby.trim() }),
        }
      );

      if (!response.ok) {
        const text = await response.text(); // Capturar la respuesta como texto
        console.error('Respuesta del servidor:', text);
        throw new Error(`Error ${response.status}: ${text || 'Error desconocido al agregar el hobby'}`);
      }

      const data = await response.json();
      setHobbies(data.hobbies || [...hobbies, draftHobby.trim()]); // Actualizar con la respuesta del backend
      setIsAddModalOpen(false);
      alert('Hobby agregado con éxito');
    } catch (err) {
      const error = err as Error;
      console.error('Error detallado:', error);
      alert(error.message || 'Error al agregar el hobby. Revisa la consola para más detalles.');
    }
  };
  const removeHobby = (idx: number) => {
    setHobbies(hobbies.filter((_, i) => i !== idx));
  };

  // Sobre mí
  const openAboutModal = () => {
    setDraftAbout(sobreMi);
    setIsAboutModalOpen(true);
  };
  const closeAboutModal = () => setIsAboutModalOpen(false);
  const saveAbout = () => {
    setSobreMi(draftAbout);
    // Actualizar localStorage con la nueva descripción
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.descripcion = draftAbout;
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAboutModalOpen(false);
  };

  return (
    <div className="min-h-screen p-8 bg-black flex items-start gap-12 text-white">
      {/* Mostrar un mensaje si el usuario no está autenticado */}
      {!isAuthenticated && (
        <div className="bg-gray-800 p-6 rounded-lg w-full text-center">
          <h2 className="text-xl font-semibold mb-4">
            Por favor, inicia sesión para ver tu perfil.
          </h2>
        </div>
      )}

      {/* Resto de la UI (solo se muestra si está autenticado) */}
      {isAuthenticated && (
        <>
          {/* LADO IZQUIERDO: foto + hobbies */}
          <div className="flex flex-col items-center gap-8 flex-shrink-0">
            {/* FOTO DE PERFIL */}
            <div className="relative w-28 h-28">
              <img
                src="/assets/default-profile.png"
                alt="Foto de perfil"
                className="w-full h-full object-cover rounded-full border-2 border-gray-300"
              />
              <button
                onClick={handlePhotoClick}
                className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100 cursor-pointer"
                title="Editar foto"
              >
                <Pencil size={16} />
              </button>
              <input id="photoInput" type="file" accept="image/*" className="hidden" />
            </div>

            {/* MIS HOBBIES */}
            <div className="bg-gray-800 p-6 rounded-lg w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Mis Hobbies</h3>
                <button
                  onClick={openAddModal}
                  className="p-1 rounded hover:bg-gray-600 cursor-pointer text-white"
                  title="Agregar hobby"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2">
                {hobbies.map((hobby, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-gray-700 rounded px-3 py-1 justify-between text-white"
                  >
                    <span>{hobby}</span>
                    <button
                      onClick={() => removeHobby(idx)}
                      className="p-1 hover:bg-gray-600 rounded-full cursor-pointer"
                      title="Eliminar hobby"
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENIDO CENTRAL: nombre, correo y sobre mi */}
          <div className="flex-1 flex flex-col items-stretch gap-8">
            {/* Nombre y correo: ahora ocupa todo el ancho */}
            <div className="bg-gray-800 p-6 rounded-lg w-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{nombre}</h2>
                <button
                  onClick={openNameModal}
                  className="cursor-pointer"
                  title="Editar nombre"
                >
                  <Pencil size={18} className="text-gray-300 hover:text-white" />
                </button>
              </div>
              <p className="mt-2 text-gray-300">{correo}</p>
            </div>

            {/* Sobre mi: también ocupa ancho completo */}
            <div className="bg-gray-800 p-6 rounded-lg w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Sobre mí</h3>
                <button
                  onClick={openAboutModal}
                  className="cursor-pointer"
                  title="Editar sobre mi"
                >
                  <Pencil size={18} className="text-gray-300 hover:text-white" />
                </button>
              </div>
              <p className="mt-2 text-gray-300">{sobreMi}</p>
            </div>
          </div>

          {/* MODAL: Editar Nombre */}
          {isNameModalOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-80 text-white">
                <h3 className="text-lg font-semibold mb-4">Editar nombre</h3>
                <input
                  className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeNameModal}
                    className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveName}
                    className="py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: Agregar Hobby */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-80 text-white">
                <h3 className="text-lg font-semibold mb-4">Agregar hobby</h3>
                <input
                  className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={draftHobby}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setDraftHobby(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeAddModal}
                    className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveHobby}
                    className="py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: Editar Sobre mi */}
          {isAboutModalOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-lg p-6 w-80 text-white">
                <h3 className="text-lg font-semibold mb-4">Editar Sobre mi</h3>
                <textarea
                  className="w-full border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded h-24 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  value={draftAbout}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDraftAbout(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeAboutModal}
                    className="py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveAbout}
                    className="py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}