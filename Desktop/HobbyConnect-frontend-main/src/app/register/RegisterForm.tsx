"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        nombre: "",
        correo: "",
        contrasena: "",
        descripcion: "",
        fotoUrl: "",
        fechaRegistro: new Date().toISOString().split("T")[0], // formato YYYY-MM-DD
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(""); // Limpia error previo

        try {
            const response = await fetch(
                "https://hobbyconnect-production.up.railway.app/usuario", // Ruta al backend
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (response.ok) {
                router.push("/login");
            } else {
                switch (response.status) {
                    case 400:
                        setErrorMessage(
                            "Datos inválidos. Por favor verifica el formulario."
                        );
                        break;
                    case 409:
                        setErrorMessage("Ya existe un usuario con ese correo.");
                        break;
                    case 500:
                        setErrorMessage(
                            "Ocurrió un error en el servidor. Intenta más tarde."
                        );
                        break;
                    default:
                        setErrorMessage(
                            data.message || "Error desconocido al registrar."
                        );
                }
            }
        } catch (error) {
            console.error('Error real:', error);
            setErrorMessage("Error de conexión con el servidor.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-center mb-6">
                    <img
                        src="/assets/logo.png"
                        alt="Logo"
                        className="w-30 h-30"
                    />
                </div>
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
                    Crea una cuenta
                </h2>
                <p className="text-center text-sm text-gray-500 mb-4">
                    Y comienza a compartir tus hobbies
                </p>

                {/* Mostrar mensaje de error */}
                {errorMessage && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        required
                        onChange={handleChange}
                        className="input"
                    />
                    <input
                        type="email"
                        name="correo"
                        placeholder="Correo electrónico"
                        required
                        onChange={handleChange}
                        className="input"
                    />
                    {/* Campo contraseña con ícono */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
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
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>
                    <textarea
                        name="descripcion"
                        placeholder="Descripción (opcional)"
                        onChange={handleChange}
                        className="input"
                    />

                    <button
                        type="submit"
                        className="w-full py-2 rounded-md text-white font-semibold bg-pink-500 hover:bg-pink-600 cursor-pointer"
                    >
                        Registrarte
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    ¿Ya tienes cuenta?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Inicia sesión
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
