import { User } from './../../../models/user.model';
import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from '../../../shared/components/add-update-product/add-update-product.component';
import { Product } from 'src/app/models/products.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  products: Product[] = [];

  ngOnInit() {}

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }
  ionViewWillEnter() {
    this.getProducts();
  }

  //====== Obtener productos ======
  getProducts() {
    let path = `users/${this.user().iud}/products`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        sub.unsubscribe();
      },
    });
  }

  // ====== Agregar o actualizar producto =======
  AddUpdateProduct() {
    this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
    });
  }
}
