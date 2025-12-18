package com.matrimony.eliteinovamatrimonybackend.controller;

import com.matrimony.eliteinovamatrimonybackend.dto.ServiceCategoryResponse;
import com.matrimony.eliteinovamatrimonybackend.dto.ServiceResponse;
import com.matrimony.eliteinovamatrimonybackend.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    // === GET ALL SERVICES ===
    @GetMapping
    public ResponseEntity<?> getAllServices() {
        try {
            List<ServiceResponse> services = serviceService.getAllServices();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("services", services);
            response.put("total", services.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch services: " + e.getMessage()));
        }
    }

    // === GET SERVICE BY ID ===
    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable Long id) {
        try {
            Optional<ServiceResponse> serviceOpt = serviceService.getServiceById(id);

            if (serviceOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("service", serviceOpt.get());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch service: " + e.getMessage()));
        }
    }

    // === GET SERVICES BY CATEGORY ===
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getServicesByCategory(@PathVariable String category) {
        try {
            List<ServiceResponse> services = serviceService.getServicesByCategory(category);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("services", services);
            response.put("category", category);
            response.put("total", services.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch services by category: " + e.getMessage()));
        }
    }

    // === GET SERVICE CATEGORIES ===
    @GetMapping("/categories")
    public ResponseEntity<?> getServiceCategories() {
        try {
            List<ServiceCategoryResponse> categories = serviceService.getServiceCategories();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("categories", categories);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch service categories: " + e.getMessage()));
        }
    }

    // === GET FEATURED SERVICES ===
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedServices() {
        try {
            List<ServiceResponse> featuredServices = serviceService.getFeaturedServices();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("services", featuredServices);
            response.put("total", featuredServices.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch featured services: " + e.getMessage()));
        }
    }

    // === GET POPULAR SERVICES ===
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularServices() {
        try {
            List<ServiceResponse> popularServices = serviceService.getPopularServices();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("services", popularServices);
            response.put("total", popularServices.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch popular services: " + e.getMessage()));
        }
    }

    // === GET FREE SERVICES ===
    @GetMapping("/free")
    public ResponseEntity<?> getFreeServices() {
        try {
            List<ServiceResponse> freeServices = serviceService.getFreeServices();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("services", freeServices);
            response.put("total", freeServices.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch free services: " + e.getMessage()));
        }
    }

    // === HELPER METHOD ===
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }
}