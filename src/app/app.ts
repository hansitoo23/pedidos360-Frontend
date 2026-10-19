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
      <h1>Pedidos360</h1>
      <h2>Enviar notificación</h2>

      <form (ngSubmit)="send()">
        <label>Destinatario</label>
        <input type="email" name="destination"
          [(ngModel)]="form.destination" required>

        <label>Asunto</label>
        <input name="subject" [(ngModel)]="form.subject" required>

        <label>Contenido</label>
        <textarea name="content"
          [(ngModel)]="form.content" required></textarea>

        <button type="submit" [disabled]="sending">
          {{ sending ? 'Enviando...' : 'Enviar notificación' }}
        </button>
      </form>

      <p *ngIf="success" style="color: green">{{ success }}</p>
      <p *ngIf="error" style="color: red">{{ error }}</p>
    </main>
  `,
  styles: [`
    .container {
      max-width: 560px; margin: 40px auto; padding: 28px;
      font-family: Arial, sans-serif; border-radius: 12px;
      box-shadow: 0 4px 20px #0002;
    }
    label { display: block; margin-top: 16px; font-weight: bold; }
    input, textarea {
      box-sizing: border-box; width: 100%; padding: 10px;
      margin-top: 6px; border: 1px solid #bbb; border-radius: 6px;
    }
    textarea { min-height: 100px; }
    button {
      margin-top: 20px; padding: 12px 18px; color: white;
      background: #174ea6; border: 0; border-radius: 6px; cursor: pointer;
    }
  `]
})
export class App {
  form = { destination: '', subject: '', content: '' };
  sending = false;
  success = '';
  error = '';

  constructor(private messaging: MessagingService) {}

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
