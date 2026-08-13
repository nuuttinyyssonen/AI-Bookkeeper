import { getUserData, updateUserData, deleteUser, getUserSubscription, updatePushToken } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/authentication";
import { rateLimiters } from "../utils/rateLimiter";
import { NextFunction, Router, Request, Response } from "express";
import { sendPushNotification } from "../services/pushNotifications.service";

// Router
const userRouter = Router();

userRouter.get("/", authMiddleware, rateLimiters.read("get_user_data"), getUserData);
userRouter.put("/", authMiddleware, rateLimiters.write("update_user_data"), updateUserData);
userRouter.delete("/", authMiddleware, rateLimiters.sensitive("delete_user"), deleteUser);
userRouter.get("/subscription", authMiddleware, rateLimiters.read("get_subscription"), getUserSubscription);
userRouter.put("/push-token", authMiddleware, rateLimiters.write("push-token"), updatePushToken);
// Test route for push notification
userRouter.post("/push-token/test", authMiddleware, rateLimiters.write("test-push-token"), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sent = await sendPushNotification(req.user.id, "Testi-ilmoitus", "Jos näet tämän, putki toimii!", { screen: "Profile" });
        if (!sent) {
            return res.status(422).json({ message: "No valid push token for this user" });
        }
        res.status(200).json({ message: "Test notification sent" });
    } catch(error) {
        next(error);
    }
});

export default userRouter;