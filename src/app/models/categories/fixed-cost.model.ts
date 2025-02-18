import { Transaction } from "../transaction.model";

export interface FixedCost {
  rent: Transaction[];
  internet: Transaction[];
  subscriptions: Record<string, Transaction[]>;
}