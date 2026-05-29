import { prisma } from "../../lib/prisma";

export default async function createUser(email: string) {
    const data = {
        email: email,
        password: "123456",
        first_name: "test",
        last_name: "user",
        phonenumber: "040123456"
    };
    const user = await prisma.user.create({data});

    return user;
};