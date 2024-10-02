import { Component, Input } from '@angular/core';
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
  // @Output() openCartEventEmitter = new EventEmitter;

  // openCart(): void {
  //   this.openCartEventEmitter.emit();
  // }
}
