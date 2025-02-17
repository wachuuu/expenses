import { Component } from '@angular/core';
import { FileParserService } from '../../services/file-parser.service';
import { CommonModule } from '@angular/common';
import { TransactionMapperService } from '../../services/transaction-mapper.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  parsedData: any[] = [];
  parsedTransactions: Transaction[] = [];

  constructor(private fileParserService: FileParserService, private transactionMapper: TransactionMapperService) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileParserService.parseCsv(file).then(data => {
        this.parsedData = data;
        this.parsedTransactions = this.transactionMapper.mapTransactions(data);
      }).catch(error => console.error('Error parsing CSV:', error));
    }
  }
}
