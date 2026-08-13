'use client';

import { useState } from 'react';
import SignupForm from './signupForm';
import PlanSelector from './PlanSelector';

type Plan = 'BASIC' | 'PREMIUM';

export default function SignupWithPlan() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('BASIC');

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),linear-gradient(135deg,#f8fafc_0%,#eef2f7_48%,#fff7ed_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.15),transparent_34%),linear-gradient(135deg,#020617_0%,#0f172a_48%,#1c1917_100%)] px-4 py-8 text-slate-950 dark:text-slate-50">
      <div className="grid w-full max-w-4xl grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <PlanSelector selectedPlan={selectedPlan} onSelect={setSelectedPlan} />
        <SignupForm selectedPlan={selectedPlan} />
      </div>
    </main>
  );
}