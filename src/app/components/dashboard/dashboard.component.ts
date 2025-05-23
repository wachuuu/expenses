import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { BaseCategoriesComponent } from '../categories/base-categories/base-categories.component';
import { CustomCategoriesComponent } from '../categories/custom-categories/custom-categories.component';
import { ExcelExportComponent } from '../export/excel-export/excel-export.component';
import { TransactionSummaryComponent } from '../transaction-summary/transaction-summary.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadComponent,
    CategoryFormComponent,
    BaseCategoriesComponent,
    CustomCategoriesComponent,
    ExcelExportComponent,
    TransactionSummaryComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Dashboard component logic can go here
}
