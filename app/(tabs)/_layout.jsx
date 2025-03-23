import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFD700", 
        tabBarInactiveTintColor: "#aaa",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        headerStyle: {
          backgroundColor: "#1E1E1E", 
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292E",
          borderTopWidth: 1,
          borderTopColor: "#333", 
          paddingBottom: 5,
          paddingTop: 5,
          height: 60, 
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notis"
        options={{
          title: "Locales",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="push"
        options={{
          title: "Push",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "paper-plane" : "paper-plane-outline"}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}