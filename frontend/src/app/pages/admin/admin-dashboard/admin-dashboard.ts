import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, Project } from '../../../services/project';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
  projects: Project[] = [];
  model: Project = { title: '', description: '', githubUrl: '' };
  loading = false;
  error = '';

  constructor(private svc: ProjectService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.getAll().subscribe({
      next: (p) => { this.projects = p; },
      error: () => { this.error = 'Failed to load projects'; }
    });
  }

  create() {
    this.loading = true;
    this.error = '';
    this.svc.create(this.model).subscribe({
      next: (proj) => {
        this.projects.push(proj);
        this.model = { title: '', description: '', githubUrl: '' };
        this.loading = false;
      },
      error: () => { this.error = 'Create failed'; this.loading = false; }
    });
  }

  deleteProject(id?: number) {
    if (!id) return;
    this.svc.delete(id).subscribe({
      next: () => { this.projects = this.projects.filter(p => p.id !== id); },
      error: () => { this.error = 'Delete failed'; }
    });
  }
}
