import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { Observable } from 'rxjs';
import { Categories } from '../../models/categories.model';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  transactions$: Observable<Transaction[]>;
  categories$: Observable<Categories>;

  constructor(private transactionsService: TransactionsService) {
    this.transactions$ = this.transactionsService.transactions$;
    this.categories$ = this.transactionsService.categories$;
  }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.transactionsService.processTansactionsFromFile(file)
    } else {
      console.error('No file selected');
    }
  }
}
