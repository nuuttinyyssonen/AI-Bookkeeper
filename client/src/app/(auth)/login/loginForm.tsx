'use client';

import { useActionState } from "react";
import loginAction from "./actions";
import { initialState } from "@/app/types/FormTypes";

export default function LoginForm() {
    const [state, formAction] = useActionState(loginAction, initialState);
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
                <button type="submit">Login</button>
            </form>
        </div>
    )
}