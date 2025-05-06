import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCategoriesComponent } from '../base-categories/base-categories.component';
import { CustomCategoriesComponent } from '../custom-categories/custom-categories.component';

@Component({
  selector: 'app-categories-container',
  standalone: true,
  imports: [CommonModule, BaseCategoriesComponent, CustomCategoriesComponent],
  template: `
    <div class="categories-wrapper">
      <h2 class="categories-title">Transaction Categories</h2>
      <div class="categories-grid">
        <div class="base-categories">
          <h3 class="category-section-title">Base Categories</h3>
          <app-base-categories></app-base-categories>
        </div>
        <div class="custom-categories">
          <h3 class="category-section-title">Custom Categories</h3>
          <app-custom-categories></app-custom-categories>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-wrapper {
      padding: 1rem;
      font-family: Arial, sans-serif;
    }
    
    .categories-title {
      margin-bottom: 1.5rem;
      color: #333;
      border-bottom: 2px solid #eee;
      padding-bottom: 0.5rem;
    }
    
    .category-section-title {
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
      color: #555;
    }
    
    .categories-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 1rem;
    }
    
    .base-categories, .custom-categories {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 1rem;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    @media (max-width: 768px) {
      .categories-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CategoriesContainerComponent {}
