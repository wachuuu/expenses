import { FixedCost } from "./categories/fixed-cost.model";
import { Groceries } from "./categories/groceries.model";
import { Transport } from "./categories/transport.model";
import { Transaction } from "./transaction.model";

export interface BaseCategories {
  fixedCost?: FixedCost;
  groceries?: Groceries;
  transport?: Transport;
  transferedSavings?: Transaction[];
  mobilePayments?: Transaction[];
  cardPayments?: Transaction[];
  onlinePayments?: Transaction[];
  other: Transaction[];
}

export interface CustomCategories {
  [key: string]: Transaction[];
}