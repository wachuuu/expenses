import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-row.component.html',
  styleUrls: ['./category-row.component.scss']
})
export class CategoryRowComponent {
  @Input() categoryName: string = '';
  @Input() total: number = 0;
  @Input() isExpanded: boolean = false;
  @Output() toggleExpand = new EventEmitter<void>();
  
  toggle(): void {
    this.toggleExpand.emit();
  }
  
  // Prevent event propagation when clicking the button directly
  // so we don't trigger the row click event twice
  toggleButtonClick(event: Event): void {
    event.stopPropagation();
    this.toggle();
  }
}
