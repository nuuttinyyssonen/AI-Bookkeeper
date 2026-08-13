'use client';

import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FieldLabel, Field, FieldGroup, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useActionState, useEffect } from "react";
import resetPassword from "../action";
import { intialStatePassword } from "@/app/types/FormTypes";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function PasswordResetForm() {
    const t = useTranslations('resetPassword');
    const [state, formAction, isPending] = useActionState(resetPassword, intialStatePassword);
    const { id } = useParams();

    useEffect(() => {
        if (state.error) toast.error(state.error);
    }, [state.error]);

    return (
        <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.15),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#1c1917_100%)] px-4 py-8 text-slate-950 dark:text-slate-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4" noValidate>
                        <input type="hidden" name="id" value={id ?? ""} />
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={t('password')}
                                    autoComplete="current-password"
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="passwordRepeat">{t('confirmPassword')}</FieldLabel>
                                <Input
                                    id="passwordRepeat"
                                    name="passwordRepeat"
                                    type="password"
                                    placeholder={t('repeatPassword')}
                                    autoComplete="new-password"
                                />
                            </Field>

                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? t('submitting') : t('submit')}
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    <Link className="font-semibold text-teal-700 dark:text-teal-200 hover:underline" href="/login">{t('backToLogin')}</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}