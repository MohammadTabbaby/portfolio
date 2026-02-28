import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Project {
  id?: number;
  title: string;
  description: string;
  githubUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private base = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Project[]>(this.base); }
  create(payload: Project) { return this.http.post<Project>(this.base, payload); }
  delete(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}