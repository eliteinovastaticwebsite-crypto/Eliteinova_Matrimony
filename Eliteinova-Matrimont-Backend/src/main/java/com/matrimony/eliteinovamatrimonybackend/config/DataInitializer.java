package com.matrimony.eliteinovamatrimonybackend.config;

import com.matrimony.eliteinovamatrimonybackend.entity.*;
import com.matrimony.eliteinovamatrimonybackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin first
        createAdminUsers();

        // Only initialize sample data if no users exist
        if (userRepository.count() == 0) {
            initializeSampleData();
        }
    }

    private void createAdminUsers() {
        // Create Super Admin if not exists
        if (adminRepository.count() == 0) {
            Admin superAdmin = new Admin();
            superAdmin.setName("Super Admin");
            superAdmin.setEmail("admin@elitenxtmatrimony.com");
            superAdmin.setPassword(passwordEncoder.encode("Admin@123"));
            superAdmin.setRole("SUPER_ADMIN");
            superAdmin.setStatus("ACTIVE");
            superAdmin.setCreatedAt(LocalDateTime.now());
            superAdmin.setUpdatedAt(LocalDateTime.now());
            adminRepository.save(superAdmin);

            // Create additional admin users
            Admin supportAdmin = new Admin();
            supportAdmin.setName("Support Admin");
            supportAdmin.setEmail("support@elitenxtmatrimony.com");
            supportAdmin.setPassword(passwordEncoder.encode("Support@123"));
            supportAdmin.setRole("ADMIN");
            supportAdmin.setStatus("ACTIVE");
            supportAdmin.setCreatedAt(LocalDateTime.now());
            supportAdmin.setUpdatedAt(LocalDateTime.now());
            adminRepository.save(supportAdmin);

            Admin moderator = new Admin();
            moderator.setName("Content Moderator");
            moderator.setEmail("moderator@elitenxtmatrimony.com");
            moderator.setPassword(passwordEncoder.encode("Moderator@123"));
            moderator.setRole("MODERATOR");
            moderator.setStatus("ACTIVE");
            moderator.setCreatedAt(LocalDateTime.now());
            moderator.setUpdatedAt(LocalDateTime.now());
            adminRepository.save(moderator);

            System.out.println("✅ Admin users created:");
            System.out.println("   Super Admin: admin@elitenxtmatrimony.com / Admin@123");
            System.out.println("   Support Admin: support@elitenxtmatrimony.com / Support@123");
            System.out.println("   Moderator: moderator@elitenxtmatrimony.com / Moderator@123");
        }
    }

    private void initializeSampleData() {
        // Create Admin User (as regular User entity - keep for backward compatibility)
        User adminUser = createUser("Admin Tamil", "admin@elitenxt.com", "admin123", "9876543200",
                "Self", "MALE", User.UserRole.ADMIN, User.MembershipType.DIAMOND, true, true, true);

        // Create 5 Male Tamil Users
        User arunKumar = createUser("Arun Kumar", "arun.kumar@example.com", "Password@123", "9876543210",
                "Self", "MALE", User.UserRole.USER, User.MembershipType.GOLD, true, true, true);
        createProfile(arunKumar, "Arun Kumar", 28, "MALE", "NEVER_MARRIED", "Hindu",
                "MBC", "Vanniyar", "Vanniyar", "Bachelor's", "Software Engineer", 1200000, "Chennai", "Tamil Nadu", "India",
                "I am a passionate software engineer working in a leading IT company. I enjoy coding, reading books, and traveling. Looking for an educated, understanding life partner who values family and personal growth.", true, true);

        User rajeshKumar = createUser("Rajesh Kumar", "rajesh.kumar@example.com", "Password@123", "9876543211",
                "Self", "MALE", User.UserRole.USER, User.MembershipType.DIAMOND, true, true, true);
        createProfile(rajeshKumar, "Rajesh Kumar", 32, "MALE", "NEVER_MARRIED", "Hindu",
                "MBC", "Thevar", "Thevar", "Master's", "Doctor", 1800000, "Coimbatore", "Tamil Nadu", "India",
                "MBBS doctor specializing in cardiology. Work at government hospital. Enjoy classical music, medical research, and community service. Seeking a well-educated, compassionate partner from a good family background.", true, true);

        User sureshBabu = createUser("Suresh Babu", "suresh.babu@example.com", "Password@123", "9876543212",
                "Self", "MALE", User.UserRole.USER, User.MembershipType.SILVER, true, true, false);
        createProfile(sureshBabu, "Suresh Babu", 30, "MALE", "NEVER_MARRIED", "Hindu",
                "MBC", "Gounder", "Gounder", "Bachelor's", "Business Owner", 2500000, "Madurai", "Tamil Nadu", "India",
                "Running family textile business with multiple showrooms across Tamil Nadu. Passionate about business expansion and social work. Looking for a traditional yet modern-thinking partner who can support family values.", true, false);

        User karthikSubramanian = createUser("Karthik Subramanian", "karthik.s@example.com", "Password@123", "9876543213",
                "Self", "MALE", User.UserRole.USER, User.MembershipType.FREE, false, true, false);
        createProfile(karthikSubramanian, "Karthik Subramanian", 26, "MALE", "NEVER_MARRIED", "Hindu",
                "OBC", "Mudaliar", "Mudaliar", "Bachelor's", "Mechanical Engineer", 800000, "Salem", "Tamil Nadu", "India",
                "Mechanical engineer working in automotive industry. Interested in robotics, car modifications, and sports. Simple, family-oriented person looking for a sincere and caring life partner.", false, false);

        User mohanRaj = createUser("Mohan Raj", "mohan.raj@example.com", "Password@123", "9876543214",
                "Self", "MALE", User.UserRole.USER, User.MembershipType.FREE, false, false, false);
        createProfile(mohanRaj, "Mohan Raj", 35, "MALE", "DIVORCED", "Hindu",
                "SC", "Paraiyar", "Other", "Master's", "Government Clerk", 700000, "Tiruchirappalli", "Tamil Nadu", "India",
                "Government employee with stable job. Have one daughter who lives with me. Enjoy reading, writing poetry, and social service. Looking for a mature, understanding partner who accepts my daughter.", false, false);

        // Create 5 Female Tamil Users
        User priyaLakshmi = createUser("Priya Lakshmi", "priya.lakshmi@example.com", "Password@123", "9876543215",
                "Self", "FEMALE", User.UserRole.USER, User.MembershipType.GOLD, true, true, true);
        createProfile(priyaLakshmi, "Priya Lakshmi", 25, "FEMALE", "NEVER_MARRIED", "Hindu",
                "MBC", "Vanniyar", "Vanniyar", "Bachelor's", "Software Developer", 900000, "Chennai", "Tamil Nadu", "India",
                "Software developer at MNC. Passionate about coding, dance, and painting. Believe in gender equality and mutual respect in relationship. Looking for an educated, progressive-minded partner.", true, true);

        User deepaRani = createUser("Deepa Rani", "deepa.rani@example.com", "Password@123", "9876543216",
                "Self", "FEMALE", User.UserRole.USER, User.MembershipType.DIAMOND, true, true, true);
        createProfile(deepaRani, "Deepa Rani", 28, "FEMALE", "NEVER_MARRIED", "Hindu",
                "MBC", "Thevar", "Thevar", "Master's", "Doctor", 1500000, "Coimbatore", "Tamil Nadu", "India",
                "Gynecologist practicing at private hospital. Dedicated to women's healthcare. Enjoy classical dance, reading medical journals, and gardening. Seeking a well-settled, supportive life partner.", true, true);

        User anjaliDevi = createUser("Anjali Devi", "anjali.devi@example.com", "Password@123", "9876543217",
                "Self", "FEMALE", User.UserRole.USER, User.MembershipType.SILVER, true, true, false);
        createProfile(anjaliDevi, "Anjali Devi", 26, "FEMALE", "NEVER_MARRIED", "Hindu",
                "MBC", "Gounder", "Gounder", "Master's", "Teacher", 600000, "Madurai", "Tamil Nadu", "India",
                "Mathematics teacher at government school. Passionate about teaching and child development. Enjoy cooking, classical music, and community service. Looking for an educated, family-oriented partner.", true, false);

        User lakshmiPriya = createUser("Lakshmi Priya", "lakshmi.priya@example.com", "Password@123", "9876543218",
                "Self", "FEMALE", User.UserRole.USER, User.MembershipType.FREE, false, true, false);
        createProfile(lakshmiPriya, "Lakshmi Priya", 24, "FEMALE", "NEVER_MARRIED", "Hindu",
                "OBC", "Mudaliar", "Mudaliar", "Bachelor's", "Bank Employee", 500000, "Salem", "Tamil Nadu", "India",
                "Working as bank clerk. Simple, traditional girl with modern outlook. Enjoy singing, watching movies, and spending time with family. Looking for a sincere, employed partner with good family values.", false, false);

        User shwethaSundar = createUser("Shwetha Sundar", "shwetha.s@example.com", "Password@123", "9876543219",
                "Self", "FEMALE", User.UserRole.USER, User.MembershipType.FREE, false, false, false);
        createProfile(shwethaSundar, "Shwetha Sundar", 29, "FEMALE", "NEVER_MARRIED", "Hindu",
                "SC", "Paraiyar", "Other", "Bachelor's", "Architect", 1100000, "Tiruchirappalli", "Tamil Nadu", "India",
                "Running my own architecture firm. Creative, independent, and career-oriented. Love interior design, photography, and traveling. Seeking a partner who respects my career and shares similar life goals.", false, false);

        // Create membership plans (only if they don't exist)
        createMembershipPlans();

        // Create services
        createServices();

        System.out.println("✅ Sample data initialized with:");
        System.out.println("   - 3 Admin accounts (Admin entity)");
        System.out.println("   - 1 Admin User (User entity for backward compatibility)");
        System.out.println("   - 10 Tamil users (5 male, 5 female)");
        System.out.println("   - 3 Membership plans (only created if they don't exist)");
        System.out.println("   - 4 Services");
    }

    private User createUser(String name, String email, String password, String mobile, String profileFor,
                            String gender, User.UserRole role, User.MembershipType membership,
                            boolean emailVerified, boolean phoneVerified, boolean profileVerified) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setMobile(mobile);
        user.setProfileFor(profileFor);
        user.setGender(gender);
        user.setRole(role);
        user.setStatus(User.UserStatus.ACTIVE);
        user.setMembership(membership);
        user.setEmailVerified(emailVerified);
        user.setPhoneVerified(phoneVerified);
        user.setProfileVerified(profileVerified);
        user.setCreatedAt(LocalDateTime.now());
        user.setLastActive(LocalDateTime.now());
        return userRepository.save(user);
    }

    private void createProfile(User user, String name, int age, String gender, String maritalStatus,
                               String religion, String category, String caste, String subCaste, String education,
                               String profession, int annualIncome, String city, String state,
                               String country, String about, boolean isPremium, boolean isVerified) {
        Profile profile = new Profile();
        profile.setUser(user);
        profile.setName(name);
        profile.setAge(age);
        profile.setGender(Profile.Gender.valueOf(gender));
        profile.setMaritalStatus(Profile.MaritalStatus.valueOf(maritalStatus));
        profile.setReligion(religion);
        profile.setCategory(category);
        profile.setCaste(caste);
        profile.setSubCaste(subCaste);
        profile.setEducation(education);
        profile.setProfession(profession);
        profile.setOccupation(profession);
        profile.setAnnualIncome(annualIncome);
        profile.setCity(city);
        profile.setState(state);
        profile.setCountry(country);
        profile.setAbout(about);
        profile.setIsPremium(isPremium);
        profile.setIsVerified(isVerified);
        profile.setCreatedAt(LocalDateTime.now());
        profileRepository.save(profile);
    }

    private void createMembershipPlans() {
        // Check if plans already exist - IMPORTANT: Skip if plans exist
        if (membershipPlanRepository.existsByName("SILVER")) {
            System.out.println("📋 Membership plans already exist. Skipping creation.");
            return;
        }

        System.out.println("📋 Creating 3-tier membership plans...");

        List<MembershipPlan> plans = Arrays.asList(
                createPlan("SILVER",
                        "Perfect for getting started with basic features. Includes essential matching capabilities, limited daily swipes, standard profile visibility, and basic customer support to begin your matrimony journey.",
                        Arrays.asList("Basic Profile Visibility", "Limited Swipes per Day",
                                "Standard Matching", "Basic Profile Creation",
                                "Limited Message Access"),
                        "30 days", 999, false, false, "gray"),

                createPlan("GOLD",
                        "Enhanced features for serious seekers. Get priority matching, unlimited swipes, advanced search filters, message read receipts, profile analytics, and dedicated customer support to find your perfect match faster.",
                        Arrays.asList("Enhanced Profile Visibility", "Unlimited Swipes",
                                "Priority Matching", "Message Read Receipts",
                                "Advanced Search Filters", "Profile Analytics"),
                        "30 days", 1999, true, true, "yellow"),

                createPlan("DIAMOND",
                        "Premium experience with exclusive features. Enjoy personalized matchmaking, VIP priority matching, advanced analytics, dedicated support 24/7, profile highlighting, match guarantee, and personalized matchmaking services for the ultimate matrimony experience.",
                        Arrays.asList("Top Profile Visibility", "Unlimited Swipes",
                                "VIP Priority Matching", "Advanced Analytics",
                                "Dedicated Support", "Profile Highlighting",
                                "Match Guarantee", "Personalized Matchmaking"),
                        "30 days", 2999, true, false, "blue")
        );

        plans.forEach(plan -> {
            plan.setActive(true);
            plan.setCreatedAt(LocalDateTime.now());
            plan.setUpdatedAt(LocalDateTime.now());
            membershipPlanRepository.save(plan);
        });

        System.out.println("✅ Created 3 membership plans: SILVER(₹999), GOLD(₹1999), DIAMOND(₹2999)");
    }

    private MembershipPlan createPlan(String name, String description, List<String> features,
                                      String duration, int price, boolean featured, boolean popular, String color) {
        MembershipPlan plan = new MembershipPlan();
        plan.setName(name);
        plan.setDescription(null);
        plan.setFeatures(features);
        plan.setDuration(duration);
        plan.setPrice(price);
        plan.setFeatured(featured);
        plan.setPopular(popular);
        plan.setColor(color);
        plan.setButtonText("Get Started");
        plan.setSavings(price > 0 ? "Save 40%" : "");
        return plan;
    }

    private void createServices() {
        List<MatrimonyService> services = Arrays.asList(
                createService("Profile Highlight", "Get your profile highlighted in search results to attract more attention",
                        "VISIBILITY", "30 days", true, true,
                        Arrays.asList("Top position in search", "Highlighted profile card", "Increased profile views")),

                createService("Astro Matching", "Professional horoscope matching by expert astrologers",
                        "MATCHING", "One-time", false, false,
                        Arrays.asList("Detailed horoscope analysis", "Compatibility report", "Remedial suggestions")),

                createService("Profile Verification", "Get your profile verified for authenticity and trust",
                        "VERIFICATION", "Lifetime", true, false,
                        Arrays.asList("Blue verification badge", "Increased trust score", "Priority in recommendations")),

                createService("Priority Support", "Dedicated customer support for premium members",
                        "SUPPORT", "Lifetime", false, true,
                        Arrays.asList("24/7 dedicated support", "Priority response", "Direct manager access"))
        );

        services.forEach(service -> {
            service.setActive(true);
            service.setCreatedAt(LocalDateTime.now());
            service.setUpdatedAt(LocalDateTime.now());
            serviceRepository.save(service);
        });
    }

    private MatrimonyService createService(String name, String description, String category, String duration,
                                           boolean featured, boolean popular, List<String> features) {
        MatrimonyService service = new MatrimonyService();
        service.setName(name);
        service.setDescription(description);
        service.setCategory(category);
        service.setDuration(duration);
        service.setFeatured(featured);
        service.setPopular(popular);
        service.setFeatures(features);
        service.setIconName(category.toLowerCase() + "-icon");
        return service;
    }
}