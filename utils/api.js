import axios from "axios";
import * as SecureStore from "expo-secure-store";

const getSession = async () => {
  try {
    const session = await SecureStore.getItemAsync("session_token");
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Error obteniendo la sesión:", error);
    return null;
  }
};

const api = axios.create({
  baseURL: "https://a27a-2806-250-c0c-ba7f-5db8-c1e0-bd58-583c.ngrok-free.app",
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    if (config.url === "/profile" || config.url === "/logout") {
      const session = await getSession();
      if (session?.token) {
        console.log("Enviando token en:", config.url, session.token);
        config.headers.Authorization = `Bearer ${session.token}`;
      } else {
        console.warn("No hay token en SecureStore para", config.url);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username, password) => {
  try {
    console.log("Enviando login con:", { username, password });

    const response = await api.post("/auth", { username, password });
    console.log("Respuesta del servidor:", response.data);

    if (!response.data?.data) {
      console.error("Error: No se recibió información del usuario");
      throw new Error("Credenciales incorrectas");
    }

    const userData = response.data.data;

    await SecureStore.setItemAsync("session_token", JSON.stringify(userData));

    return userData;
  } catch (error) {
    console.error("Error en login:", error?.response?.data?.message || error.message);
    throw new Error("Usuario o contraseña incorrectos");
  }
};

export const getProfile = async () => {
  try {
    console.log("Solicitando perfil del usuario...");
    const response = await api.get("/profile");
    if (!response.data) {
      throw new Error("No se pudo obtener el perfil");
    }
    console.log("Perfil obtenido:", response.data);
    return response.data; 
  } catch (error) {
    console.error("Error obteniendo perfil:", error?.response?.data || error.message);
    return null;
  }
};

export const logout = async () => {
  try {
    await api.post("/logout");
    await SecureStore.deleteItemAsync("session_token");
    console.log("✅ Sesión cerrada correctamente");
  } catch (error) {
    console.error("❌ Error cerrando sesión:", error);
    throw error;
  }
};

export default api;