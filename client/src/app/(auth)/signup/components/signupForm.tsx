'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { initialStateSignup } from "@/app/types/FormTypes";
import signupAction from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SignupFormProps {
  selectedPlan: 'FREE_TRIAL' | 'BASIC' | 'PREMIUM';
}

export default function SignupForm({ selectedPlan }: SignupFormProps) {
    const t = useTranslations('signup');
    const [state, formAction, isPending] = useActionState(signupAction, initialStateSignup);

    useEffect(() => {
        if(state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] px-4 py-8 text-slate-950">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4" noValidate>
                        <FieldGroup>
                            <Field>
                                <input type="hidden" name="selectedPlan" value={selectedPlan} />
                                <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    autoComplete="email"
                                />
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="firstName">{t('firstName')}</FieldLabel>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="Matti"
                                        autoComplete="given-name"
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="lastName">{t('lastName')}</FieldLabel>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Meikalainen"
                                        autoComplete="family-name"
                                    />
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="phonenumber">{t('phonenumber')}</FieldLabel>
                                <Input
                                    id="phonenumber"
                                    name="phonenumber"
                                    type="tel"
                                    placeholder="0401234567"
                                    autoComplete="tel"
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="businessId">{t('businessId')}</FieldLabel>
                                <Input
                                    id="businessId"
                                    name="businessId"
                                    type="text"
                                    placeholder="1234567-8"
                                    autoComplete="off"
                                />
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder={t('password')}
                                        autoComplete="new-password"
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
                            </div>

                            <Field>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? t('submitting') : t('submit')}
                                </Button>
                                <FieldDescription className="px-6 text-center">
                                    {t('alreadyHaveAccount')} <Link className="font-semibold text-teal-700 hover:underline" href="/login">{t('signIn')}</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}