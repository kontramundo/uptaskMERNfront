import { useState } from "react";
import { useProyectosContext } from "../context/ProyectosContext";

import Alerta from "./Alerta";

export default function FormularioColaborador() {
    const [email, setEmail] = useState("");

    const { mostrarAlerta, alerta, submitColaborador } = useProyectosContext();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "") {
            mostrarAlerta({ msg: "El email es obligatorio", error: true });
            return;
        }

        submitColaborador(email);
    };

    const { msg } = alerta;

    return (
        <form
            className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
            onSubmit={handleSubmit}
        >
            {msg && <Alerta alerta={alerta} />}
            <div className="mb-5">
                <label
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="email"
                >
                    Email Colaborador
                </label>
                <input
                    type="text"
                    id="email"
                    placeholder="email del usuario"
                    className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <input
                type="submit"
                value="Buscar colaborador"
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
            />
        </form>
    );
}
