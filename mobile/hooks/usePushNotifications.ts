import { useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import api from "../services/api";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true     
    }),
});

const setupAndroidChannel = async () => {
    if (Platform.OS !== "android") return;

    await Notifications.setNotificationChannelAsync("default", {
        name: "Yleiset ilmoitukset",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#0f172a",
    });
};

export const usePushNotifications = () => {
    const [pushToken, setPushToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const registerForPushNotifications = async () => {
        if (!Device.isDevice) {
            setError("Push-ilmoitukset vaativat oikean laitteen (ei simulaattoria/emulaattoria)")
            return null;
        }

        await setupAndroidChannel();

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            setError("Ilmoituslupaa ei myönnetty.");
            return null;
        }

        const projectId = Constants?.expoConfig?.extra?.eas?.projectId;

        if (!projectId) {
            setError("EAS projectId puuttuu app.json:sta.");
            return null;
        }

        try {
            const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
            setPushToken(token);
            await api.put("/api/user/push-token", { push_token: token });
            return token;
        } catch (e) {
            setError("Push-tokenin hakeminen epäonnistui.");
            return null;
        }
    };

    return { pushToken, error, registerForPushNotifications };
};