'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ correo: '', contrasena: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch(
        'https://hobbyconnect-production.up.railway.app/auth/login', // Ruta al backend
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Guardar el token
        localStorage.setItem('access_token', data.access_token);
        // Guardar los datos del usuario
        localStorage.setItem('userData', JSON.stringify(data.usuario));
        // Redirigir a la página de perfil
        router.push('/session/profile');
      } else {
        switch (response.status) {
          case 401:
            setErrorMessage('Correo o contraseña incorrectos.');
            break;
          case 400:
            setErrorMessage('Campos inválidos. Verifica e intenta de nuevo.');
            break;
          default:
            setErrorMessage(data.message || 'Error desconocido al iniciar sesión.');
        }
      }
    } catch (error) {
      setErrorMessage('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Imagen izquierda */}
      <div className="w-1/2 hidden md:block">
        <img
          src="/assets/login-image.png"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Formulario derecho */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8">
        <img
          src="/assets/logo-complete.png"
          alt="Logo"
          className="w-70 h-70 mb-8"
        />

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm w-full max-w-sm text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            required
            onChange={handleChange}
            className="input"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="contrasena"
              placeholder="Contraseña"
              required
              onChange={handleChange}
              className="input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md text-white font-semibold bg-pink-500 hover:bg-pink-600 cursor-pointer"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Crea una
          </a>
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
        }

        button {
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #c2185b;
        }
      `}</style>
    </div>
  );
}