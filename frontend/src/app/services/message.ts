import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Message {
  id?: number;
  name: string;
  email: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private base = `${environment.apiUrl}/messages`;
  constructor(private http: HttpClient) {}
  send(message: Message): Observable<Message> {
    return this.http.post<Message>(this.base, message);
  }
}
