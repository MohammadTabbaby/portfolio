package com.medtb.portfolio.service;


import org.springframework.stereotype.Service;

import com.medtb.portfolio.entity.Project;
import com.medtb.portfolio.repository.ProjectRepository;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    public List<Project> getAll() {
        return repository.findAll();
    }

    public Project create(Project project) {
        return repository.save(project);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
