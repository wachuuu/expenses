import { Component } from '@angular/core';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FixedCostComponent } from './components/categories/fixed-cost/fixed-cost.component';

@Component({
  selector: 'app-root',
  imports: [FileUploadComponent, FixedCostComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
