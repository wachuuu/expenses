export enum TransactionType {
  CARD_PAYMENT = "Płatność kartą",
  ONLINE_PAYMENT = "Płatność web - kod mobilny",
  PHONE_TRANSFER_INTERNAL = "Przelew na telefon przychodz. wew.",
  PHONE_TRANSFER_EXTERNAL = "Przelew na telefon przychodz. zew.",
  ACCOUNT_TRANSFER = "Przelew z rachunku",
  INCOME_TRANSFER = "Przelew na konto",
  CARD_TRANSFER = "Przelew z karty",
  INSTANT_TRANSFER = "Przelew natychmiastowy",
  STANDING_ORDER = "Zlecenie stałe",
  TRANSPORT_TICKET = "TRANSPORT_TICKET_PAYMENT",
  ATM_WITHDRAWAL = "Wypłata w bankomacie - kod mobilny",
  PAYMENT = "Opłata",
  UNKNOWN = "UNKNOWN"
}