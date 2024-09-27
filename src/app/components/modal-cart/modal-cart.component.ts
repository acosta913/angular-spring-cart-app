import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemCard } from '../../models/itemCart';
import { CartComponent } from "../cart/cart.component";

@Component({
  selector: 'app-modal-cart',
  standalone: true,
  imports: [CartComponent],
  templateUrl: './modal-cart.component.html'
})
export class ModalCartComponent {
  @Input() items: ItemCard[] = [];
  @Input() total!: number;
  @Output() idProductEventEmitter = new EventEmitter;
  @Output() openCartEventEmitter = new EventEmitter;

  onDeleteCart(id: number) {
    this.idProductEventEmitter.emit(id);
  }
  openCart(): void {
    this.openCartEventEmitter.emit();
  }
}
