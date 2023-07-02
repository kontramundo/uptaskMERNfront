import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProyectosContext } from "../context/ProyectosContext";

import Alerta from "./Alerta";

export default function FormularioProyecto() {
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [cliente, setCliente] = useState("");

    const params = useParams();

    const { mostrarAlerta, alerta, submitProyecto, proyecto, cargando } =
        useProyectosContext();

    useEffect(() => {
        if (params.id && proyecto.nombre) {
            setId(proyecto._id);
            setNombre(proyecto.nombre);
            setDescripcion(proyecto.descripcion);
            setFechaEntrega(proyecto.fechaEntrega?.split("T")[0]);
            setCliente(proyecto.cliente);
        }
    }, [proyecto]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([nombre, descripcion, fechaEntrega, cliente].includes("")) {
            mostrarAlerta({
                msg: "Todos los campos son obligatorios",
                error: true,
            });

            return;
        }

        await submitProyecto({
            id,
            nombre,
            descripcion,
            fechaEntrega,
            cliente,
        });

        setId(null);
        setNombre("");
        setDescripcion("");
        setFechaEntrega("");
        setCliente("");
    };

    const { msg } = alerta;

    return (
        <form
            className="bg-white py-10 px-5 md:w-1/2 rounded-lg"
            onSubmit={handleSubmit}
        >
            {msg && <Alerta alerta={alerta} />}
            <div className="mb-5">
                <label
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="nombre"
                >
                    Nombre Proyecto
                </label>
                <input
                    id="nombre"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del Proyecto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </div>

            <div className="mb-5">
                <label
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="descripcion"
                >
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Descripcion del Proyecto"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <div className="mb-5">
                <label
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="fecha_entrega"
                >
                    Fecha de Entrega
                </label>
                <input
                    id="fecha_entrega"
                    type="date"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                />
            </div>

            <div className="mb-5">
                <label
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="cliente"
                >
                    Cliente
                </label>
                <input
                    id="cliente"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del Cliente"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                />
            </div>

            <input
                type="submit"
                value={params.id ? "Actualizar Proyecto" : "Crear Proyecto"}
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
            />
        </form>
    );
}
