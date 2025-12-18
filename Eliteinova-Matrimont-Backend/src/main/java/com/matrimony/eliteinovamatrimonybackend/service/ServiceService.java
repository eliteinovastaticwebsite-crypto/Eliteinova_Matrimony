package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.dto.ServiceCategoryResponse;
import com.matrimony.eliteinovamatrimonybackend.dto.ServiceResponse;
import com.matrimony.eliteinovamatrimonybackend.entity.MatrimonyService;
import com.matrimony.eliteinovamatrimonybackend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    // Get all active services
    public List<ServiceResponse> getAllServices() {
        List<MatrimonyService> services = serviceRepository.findByActiveTrue();
        return services.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get service by ID
    public Optional<ServiceResponse> getServiceById(Long id) {
        return serviceRepository.findByIdAndActiveTrue(id)
                .map(this::convertToResponse);
    }

    // Get services by category
    public List<ServiceResponse> getServicesByCategory(String category) {
        if ("all".equalsIgnoreCase(category)) {
            return getAllServices();
        }
        List<MatrimonyService> services = serviceRepository.findByCategoryAndActiveTrue(category);
        return services.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get featured services
    public List<ServiceResponse> getFeaturedServices() {
        List<MatrimonyService> services = serviceRepository.findByFeaturedTrueAndActiveTrue();
        return services.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get popular services
    public List<ServiceResponse> getPopularServices() {
        List<MatrimonyService> services = serviceRepository.findByPopularTrueAndActiveTrue();
        return services.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ✅ FIXED: Add missing getFreeServices method
    public List<ServiceResponse> getFreeServices() {
        List<MatrimonyService> allServices = serviceRepository.findByActiveTrue();
        return allServices.stream()
                .filter(service -> service.getName().toLowerCase().contains("free"))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get service categories with counts
    public List<ServiceCategoryResponse> getServiceCategories() {
        List<Object[]> categoryData = serviceRepository.countServicesByCategory();

        long totalCount = serviceRepository.findByActiveTrue().size();

        List<ServiceCategoryResponse> categories = categoryData.stream()
                .map(data -> new ServiceCategoryResponse(
                        (String) data[0],
                        getCategoryDisplayName((String) data[0]),
                        (Long) data[1]
                ))
                .collect(Collectors.toList());

        categories.add(0, new ServiceCategoryResponse("all", "All Services", totalCount));
        return categories;
    }

    // Convert entity to response DTO
    private ServiceResponse convertToResponse(MatrimonyService service) {
        ServiceResponse response = new ServiceResponse();
        response.setId(service.getId());
        response.setName(service.getName());
        response.setDescription(service.getDescription());
        response.setDuration(service.getDuration());
        response.setCategory(service.getCategory());
        response.setFeatured(service.getFeatured());
        response.setPopular(service.getPopular());
        response.setBadge(service.getBadge());
        response.setFeatures(service.getFeatures());
        response.setIconName(service.getIconName());
        return response;
    }

    // Helper method to get display names for categories
    private String getCategoryDisplayName(String category) {
        switch (category.toLowerCase()) {
            case "membership":
                return "Membership Plans";
            case "verification":
                return "Verification & Privacy";
            case "matching":
                return "Match Recommendations";
            case "assisted":
                return "Assisted Matrimony";
            case "wedding":
                return "Wedding Assistance";
            default:
                return category;
        }
    }

    // Check if service exists and is active
    public boolean serviceExists(Long serviceId) {
        return serviceRepository.findByIdAndActiveTrue(serviceId).isPresent();
    }

    // Get all services (including inactive for admin)
    public List<MatrimonyService> getAllServicesForAdmin() {
        return serviceRepository.findAll();
    }

    // Create or update service
    public MatrimonyService saveService(MatrimonyService service) {
        return serviceRepository.save(service);
    }

    // Delete service (soft delete)
    public void deleteService(Long serviceId) {
        serviceRepository.findById(serviceId).ifPresent(service -> {
            service.setActive(false);
            serviceRepository.save(service);
        });
    }
}