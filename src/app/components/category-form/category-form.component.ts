import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  name: string = '';
  showError: boolean = false;
  errorMessage: string = '';
  showSuccess: boolean = false;
  existingCategories: string[] = [];
  isSubmitting: boolean = false;

  constructor(private transactionsService: TransactionsService) {
    this.transactionsService.getCustomCategoriesNames().subscribe(categories => {
      this.existingCategories = categories;
    });
  }

  validateName(): boolean {
    this.showError = false;
    this.errorMessage = '';
    
    if (!this.name.trim()) {
      this.showError = true;
      this.errorMessage = 'Category name cannot be empty';
      return false;
    }
    
    if (this.name.length < 3) {
      this.showError = true;
      this.errorMessage = 'Category name must be at least 3 characters';
      return false;
    }
    
    if (this.existingCategories.includes(this.name)) {
      this.showError = true;
      this.errorMessage = 'This category already exists';
      return false;
    }
    
    return true;
  }

  addCategory() {
    if (!this.validateName()) return;
    
    this.isSubmitting = true;
    this.transactionsService.addCustomCategory(this.name);
    
    // Show success message and reset form
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
    
    this.name = '';
    this.isSubmitting = false;
  }
}