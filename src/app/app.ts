
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagingService } from './services/messaging.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container">
      <header class="header">
        <div>
          <h1>Pedidos360</h1>
          <p>Plataforma de notificaciones</p>
        </div>

        <button *ngIf="loggedIn" class="logout"
          type="button" (click)="logout()">
          Cerrar sesión
        </button>
      </header>

      <section *ngIf="!loggedIn" class="login">
        <h2>Bienvenido</h2>
        <p>Inicia sesión para acceder a Pedidos360.</p>

        <form (ngSubmit)="login()">
          <label>Usuario</label>
          <input name="username"
            [(ngModel)]="username"
            autocomplete="username" required>

          <label>Contraseña</label>
          <input name="password" type="password"
            [(ngModel)]="password"
            autocomplete="current-password" required>

          <p *ngIf="loginError" class="error">{{ loginError }}</p>

          <button type="submit" class="primary">
            Iniciar sesión
          </button>
        </form>

        <p class="notice">
          Acceso local de demostración. No es autenticación real de Microsoft.
        </p>
      </section>

      <section *ngIf="loggedIn">
        <p class="welcome">
          Sesión iniciada como <strong>{{ username }}</strong>
        </p>

        <h2>Enviar notificación</h2>

        <form (ngSubmit)="send()">
          <label>Destinatario</label>
          <input type="email" name="destination"
            [(ngModel)]="form.destination" required>

          <label>Asunto</label>
          <input name="subject"
            [(ngModel)]="form.subject" required>

          <label>Contenido</label>
          <textarea name="content"
            [(ngModel)]="form.content" required></textarea>

          <button type="submit" class="primary"
            [disabled]="sending">
            {{ sending ? 'Enviando...' : 'Enviar notificación' }}
          </button>
        </form>

        <p *ngIf="success" class="success">{{ success }}</p>
        <p *ngIf="error" class="error">{{ error }}</p>
      </section>
    </main>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .container {
      max-width: 600px; margin: 40px auto; padding: 28px;
      font-family: Arial, sans-serif; border-radius: 12px;
      box-shadow: 0 4px 20px #0002; color: #202938;
    }
    .header {
      display: flex; align-items: center;
      justify-content: space-between; gap: 12px;
      border-bottom: 1px solid #ddd; padding-bottom: 18px;
      margin-bottom: 24px;
    }
    h1 { margin: 0; color: #174ea6; }
    h2 { margin-top: 16px; }
    .header p { margin-bottom: 0; color: #666; }
    label { display: block; margin-top: 16px; font-weight: bold; }
    input, textarea {
      width: 100%; padding: 11px; margin-top: 6px;
      border: 1px solid #bbb; border-radius: 6px;
      font: inherit;
    }
    textarea { min-height: 100px; resize: vertical; }
    button {
      padding: 11px 16px; border: 0; border-radius: 6px;
      cursor: pointer; font-weight: bold;
    }
    .primary { margin-top: 20px; background: #174ea6; color: white; }
    .logout { background: #eee; color: #333; }
    button:disabled { opacity: .6; cursor: wait; }
    .notice { margin-top: 22px; color: #777; font-size: 12px; }
    .welcome { background: #eef5ff; padding: 12px; border-radius: 6px; }
    .success { color: #16733c; }
    .error { color: #b42318; }
  `]
})
export class App {
  loggedIn = false;
  username = '';
  password = '';
  loginError = '';

  form = { destination: '', subject: '', content: '' };
  sending = false;
  success = '';
  error = '';

  constructor(private messaging: MessagingService) {}

  login() {
    this.loginError = '';

    if (!this.username.trim() || !this.password) {
      this.loginError = 'Ingresa tu usuario y contraseña.';
      return;
    }

    // Solo demostración local: no valida credenciales reales.
    this.username = this.username.trim();
    this.password = '';
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
    this.username = '';
    this.password = '';
    this.loginError = '';
    this.success = '';
    this.error = '';
  }

  send() {
    this.sending = true;
    this.success = '';
    this.error = '';

    this.messaging.sendEmail(this.form).subscribe({
      next: result => {
        this.success = result.message || 'Mensaje enviado correctamente.';
        this.form = { destination: '', subject: '', content: '' };
        this.sending = false;
      },
      error: err => {
        this.error = err.error?.message || 'Error al enviar. Comprueba el backend.';
        this.sending = false;
      }
    });
  }
}

