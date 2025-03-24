export interface Session {
  ip: string;
  user_id: string;
  location?: string;
  info: object;
}

export type SM = {
  name: string;
  link: string;
};

export enum TypeCategory {
  PHONE = 'PHONE',
  ELECTRONICS = 'ELECTRONICS',
  LAPTOP = 'LAPTOP',
  ACCESSORIES = 'ACCESSORIES',
}

export enum Currency {
  USD = 'USD',
  SUM = 'SUM',
}

export enum Condition {
  NEW = 'NEW',
  USED = 'USED',
}

export enum TradeType {
  FREE = 'FREE',
  PAID = 'PAID',
  BARTER = 'BARTER',
}
