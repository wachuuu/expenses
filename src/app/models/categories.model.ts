import { FixedCost } from "./categories/fixed-cost.model";
import { Groceries } from "./categories/groceries.model";
import { Transaction } from "./transaction.model";

export interface Categories {
  fixedCost?: FixedCost;
  groceries?: Groceries;
  other: Transaction[];
}