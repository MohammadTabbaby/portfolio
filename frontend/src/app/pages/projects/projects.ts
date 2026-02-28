import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService, Project } from '../../services/project';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent implements OnInit {
  projects$!: Observable<Project[]>;
  constructor(private svc: ProjectService) {}
  ngOnInit(){ this.load(); }
  load(){ this.projects$ = this.svc.getAll(); }
}

