import { Component } from '@angular/core';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FixedCostComponent } from './components/categories/fixed-cost/fixed-cost.component';
import { GroceriesComponent } from "./components/categories/groceries/groceries.component";
import { TransportComponent } from "./components/categories/transport/transport.component";
import { OnlinePaymentsComponent } from "./components/categories/online-payments/online-payments.component";
import { OthersComponent } from "./components/categories/others/others.component";
import { MobilePaymentsComponent } from "./components/categories/mobile-payments/mobile-payments.component";
import { TransactionsService } from './services/transactions.service';
import { Observable } from 'rxjs';
import { PricePipe } from "./pipes/price.pipe";
import { CommonModule } from '@angular/common';
import { CardPaymentsComponent } from './components/categories/card-payments/card-payments.component';
import { CategoryFormComponent } from "./components/category-form/category-form.component";
import { CustomCategoriesComponent } from './components/categories/custom-categories/custom-categories.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule, 
    FileUploadComponent, 
    FixedCostComponent, 
    GroceriesComponent, 
    TransportComponent, 
    CardPaymentsComponent, 
    OnlinePaymentsComponent, 
    OthersComponent, 
    MobilePaymentsComponent,
    CustomCategoriesComponent, 
    PricePipe, 
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
