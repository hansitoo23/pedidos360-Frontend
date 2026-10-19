import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private apiUrl = 'http://localhost:8081/api/messages/email';

  constructor(private http: HttpClient) {}

  sendEmail(data: { destination: string; subject: string; content: string }) {
    return this.http.post<{ message: string }>(this.apiUrl, data);
  }
}
