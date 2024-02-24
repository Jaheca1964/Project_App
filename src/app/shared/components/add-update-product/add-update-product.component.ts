import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  form = new FormGroup({
    Image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),
  });

  firebaseSvC = inject(FirebaseService);
  utilsSvC = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvC.getFromLocalStorage('user');
  }

  // ================= tomar/Seleccionar Imagen ========
  async takeImage() {
    const dataUrl = (await this.utilsSvC.takePicture('Imagen del Producto'))
      .dataUrl;
    this.form.controls.Image.setValue(dataUrl);
  }

  async submit() {
    if (this.form.valid) {
      let path = `users/${this.user.iud}/products`;

      const loading = await this.utilsSvC.loading();
      await loading.present();

      // === Subir la imagen y obtener la url ===
      let dataUrl = this.form.value.Image;
      let imagePath = `${this.user.iud}/${Date.now()}`;
      let imageUrl = await this.firebaseSvC.uploadingImage(imagePath, dataUrl);
      this.form.controls.Image.setValue(imageUrl);

      this.firebaseSvC
        .addDocument(path, this.form.value)
        .then(async (res) => {
          this.utilsSvC.dismissModal({ success: true });

          this.utilsSvC.presentToast({
            message: 'Producto creado exitosamente',
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon: 'checkmark-circle-outline',
          });
        })
        .catch((error) => {
          console.log(error);

          this.utilsSvC.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }
}
