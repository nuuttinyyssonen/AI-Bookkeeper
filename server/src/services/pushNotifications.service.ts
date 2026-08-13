import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { prisma } from "../lib/prisma";

const expo = new Expo();

/**
 * Sends a push notification to a user via their stored Expo push token.
 * Silently no-ops if the user has no token or the token is invalid.
 * @param {string} userId - Target user's id
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {Record<string, unknown>} data - Optional payload, e.g. `{ screen: "Receipts" }` for navigation on tap
 */
export const sendPushNotification = async (
    userId: string,
    title: string,
    body: string,
    data: Record<string, unknown> = {}
): Promise<boolean> => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user?.push_token || !Expo.isExpoPushToken(user.push_token)) {
        return false;
    }

    const message: ExpoPushMessage = {
        to: user.push_token,
        sound: "default",
        title,
        body,
        data,
    };

    try {
        await expo.sendPushNotificationsAsync([message]);
        return true;
    } catch (error) {
        console.error("Failed to send push notification", error);
        return false;
    }
};
