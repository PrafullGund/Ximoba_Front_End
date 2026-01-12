import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  showCartData: any;
  totalprice: number = 0;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getCartProduct().subscribe(data => {
      this.showCartData = data.items;
      this.totalprice = data.totalPrice;
    });
  }

  increment(index: number) {
    this.showCartData[index].quantity++;
    this.updateTotalPrice(index);
  }

  decrement(index: number) {
    if (this.showCartData[index].quantity > 1) {
      this.showCartData[index].quantity--;
      this.updateTotalPrice(index);
    }
  }

  updateTotalPrice(index: number) {
    const product = this.showCartData[index];
    product.productTotalPrice = product.productPrice * product.quantity;
    this.totalprice = this.showCartData.reduce((acc: number, item: any) => acc + item.productTotalPrice, 0);
  }

  deleteCartProduct(productId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.dashboardService.deleteCartProduct(productId).subscribe(
          response => {
            Swal.fire('Success', 'Your item was deleted successfully.', 'success');
            this.dashboardService.getCartProduct().subscribe(data => {
              this.showCartData = data.items;
              this.totalprice = data.totalPrice;
            });
          },
          error => {
            Swal.fire('Error', 'There was a problem deleting the item.', 'error');
          }
        );
      } else if (result.isDismissed) {
        Swal.fire('Cancelled', 'Your item is safe.', 'info');
      }
    });
  }
}
