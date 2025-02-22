import { Component } from '@angular/core';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FixedCostComponent } from './components/categories/fixed-cost/fixed-cost.component';
import { GroceriesComponent } from "./components/categories/groceries/groceries.component";
import { TransportComponent } from "./components/categories/transport/transport.component";
import { OnlinePaymentsComponent } from "./components/categories/online-payments/online-payments.component";
import { OthersComponent } from "./components/categories/others/others.component";
import { MobilePaymentsComponent } from "./components/categories/mobile-payments/mobile-payments.component";

@Component({
  selector: 'app-root',
  imports: [FileUploadComponent, FixedCostComponent, GroceriesComponent, TransportComponent, OnlinePaymentsComponent, OthersComponent, MobilePaymentsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
