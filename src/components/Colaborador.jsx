import { useProyectosContext } from "../context/ProyectosContext";

export default function Colaborador({ colaborador }) {
    const { nombre, email } = colaborador;

    const { handleModalEliminarColaborador } = useProyectosContext();

    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div>
                <p>{nombre}</p>
                <p className="text-sm text-gray-700">{email}</p>
            </div>
            <div>
                <button
                    className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    type="button"
                    onClick={() => handleModalEliminarColaborador(colaborador)}
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}
