import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import axios from "axios";

export default function OlvidePassword() {
    const [email, setEmail] = useState("");
    const [alerta, setAlerta] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email === "") {
            setAlerta({
                msg: "El password es obligatorio",
                error: true,
            });
            return;
        }

        try {
            const { data } = await axios.post(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/usuarios/olvide-password`,
                {
                    email,
                }
            );

            setAlerta({
                msg: data.msg,
                error: false,
            });
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            });
        }
    };

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Recupera tu password y administra tus{" "}
                <span className="text-slate-700">proyectos</span>
            </h1>

            {msg && <Alerta alerta={alerta} />}

            <form
                className="my-10 bg-white shadow rounded-lg p-10"
                onSubmit={handleSubmit}
            >
                <div className="my-5">
                    <label
                        htmlFor="email"
                        className="uppercase text-gray-600 block text-xl font-bold"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Ingresa tu Email"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <input
                    type="submit"
                    value="Enviar Instrucciones"
                    className="bg-sky-700 mb-5 w-full py-3 text-white uppercase fontt-bold rounded hover:cursor-pointer hover:bg-sky-800 transitions-color"
                />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    to="/"
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >
                    ¿Ya tienes una cuenta? Inicia Sesión
                </Link>
                <Link
                    to="/registrar"
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >
                    ¿No tienes una cuenta? Regístrate
                </Link>
            </nav>
        </>
    );
}
