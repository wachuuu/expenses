import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseCategoriesComponent } from './components/categories/base-categories/base-categories.component';
import { CustomCategoriesComponent } from './components/categories/custom-categories/custom-categories.component';
import { CategoryFormComponent } from "./components/category-form/category-form.component";
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TransactionsService } from './services/transactions.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    FileUploadComponent, 
    BaseCategoriesComponent,
    CustomCategoriesComponent, 
    CategoryFormComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  total$: Observable<number>;
  
  constructor(private transactionsService: TransactionsService) {
    this.total$ = this.transactionsService.total$;
  }
}
