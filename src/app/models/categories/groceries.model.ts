import { Transaction } from "../transaction.model";

export interface Groceries {
  biedronka: Transaction[];
  lidl: Transaction[];
  kaufland: Transaction[];
  dino: Transaction[];
  zabka: Transaction[];
}