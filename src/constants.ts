export const PLANS = { free: 'free', starter: 'starter' } as const
export type TPlans = keyof typeof PLANS
