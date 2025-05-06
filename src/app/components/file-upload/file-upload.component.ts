import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { Observable } from 'rxjs';
import { BaseCategories } from '../../models/categories.model';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  constructor(private transactionsService: TransactionsService) { }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.transactionsService.processTransactionsFromFile(file)
    } else {
      console.error('No file selected');
    }
  }
}
