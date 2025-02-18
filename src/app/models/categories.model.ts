import { FixedCost } from "./categories/fixed-cost.model";
import { Transaction } from "./transaction.model";

export interface Categories {
  fixedCost?: FixedCost;
  other: Transaction[];
}