import { useEffect } from "react";
import { useProyectosContext } from "../context/ProyectosContext";
import PreviewProyecto from "../components/PreviewProyecto";
import Alerta from "../components/Alerta";

export default function Proyectos() {
    const { proyectos, alerta } = useProyectosContext();

    const { msg } = alerta;
    return (
        <>
            <h1 className="text-4xl font-black">Proyectos</h1>

            {msg && <Alerta alert={alerta} />}

            <div className="bg-white shadow mt-10 rounded-lg p-5">
                {proyectos.length ? (
                    proyectos.map((proyecto) => (
                        <PreviewProyecto
                            key={proyecto._id}
                            proyecto={proyecto}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-600 uppercase">
                        No hay proyectos aún
                    </p>
                )}
            </div>
        </>
    );
}
