package com.medtb.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.medtb.portfolio.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
