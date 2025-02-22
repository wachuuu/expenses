import { Component } from '@angular/core';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FixedCostComponent } from './components/categories/fixed-cost/fixed-cost.component';
import { GroceriesComponent } from "./components/categories/groceries/groceries.component";

@Component({
  selector: 'app-root',
  imports: [FileUploadComponent, FixedCostComponent, GroceriesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
