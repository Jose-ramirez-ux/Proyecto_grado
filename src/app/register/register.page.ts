import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  username: string = '';
  password: string = '';
  email: string = '';
  showSuccess: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  register() {
    // Aquí implementas tu lógica de registro
    this.authService.register(this.username, this.password, this.email).subscribe(
      response => {
        console.log('Registro exitoso', response);
        this.showSuccess = true;
        
        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          this.showSuccess = false;
          this.router.navigate(['/login']);
        }, 3000);
      },
      error => {
        console.error('Error en registro', error);
        this.showErrorToast();
      }
    );
  }

  async showErrorToast() {
    const toast = await this.toastController.create({
      message: 'Error al registrar usuario',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
