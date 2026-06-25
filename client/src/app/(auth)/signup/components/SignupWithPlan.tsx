'use client';

import { useState } from 'react';
import SignupForm from './signupForm';
import PlanSelector from './PlanSelector';

type Plan = 'FREE_TRIAL' | 'BASIC' | 'PREMIUM';

export default function SignupWithPlan() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('FREE_TRIAL');

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] px-4 py-8 text-slate-950">
      <div className="w-full max-w-2xl space-y-4">
        <PlanSelector selectedPlan={selectedPlan} onSelect={setSelectedPlan} />
        <SignupForm selectedPlan={selectedPlan} />
      </div>
    </main>
  );
}