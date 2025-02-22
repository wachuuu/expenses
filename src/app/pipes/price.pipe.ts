import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {
  
  transform(value: number, currency: string = 'PLN'): string {
    if (isNaN(value)) {
      return 'Invalid price';
    }

    return `${value.toFixed(2)} ${currency}`;
  }
}
