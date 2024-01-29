import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseSvC = inject(FirebaseService);
  utilsSvC = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvC.loading();
      await loading.present();

      this.firebaseSvC.signUp(this.form.value as User).then(async res => {

       await this.firebaseSvC.updateUser(this.form.value.name);
          console.log(res);


        }).catch((error) => {
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
