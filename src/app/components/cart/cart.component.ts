import { Component, EventEmitter } from '@angular/core';
import { ItemCard } from '../../models/itemCart';
import { Router } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  items: ItemCard[] = [];
  total!: number;


  constructor(
    private router: Router,
    private sharingDataService: SharingDataService
  ) {
    this.items = this.router.getCurrentNavigation()?.extras.state!['items'];
    this.total = this.router.getCurrentNavigation()?.extras.state!['total'];
  }

  onDeleteCart(id: number) {
    this.sharingDataService.idProductEventEmitter.emit(id);
  }
}
