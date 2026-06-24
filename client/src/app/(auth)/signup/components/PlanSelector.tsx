'use client';

type Plan = 'FREE_TRIAL' | 'BASIC' | 'PREMIUM';

interface PlanSelectorProps {
  selectedPlan: Plan;
  onSelect: (plan: Plan) => void;
}

const plans = [
  {
    id: 'FREE_TRIAL' as Plan,
    name: 'Free trial',
    price: '€0',
    period: '/ 14 days',
    description: 'Get started, no card needed',
    features: ['25 receipts included', 'All basic features', 'No credit card required'],
  },
  {
    id: 'BASIC' as Plan,
    name: 'Basic',
    price: '€19.99',
    period: '/ mo',
    description: 'For individuals and freelancers',
    features: ['Unlimited receipts', 'AI bookkeeper', 'Monthly reports'],
  },
  {
    id: 'PREMIUM' as Plan,
    name: 'Premium',
    price: '€39.99',
    period: '/ mo',
    description: 'For small businesses',
    badge: 'Most popular',
    features: ['Everything in Basic', 'Priority support', 'Advanced analytics'],
  },
];

export default function PlanSelector({ selectedPlan, onSelect }: PlanSelectorProps) {
  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground mb-3">Choose a plan</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className={`relative rounded-lg border p-4 cursor-pointer transition-colors ${
                isSelected
                  ? 'border-teal-700 border-2'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium">{plan.name}</p>
                  {plan.badge && (
                    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-teal-50 text-teal-800 mt-1">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isSelected ? 'bg-teal-700 border-teal-700' : 'border-muted-foreground'
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>

              <div className="mt-2 mb-1">
                <span className="text-lg font-medium">{plan.price}</span>
                <span className="text-xs text-muted-foreground ml-1">{plan.period}</span>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{plan.description}</p>

              <ul className="space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <svg
                      className="w-3.5 h-3.5 text-teal-700 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}