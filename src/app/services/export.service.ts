import { Injectable } from '@angular/core';
import { BaseCategories, CustomCategories } from '../models/categories.model';
import { HelperService } from './shared/helper.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(
    private helperService: HelperService
  ) {}

  generateExcelExport(
    baseCategories: BaseCategories, 
    customCategories: CustomCategories, 
    income: number,
    expenses: number,
    balance: number
  ): string {
    let excelText = '';
    
    excelText += 'Kategorie\n';

    // Process base categories
    if (baseCategories.fixedCost) {
      excelText += `Koszty stałe\t${this.formatNumberForExcel(this.helperService.getCategoryTotal(baseCategories.fixedCost))}\n`;
    }
    if (baseCategories.groceries) {
      excelText += `Zakupy\t${this.formatNumberForExcel(this.helperService.getCategoryTotal(baseCategories.groceries))}\n`;
    }
    if (baseCategories.transport) {
      excelText += `Transport\t${this.formatNumberForExcel(this.helperService.getCategoryTotal(baseCategories.transport))}\n`;
    }
    if (baseCategories.mobilePayments) {
      excelText += `Płatności mobilne/BLIK\t${this.formatNumberForExcel(this.helperService.getSectionTotal(baseCategories.mobilePayments))}\n`;
    }
    if (baseCategories.cardPayments) {
      excelText += `Płatności kartą\t${this.formatNumberForExcel(this.helperService.getSectionTotal(baseCategories.cardPayments))}\n`;
    }
    if (baseCategories.onlinePayments) {
      excelText += `Płatności interentowe\t${this.formatNumberForExcel(this.helperService.getSectionTotal(baseCategories.onlinePayments))}\n`;
    }
    if (baseCategories.other?.length > 0) {
      excelText += `Inne\t${this.formatNumberForExcel(this.helperService.getSectionTotal(baseCategories.other))}\n`;
    }

    // Process custom categories
    for (const [category, transactions] of Object.entries(customCategories)) {
      if (transactions.length > 0) {
        excelText += `${category}\t${this.formatNumberForExcel(this.helperService.getSectionTotal(transactions))}\n`;
      }
    }

    excelText += '\n';
    excelText += `Przychody\t${this.formatNumberForExcel(income)}\n`;
    excelText += `Wydatki\t${this.formatNumberForExcel(expenses)}\n`;
    excelText += `Oszczędności\t${this.formatNumberForExcel(balance)}\n\n`;

    return excelText;
  }

  /**
   * Formats a number for Excel export:
   * - Rounds to 2 decimal places
   * - Replaces decimal point with comma for Excel compatibility
   */
  private formatNumberForExcel(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }
}
