'use client';

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import loginAction from "../actions";
import { initialState } from "@/app/types/FormTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);
    const searchParams = useSearchParams();
    const hasShownToast = useRef(false);

    useEffect(() => {
        const message = searchParams.get("message");
        if (message === "logged-out" && !hasShownToast.current) {
            hasShownToast.current = true;
            toast.success("Logged out successfully");
        }

        if (message === "account-created" && !hasShownToast.current) {
            hasShownToast.current = true;
            toast.success("Account created successfully!");
        }
    }, [searchParams]);

    useEffect(() => {
        if(state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] px-4 py-8 text-slate-950">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Log in</CardTitle>
                    <CardDescription>
                        Enter your details below to continue to your workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4" noValidate>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    autoComplete="email"
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="current-password"
                                />
                            </Field>

                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Logging in..." : "Log in"}
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    New here? <Link className="font-semibold text-teal-700 hover:underline" href="/signup">Create an account</Link>
                                </FieldDescription>
                                <FieldDescription className="px-6 text-center">
                                    Forgot your password? <Link className="font-semibold text-teal-700 hover:underline" href="/reset-password">Reset your password</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}
