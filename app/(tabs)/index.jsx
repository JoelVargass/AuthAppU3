import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "../../utils/ctx";
import { getProfile, logout } from "../../utils/api";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Main() {
  const { session, signOut } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/sign-in");
    }
  }, [loading, session]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session) {
        try {
          const data = await getProfile();
          if (!data || !data.user || !data.user.email) {
            throw new Error("Perfil incompleto o no disponible");
          }
          setProfile(data.user);
        } catch (error) {
          console.error("Error obteniendo perfil:", error.message || error);
          Alert.alert("Error", "No se pudo obtener tu perfil. Inténtalo más tarde.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      signOut();
      router.replace("/sign-in");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>

      {session && profile ? (
        <View style={styles.profileContainer}>
          <Text style={styles.profileText}>
            <Ionicons name="id-card-outline" size={20} color="#000" />{" "}
            <Text style={styles.bold}>Nombre:</Text> {profile.name} {profile.lastName}
          </Text>
          <Text style={styles.profileText}>
            <Ionicons name="person-circle-outline" size={20} color="#000" />{" "}
            <Text style={styles.bold}>Usuario:</Text> {profile.username}
          </Text>
          <Text style={styles.profileText}>
            <Ionicons name="mail-outline" size={20} color="#000" />{" "}
            <Text style={styles.bold}>Correo:</Text> {profile.email}
          </Text>
        </View>
      ) : (
        <Text style={styles.noSession}>No se pudo cargar el perfil.</Text>
      )}

      {session && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    padding: 20,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  profileContainer: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  noSession: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4D4D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});