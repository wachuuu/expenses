import { TransactionType } from "../enums/transaction-type.enum";

export interface Transaction {
  date: string;                         // "Data operacji"
  currencyDate: string;                 // "Data waluty"
  type: TransactionType;                // "Typ transakcji"
  amount: number;                       // "Kwota"
  currency: string;                     // "Waluta"
  balanceAfter: number;                 // "Saldo po transakcji"
  description: string;                  // "Opis transakcji"
  extraDetails: Record<string, string>; // Dynamic key-value storage for additional fields
  recipientOrSender?: string;           // "Adres Odbiorcy/Nadawcy"
}