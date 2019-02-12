export enum PlanTypeOrder {
    error,
    medical = 1,
    dental,
    vision,
    mentalHealth,
    pharmacy
}

export type PlanEntityMemberType = 'Subscriber' | 'Spouse' | 'Dependant' | 'Dependant over 18 years';
