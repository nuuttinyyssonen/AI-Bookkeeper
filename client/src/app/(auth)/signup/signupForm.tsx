'use client';

import { useActionState } from "react";
import { initialStateSignup } from "@/app/types/FormTypes";
import signupAction from "./actions";

export default function SignupForm() {
    const [state, formAction] = useActionState(signupAction, initialStateSignup);
    return (
        <div>
            <form action={formAction}>
                <input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@gmail.com"
                />
                <input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                />
                <input 
                    id="passwordRepeat"
                    name="passwordRepeat"
                    type="password"
                    placeholder="Confirm Password"
                />
                <input 
                    id="firstName"
                    name="firstName"
                    type="firstName"
                    placeholder="Your first name..."
                />
                <input 
                    id="lastName"
                    name="lastName"
                    type="lastName"
                    placeholder="Your last name..."
                />
                <input 
                    id="phonenumber"
                    name="phonenumber"
                    type="phonenumber"
                    placeholder="Your phonenumber..."
                />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};
