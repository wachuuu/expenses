import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  name: string = '';

  constructor(private transactionsService: TransactionsService) { }

  addCategory() {
    this.transactionsService.addCustomCategory(this.name);
    this.name = '';
  }
}