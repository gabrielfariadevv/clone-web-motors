package com.webmotors.clone.controller;
import com.webmotors.clone.model.Ad;
import com.webmotors.clone.model.User;
import com.webmotors.clone.service.AdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/advertisements")
public class AdController {
    @Autowired
    private AdService adService;

    @GetMapping("/user")
    public List<Ad> getUserAdvertisements(@AuthenticationPrincipal User user) {
        return adService.getUserAdvertisements(user);
    }

    @PostMapping
    public Ad createAdvertisement(@RequestBody Ad advertisement, @AuthenticationPrincipal User user) {
        advertisement.setUser(user);
        return adService.createAdvertisement(advertisement);
    }

    @PutMapping("/{id}/approve")
    public Ad approveAdvertisement(@PathVariable Long id) {
        return adService.approveAdvertisement(id);
    }

    @GetMapping("/approved")
    public List<Ad> getApprovedAdvertisements() {
        return adService.getApprovedAdvertisements();
    }

    // Other endpoints as needed
}