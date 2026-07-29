export const PLAN_OPTIONS = [
  {
    value: "BASIC",
    label: "Básico",
    prefix: "BAS",
    description: "Organização essencial para começar.",
  },
  {
    value: "PRO",
    label: "Pro",
    prefix: "PRO",
    description: "Mais recursos para crescer e acompanhar resultados.",
  },
  {
    value: "PREMIUM",
    label: "Premium",
    prefix: "PRE",
    description: "Estrutura completa para operações maiores.",
  },
] as const

export type SubscriptionPlanCode = (typeof PLAN_OPTIONS)[number]["value"]

export function isSubscriptionPlanCode(
  value: unknown,
): value is SubscriptionPlanCode {
  return PLAN_OPTIONS.some((plan) => plan.value === value)
}

export function getPlanDetails(plan: SubscriptionPlanCode) {
  return PLAN_OPTIONS.find((option) => option.value === plan)!
}

