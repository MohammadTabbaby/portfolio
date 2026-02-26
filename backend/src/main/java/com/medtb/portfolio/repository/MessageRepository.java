package com.medtb.portfolio.repository;

import com.medtb.portfolio.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
