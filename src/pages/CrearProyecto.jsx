import React from "react";
import FormularioProyecto from "../components/FormularioProyecto";

export default function CrearProyecto() {
    return (
        <>
            <h1 className="text-4xl font-black">Nuevo Proyecto</h1>
            <div className="mt-10 flex justify-center">
                <FormularioProyecto />
            </div>
        </>
    );
}
