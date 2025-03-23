import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

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
        <Ionicons name="notifications" size={24} color="#333" /> Notificaciones Locales
      </Text>

      {expoPushToken ? (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenText}>
            <Ionicons name="key" size={16} color="#007BFF" /> Token de Notificación:
          </Text>
          <Text selectable style={styles.tokenValue}>{expoPushToken}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={schedulePushNotification}>
        <Ionicons name="send" size={16} color="#fff" />
        <Text style={styles.buttonText}> Enviar Notificación</Text>
      </TouchableOpacity>

      {notification && (
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationTitle}>
            <Ionicons name="mail" size={16} color="#333" /> Notificación Recibida
          </Text>
          <Text style={styles.notificationText}>
            <Text style={styles.bold}>
              <Ionicons name="bookmark" size={14} color="#333" /> Título:
            </Text> {notification.request.content.title}
          </Text>
          <Text style={styles.notificationText}>
            <Text style={styles.bold}>
              <Ionicons name="chatbubble" size={14} color="#333" /> Mensaje:
            </Text> {notification.request.content.body}
          </Text>
        </View>
      )}
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📬 Notificación local",
      body: "Este es un mensaje de prueba desde la app.",
      data: { extraData: "Soy Sans" },
      sound: "default",
    },
    trigger: { seconds: 5 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
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
      Alert.alert("Permisos denegados", "No se otorgaron permisos para notificaciones.");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    Alert.alert("Error", "Debes usar un dispositivo físico para recibir notificaciones.");
  }

  return token;
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