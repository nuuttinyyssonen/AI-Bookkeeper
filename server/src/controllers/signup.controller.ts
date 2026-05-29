import { prisma } from '../lib/prisma';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../lib/supabase';

export const signupController = async (req: Request, res: Response) => {
    const { email, password, first_name, last_name, phonenumber } = req.body;

    if(!(email && password && first_name && last_name && phonenumber)) {
        return res.status(400).json({ "error": "All fields are required" });
    }
    
    // Password valdiation
    if (password.length < 5) {
        return res.status(400).json({ "error": "Password must be more than 5 characters" });
    }

     // Querying user to see if it already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return res.status(409).json({ error: "Email is already in use" });
    }

    // Password hashing
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Creating user in Supabase Auth
    const { data: supabaseData, error: supabaseError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });

    if (supabaseError || !supabaseData.user) {
        return res.status(500).json({ error: "Failed to create user in Supabase" });
    }

    // Creating user in database
    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
                first_name,
                last_name,
                phonenumber,
                supabase_id: supabaseData.user.id
            }
        });

        return res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name
        });
    } catch (error) {
        // Jos Prisma epäonnistuu, poistetaan Supabase käyttäjä
        await supabase.auth.admin.deleteUser(supabaseData.user.id);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};