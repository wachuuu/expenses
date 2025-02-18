import { FixedCost } from "./categories/fixed-cost.model";
import { Groceries } from "./categories/groceries.model";
import { Transport } from "./categories/transport.model";
import { Transaction } from "./transaction.model";

export interface Categories {
  fixedCost?: FixedCost;
  groceries?: Groceries;
  transport?: Transport;
  mobilePayments?: Transaction[];
  other: Transaction[];
}