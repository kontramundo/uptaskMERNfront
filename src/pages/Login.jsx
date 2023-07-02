import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

import axios from "axios";
import Alerta from "../components/Alerta";

export default function Login() {
    const { setAuth } = useAuthContext();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alerta, setAlerta] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes("")) {
            setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true,
            });

            return;
        }

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/login/`,
                { email, password }
            );

            setAlerta({});
            localStorage.setItem("token", data.token);
            setAuth(data);
            navigate("/proyectos");
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
                Inicia sesión y administra tus{" "}
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
                <div className="my-5">
                    <label
                        htmlFor="password"
                        className="uppercase text-gray-600 block text-xl font-bold"
                    >
                        password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Ingresa tu Password"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <input
                    type="submit"
                    value="Iniciar Sesión"
                    className="bg-sky-700 mb-5 w-full py-3 text-white uppercase fontt-bold rounded hover:cursor-pointer hover:bg-sky-800 transitions-color"
                />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link
                    to="/registrar"
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >
                    ¿No tienes una cuenta? Regístrate
                </Link>
                <Link
                    to="/olvide-password"
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                >
                    Olvide mi password
                </Link>
            </nav>
        </>
    );
}
