import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";

import io from "socket.io-client";

const ProyectosContext = createContext();
let socket;

export const ProyectosProvider = ({ children }) => {
    const [proyectos, setProyectos] = useState({});
    const [alerta, setAlerta] = useState({});
    const [proyecto, setProyecto] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [tarea, setTarea] = useState({});
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [colaborador, setColaborador] = useState({});
    const [modalEliminarColaborador, setModalEliminarColaborador] =
        useState(false);
    const [buscador, setBuscador] = useState(false);

    const { auth } = useAuthContext();

    const navigate = useNavigate();

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);

        const obtenerProyectos = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };

                const { data } = await axios(
                    `${import.meta.env.VITE_BACKEND_URL}/api/proyectos`,
                    config
                );

                setProyectos(data);
            } catch (error) {
                console.log(error);
            }
        };

        obtenerProyectos();
    }, [auth]);

    const mostrarAlerta = (alerta) => {
        setAlerta(alerta);

        setTimeout(() => {
            setAlerta({});
        }, 5000);
    };

    const submitProyecto = async (proyecto) => {
        if (proyecto.id) {
            await editarProyecto(proyecto);
        } else {
            await nuevoProyecto(proyecto);
        }
    };

    const nuevoProyecto = async (proyecto) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/proyectos`,
                proyecto,
                config
            );

            setProyectos([...proyectos, data]);

            setAlerta({
                msg: "Proyecto creado correctamente",
                error: false,
            });

            setTimeout(() => {
                setAlerta({});
                navigate("/proyectos");
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };

    const editarProyecto = async (proyecto) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${
                    proyecto.id
                }`,
                proyecto,
                config
            );

            const proyectosActualizados = proyectos.map((proyectoState) =>
                proyectoState._id === data._id ? data : proyectoState
            );

            setProyectos(proyectosActualizados);

            setAlerta({
                msg: "Proyecto actualizado correctamente",
                error: false,
            });

            setTimeout(() => {
                setAlerta({});
                navigate("/proyectos");
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };

    const obtenerProyecto = async (id) => {
        setProyecto(true);

        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios(
                `${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${id}`,
                config
            );

            setProyecto(data);
            setAlerta({});
        } catch (error) {
            navigate("/proyectos");
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            });

            setTimeout(() => {
                setAlerta({});
            }, 3000);
        } finally {
            setCargando(false);
        }
    };

    const eliminarProyecto = async (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/proyectos/${id}`,
                config
            );

            const proyectosActualizados = proyectos.filter(
                (proyectoState) => proyectoState._id !== id
            );

            setProyectos(proyectosActualizados);

            setAlerta({
                msg: "Proyecto actualizado correctamente",
                error: false,
            });

            setTimeout(() => {
                setAlerta({});
                navigate("/proyectos");
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };

    const handleMotalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea);
        setTarea({});
    };

    const submitTarea = async (tarea) => {
        if (tarea?.id) {
            await editarTarea(tarea);
        } else {
            await crearTarea(tarea);
        }
    };

    const crearTarea = async (tarea) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/tareas`,
                tarea,
                config
            );

            setAlerta({});
            setModalFormularioTarea(false);

            //SOCKET
            socket.emit("nueva tarea", data);
        } catch (error) {
            console.log(error);
        }
    };

    const editarTarea = async (tarea) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/tareas/${tarea.id}`,
                tarea,
                config
            );

            setAlerta({});
            setModalFormularioTarea(false);

            //SOCKET
            socket.emit("actualizar tarea", data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea);
        setModalFormularioTarea(true);
    };

    const handleModalEliminarTarea = (tarea) => {
        setTarea(tarea);
        setModalEliminarTarea(!modalEliminarTarea);
    };

    const eliminarTarea = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/tareas/${tarea._id}`,
                config
            );

            setAlerta({ msg: data.msg, error: false });
            setModalEliminarTarea(false);

            setTimeout(() => {
                setAlerta({});
            }, 3000);

            //SOCKET IO
            socket.emit("eliminar tarea", tarea);

            setTarea({});
        } catch (error) {
            console.log(error);
        }
    };

    const submitColaborador = async (email) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            setCargando(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/proyectos/colaboradores`,
                { email },
                config
            );

            setColaborador(data);

            setAlerta({});
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            });
        } finally {
            setCargando(false);
        }
    };

    const agregarColaborador = async (email) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/proyectos/colaboradores/${proyecto._id}`,
                email,
                config
            );

            setAlerta({
                msg: data.msg,
                error: false,
            });

            setColaborador({});

            setTimeout(() => {
                setAlerta({});
            }, 3000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            });
        }
    };

    const handleModalEliminarColaborador = (colaborador) => {
        setColaborador(colaborador);
        setModalEliminarColaborador(!modalEliminarColaborador);
    };

    const eliminarColaborador = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/api/proyectos/eliminar-colaborador/${proyecto._id}`,
                { id: colaborador._id },
                config
            );

            const proyectoActualizado = { ...proyecto };
            proyectoActualizado.colaboradores =
                proyectoActualizado.colaboradores.filter(
                    (colaboradorState) =>
                        colaboradorState._id !== colaborador._id
                );

            setProyecto(proyectoActualizado);
            setAlerta({ msg: data.msg, error: false });
            setModalEliminarColaborador(false);
            setColaborador({});

            setTimeout(() => {
                setAlerta({});
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };

    const completarTarea = async (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/tareas/estado/${id}`,
                {},
                config
            );

            //SOCKET
            socket.emit("cambiar estado", data);

            setTarea({});
            setAlerta({});
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuscador = () => {
        setBuscador(!buscador);
    };

    //SOCKET IO
    const submitTareasProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto };

        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];

        setProyecto(proyectoActualizado);
    };

    const eliminarTareaProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
            (tareaState) => tareaState._id !== tarea._id
        );

        setProyecto(proyectoActualizado);
    };

    const actualizarTareaProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto };

        proyectoActualizado.tareas = proyectoActualizado.tareas.map(
            (tareaState) => (tareaState._id === tarea._id ? tarea : tareaState)
        );

        setProyecto(proyectoActualizado);
    };

    const cambiarEstadoTarea = (tarea) => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(
            (tareaState) => (tareaState._id === tarea._id ? tarea : tareaState)
        );

        setProyecto(proyectoActualizado);
    };

    const cerrarSesionProyectos = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({});
    };

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleMotalTarea,
                submitTarea,
                tarea,
                handleModalEditarTarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos,
            }}
        >
            {children}
        </ProyectosContext.Provider>
    );
};

export const useProyectosContext = () => useContext(ProyectosContext);
