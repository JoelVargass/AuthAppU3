import { router } from "expo-router";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator 
} from "react-native";
import { useState } from "react";
import { useSession } from "../utils/ctx";
import { StatusBar } from "expo-status-bar";

export default function SignIn() {
  const { signIn } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await signIn(username, password);
      console.log("🔍 Respuesta de signIn:", response);
      if (!response.success) {
        setErrorMessage(response.message);
        return;
      }
      console.log("Usuario autenticado");
      router.replace("/");
    } catch (error) {
      console.warn("Error en inicio de sesión:", error.message);
      setErrorMessage("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="gray" />
      <View style={styles.form}>
        <Text style={styles.title}>Sign In</Text>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={handleLogin} disabled={loading}>
          <View style={styles.button}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  form: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  input: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  button: {
    width: "auto",
    margin: 10,
    padding: 10,
    backgroundColor: "#0EA5E9",
    color: "white",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});