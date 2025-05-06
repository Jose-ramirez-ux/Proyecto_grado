import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        console.log('Login exitoso', response);
        this.router.navigate(['/home']);
      },
      (error: any) => {
        console.error('Error en login', error);
        this.errorMessage = 'Error al iniciar sesión';
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
