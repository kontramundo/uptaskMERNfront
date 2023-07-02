import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cargando, setcargando] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setcargando(false);
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
                    `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil/`,
                    config
                );

                setAuth(data);
                //navigate("/proyectos");
            } catch (error) {
                setAuth({});
                console.log(error);
            } finally {
                setcargando(false);
            }
        };

        autenticarUsuario();
    }, []);

    const cerrarSesionAuth = () => {
        setAuth({});
    };

    return (
        <AuthContext.Provider
            value={{ auth, setAuth, cargando, cerrarSesionAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
