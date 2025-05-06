import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../../services/transactions.service';

@Component({
  selector: 'app-excel-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-export.component.html',
  styleUrl: './excel-export.component.scss'
})
export class ExcelExportComponent {
  copySuccess = false;
  
  constructor(private transactionsService: TransactionsService) {}
  
  copyToClipboard(): void {
    const excelText = this.transactionsService.generateExcelExport();
    
    if (!excelText || excelText === 'Category\tAmount\n') {
      alert('No data available to export');
      return;
    }
    
    navigator.clipboard.writeText(excelText).then(() => {
      this.copySuccess = true;
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        this.copySuccess = false;
      }, 3000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
      alert('Failed to copy to clipboard');
    });
  }
}
