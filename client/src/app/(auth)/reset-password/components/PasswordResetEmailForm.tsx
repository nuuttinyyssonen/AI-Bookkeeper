'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FieldLabel, Field, FieldGroup, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useActionState, useEffect } from "react";
import { initialStateEmail } from "@/app/types/FormTypes";
import passwordResetLinkAction from "../action";
import { toast } from "sonner";

export default function PasswordResetEmailForm() {
    const [state, formAction, isPending] = useActionState(passwordResetLinkAction, initialStateEmail);

    useEffect(() => {
        if (state.error) toast.error(state.error);
    }, [state.error]);

    useEffect(() => {
        if (state.success) toast.success("Password reset link sent! Check your email.");
    }, [state.success]);

    return (
        <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] px-4 py-8 text-slate-950">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Email verification link</CardTitle>
                    <CardDescription>
                        Enter your email below
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
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Sending..." : "Send password reset link"}
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    <Link className="font-semibold text-teal-700 hover:underline" href="/login">Back to login</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
};