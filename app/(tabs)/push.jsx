import { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, Alert, Platform, StyleSheet } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import Ionicons from "@expo/vector-icons/Ionicons";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Función para enviar una notificación push
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "🔔 Nueva Notificación",
    body: "Este es un mensaje de prueba.",
    data: { someData: "Información adicional aquí" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

// Función para registrar el dispositivo y obtener el token
async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Permiso Denegado", "No se otorgaron permisos para notificaciones.");
      return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      Alert.alert("Error", "No se encontró el Project ID.");
      return;
    }

    try {
      const pushTokenString = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Expo Push Token:", pushTokenString);
      return pushTokenString;
    } catch (e) {
      Alert.alert("Error", "No se pudo obtener el token de notificaciones.");
    }
  } else {
    Alert.alert("Error", "Debes usar un dispositivo físico para recibir notificaciones.");
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Ionicons name="notifications" size={28} color="#000" /> Notificaciones Push
      </Text>

      {expoPushToken ? (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenText}>
            <Ionicons name="key" size={16} color="#007BFF" /> Token de Notificación:
          </Text>
          <Text selectable style={styles.tokenValue}>{expoPushToken}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={async () => await sendPushNotification(expoPushToken)}>
        <Ionicons name="send" size={18} color="#fff" />
        <Text style={styles.buttonText}> Enviar Notificación</Text>
      </TouchableOpacity>

      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationTitle}>
            <Ionicons name="mail" size={16} color="#333" /> Notificación Recibida
          </Text>
          <Text style={styles.notificationText}>
            <Ionicons name="bookmark" size={14} color="#333" /> <Text style={styles.bold}>Título:</Text> {notification.request.content.title}
          </Text>
          <Text style={styles.notificationText}>
            <Ionicons name="chatbubble" size={14} color="#333" /> <Text style={styles.bold}>Mensaje:</Text> {notification.request.content.body}
          </Text>
          <Text style={styles.notificationText}>
            <Ionicons name="information-circle" size={14} color="#333" /> <Text style={styles.bold}>Datos:</Text> {JSON.stringify(notification.request.content.data)}
          </Text>
        </View>
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
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    flexDirection: "row",
    alignItems: "center",
  },
  tokenContainer: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  tokenText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007BFF",
    flexDirection: "row",
    alignItems: "center",
  },
  tokenValue: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  notificationContainer: {
    backgroundColor: "#FFF3CD",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFEEBA",
    padding: 15,
    alignItems: "center",
    width: "90%",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flexDirection: "row",
    alignItems: "center",
  },
  notificationText: {
    fontSize: 14,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
});