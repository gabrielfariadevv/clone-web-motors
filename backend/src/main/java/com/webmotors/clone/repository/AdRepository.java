package com.webmotors.clone.repository;

import com.webmotors.clone.model.Ad;
import com.webmotors.clone.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
    List<Ad> findByUser(User user);
    List<Ad> findByApprovedTrue();
}