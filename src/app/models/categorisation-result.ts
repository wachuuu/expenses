import { Transaction } from "./transaction.model";

export interface CategorisationResult<T> {
  categorizedData: T;
  remainingTransactions: Transaction[];
}