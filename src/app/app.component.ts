import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionsService } from './services/transactions.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  total$: Observable<number>;
  
  constructor(private transactionsService: TransactionsService) {
    this.total$ = this.transactionsService.total$;
  }
}
