package com.webmotors.clone.service;

import com.webmotors.clone.model.Ad;
import com.webmotors.clone.model.User;
import com.webmotors.clone.repository.AdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdService {
    @Autowired
    private AdRepository adRepository;

    public List<Ad> getUserAdvertisements(User user) {
        return adRepository.findByUser(user);
    }

    public Ad createAdvertisement(Ad advertisement) {
        advertisement.setApproved(false);
        return adRepository.save(advertisement);
    }

    public Ad approveAdvertisement(Long id) {
        Ad advertisement = adRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Advertisement not found"));
        advertisement.setApproved(true);
        return adRepository.save(advertisement);
    }

    public List<Ad> getApprovedAdvertisements() {
        return adRepository.findByApprovedTrue();
    }

    // Other methods as needed
}