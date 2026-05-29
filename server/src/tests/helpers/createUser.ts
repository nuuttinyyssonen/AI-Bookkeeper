import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { supabase } from "../../lib/supabase";

export default async function createUser(email: string) {
    const password = "123456";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data: supabaseData, error: supabaseError } =
        await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });

    if (supabaseError || !supabaseData.user) {
        throw new Error("Failed to create Supabase test user");
    }

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            first_name: "test",
            last_name: "user",
            phonenumber: "040123456",
            supabase_id: supabaseData.user.id
        }
    });

    return user;
}