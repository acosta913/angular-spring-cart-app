import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { ItemCard } from '../../models/itemCart';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @Input() items: ItemCard[] = [];
  @Input() total!: number;
  // @Output() openCartEventEmitter = new EventEmitter;

  // openCart(): void {
  //   this.openCartEventEmitter.emit();
  // }
}
