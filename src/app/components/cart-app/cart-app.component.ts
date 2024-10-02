import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CatalogComponent } from "../catalog/catalog.component";
import { CartComponent } from "../cart/cart.component";
import { ItemCard } from '../../models/itemCart';
import { NavbarComponent } from "../navbar/navbar.component";
import { ModalCartComponent } from "../modal-cart/modal-cart.component";
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { ItemsState } from '../../store/items.reducer';
import { add, remove, total } from '../../store/items.action';

@Component({
  selector: 'app-cart-app',
  standalone: true,
  imports: [CatalogComponent, CartComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {
  products: Product[] = [];
  items: ItemCard[] = [];
  total!: number;
  showCart: boolean = false;
  constructor(
    private sharingDataService: SharingDataService,
    private router: Router,
    private store: Store<{ items: ItemsState }>
  ) {
    this.store.select('items').subscribe(state => {
      this.items = state.items;
      this.total = state.total;
      this.saveSession();
    });
  }

  ngOnInit(): void {
    this.store.dispatch(total());
    this.onDeleteCart();
    this.onAddCart();
  }

  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe(product => {
      this.store.dispatch(add({ product: product }));
      this.store.dispatch(total());
      this.router.navigate(['/cart']);
      Swal.fire({
        title: "Carro de compras",
        text: "Nuevo producto agregado!",
        icon: "success"
      });
    });
  }

  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id => {
      Swal.fire({
        title: "Esta seguro?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.store.dispatch(remove({ id }));
          this.store.dispatch(total());
          this.router.navigate(['/cart']);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
    });

  }

  saveSession(): void {
    sessionStorage.setItem('cardList', JSON.stringify(this.items));
  }

  openCart(): void {
    this.showCart = !this.showCart;
  }
}
