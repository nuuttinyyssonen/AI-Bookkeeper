'use client';

import Link from "next/link";
import { useState } from "react";

import ToggleButton from "./ToggleButton";
import PricingCards from "./PricingCards";

interface Props {
    subscription: any
}

export default function PricingProvider({ subscription }: Props) {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] px-4 py-8">
            <div className="w-full max-w-4xl space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-semibold text-slate-950">Choose your plan</h1>
                    <p className="text-sm text-muted-foreground">Upgrade or downgrade at any time</p>
                </div>

                <ToggleButton isYearly={isYearly} setIsYearly={setIsYearly}/>
                <PricingCards isYearly={isYearly} subscription={subscription}/>
                
                <div className="text-center">
                    <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-slate-700 underline">
                        Back to dashboard
                    </Link>
                </div>
            </div>
        </main>
    );
}