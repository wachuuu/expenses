import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../models/transaction.model';
import { TransactionsService } from '../../services/transactions.service';
import { Observable } from 'rxjs';
import { BaseCategories } from '../../models/categories.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  isDragging = false;
  isUploading = false;
  uploadSuccess = false;
  uploadError = false;
  errorMessage = '';
  fileName = '';

  constructor(private transactionsService: TransactionsService) { }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      await this.processFile(file);
    }
  }

  async processFile(file: File) {
    this.resetStatus();
    this.isUploading = true;
    this.fileName = file.name;
    
    try {
      await this.transactionsService.processTransactionsFromFile(file);
      this.uploadSuccess = true;
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        this.uploadSuccess = false;
      }, 3000);
      
    } catch (error) {
      this.uploadError = true;
      this.errorMessage = error instanceof Error ? error.message : 'An error occurred during file upload';
      console.error('Error processing file:', error);
    } finally {
      this.isUploading = false;
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  resetStatus() {
    this.isUploading = false;
    this.uploadSuccess = false;
    this.uploadError = false;
    this.errorMessage = '';
  }
}
