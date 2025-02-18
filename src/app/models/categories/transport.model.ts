import { Transaction } from "../transaction.model";

export interface Transport {
  fuel: Transaction[];
  publicTransport: Transaction[];
  taxi: Transaction[];
}