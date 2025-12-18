package com.matrimony.eliteinovamatrimonybackend.specification;

import com.matrimony.eliteinovamatrimonybackend.entity.Profile;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ProfileSpecification {

    public static Specification<Profile> withFilters(
            Profile.Gender loggedInUserGender,
            Profile.Gender gender, Integer minAge, Integer maxAge,
            String religion, String category, String caste, String subCaste, // <-- category added
            Profile.MaritalStatus maritalStatus, String education, String profession,
            String location, String employedIn, String dosham,
            String annualIncome, String country, String state, String district) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            System.out.println("🔍 Applying filters:");
            System.out.println("  - Logged-in User Gender: " + loggedInUserGender);
            System.out.println("  - Requested Gender: " + gender);
            System.out.println("  - Age: " + minAge + "-" + maxAge + " (minAge type: " +
                    (minAge != null ? minAge.getClass().getSimpleName() : "null") +
                    ", maxAge type: " + (maxAge != null ? maxAge.getClass().getSimpleName() : "null") + ")");
            System.out.println("  - Religion: " + religion);
            System.out.println("  - Category: " + category); // <- logged
            System.out.println("  - Caste: " + caste);
            System.out.println("  - SubCaste: " + subCaste);
            System.out.println("  - Marital Status: " + maritalStatus);
            System.out.println("  - Education: " + education);
            System.out.println("  - Profession: " + profession);
            System.out.println("  - Location: " + location);
            System.out.println("  - Employed In: " + employedIn);
            System.out.println("  - Dosham: " + dosham);
            System.out.println("  - Annual Income: " + annualIncome);
            System.out.println("  - Country: " + country);
            System.out.println("  - State: " + state);
            System.out.println("  - District: " + district);

            // ✅ CRITICAL: Auto-set gender filter to show opposite gender
            Profile.Gender targetGender = getOppositeGender(loggedInUserGender);
            if (targetGender != null) {
                predicates.add(criteriaBuilder.equal(root.get("gender"), targetGender));
                System.out.println("✅ Auto-applied opposite gender filter: " + targetGender +
                        " (User is: " + loggedInUserGender + ")");
            } else if (gender != null) {
                // Fallback to manual gender filter if no logged-in user gender
                predicates.add(criteriaBuilder.equal(root.get("gender"), gender));
                System.out.println("✅ Applied manual gender filter: " + gender);
            }

            // Age range filter - ADD MORE DEBUGGING
            if (minAge != null) {
                System.out.println("🎯 Applying min age filter: " + minAge + " (type: " + minAge.getClass().getSimpleName() + ")");
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("age"), minAge));
                System.out.println("✅ Applied min age filter: " + minAge);
            } else {
                System.out.println("🎯 No min age filter applied");
            }
            if (maxAge != null) {
                System.out.println("🎯 Applying max age filter: " + maxAge + " (type: " + maxAge.getClass().getSimpleName() + ")");
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("age"), maxAge));
                System.out.println("✅ Applied max age filter: " + maxAge);
            } else {
                System.out.println("🎯 No max age filter applied");
            }

            // Religion filter
            if (religion != null && !religion.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("religion")),
                        "%" + religion.toLowerCase() + "%"
                ));
                System.out.println("✅ Applied religion filter: " + religion);
            }

            // CATEGORY filter (NEW)
            if (category != null && !category.trim().isEmpty()) {
                // Use EQUAL instead of LIKE for exact matching
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("category")),
                        category.toLowerCase().trim()));
                System.out.println("✅ Applied EXACT category filter: " + category);
            }

            // CASTE filter (IMPROVED) - check both caste and subCaste fields
            if (caste != null && !caste.trim().isEmpty()) {
                String castePattern = "%" + caste.toLowerCase() + "%";
                Predicate casteInCasteField = criteriaBuilder.like(criteriaBuilder.lower(root.get("caste")), castePattern);
                Predicate casteInSubCasteField = criteriaBuilder.like(criteriaBuilder.lower(root.get("subCaste")), castePattern);
                predicates.add(criteriaBuilder.or(casteInCasteField, casteInSubCasteField));
                System.out.println("✅ Applied caste filter (searching caste OR subCaste): " + caste);
            }

            // Sub-caste filter
            if (subCaste != null && !subCaste.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("subCaste")),
                        "%" + subCaste.toLowerCase() + "%"
                ));
                System.out.println("✅ Applied sub-caste filter: " + subCaste);
            }

            // Marital status filter
            if (maritalStatus != null) {
                predicates.add(criteriaBuilder.equal(root.get("maritalStatus"), maritalStatus));
                System.out.println("✅ Applied marital status filter: " + maritalStatus);
            }

            // Education filter (partial match)
            if (education != null && !education.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("education")),
                        "%" + education.toLowerCase() + "%"
                ));
                System.out.println("✅ Applied education filter: " + education);
            }

            if (profession != null && !profession.trim().isEmpty()) {
                String professionPattern = "%" + profession.toLowerCase() + "%";

                System.out.println("🎯 Applying profession filter: " + profession);

                // Search in both profession and occupation fields
                Predicate professionPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("profession")),
                        professionPattern
                );

                Predicate occupationPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("occupation")),
                        professionPattern
                );

                predicates.add(criteriaBuilder.or(professionPredicate, occupationPredicate));
                System.out.println("✅ Applied profession/occupation filter: " + profession +
                        " (searching in both profession and occupation fields)");
            }

            // Location filter - search in multiple fields
            if (location != null && !location.trim().isEmpty()) {
                String locationPattern = "%" + location.toLowerCase() + "%";
                Predicate cityPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("city")), locationPattern);
                Predicate statePredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("state")), locationPattern);
                Predicate districtPredicate = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("district")), locationPattern);

                predicates.add(criteriaBuilder.or(cityPredicate, statePredicate, districtPredicate));
                System.out.println("✅ Applied location filter: " + location);
            }

            // Employment type filter
            if (employedIn != null && !employedIn.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("employedIn")),
                        "%" + employedIn.toLowerCase() + "%"
                ));
                System.out.println("✅ Applied employedIn filter: " + employedIn);
            }

            // ✅ FIXED: Dosham filter - handle all cases properly
            if (dosham != null && !dosham.trim().isEmpty()) {
                if (dosham.equalsIgnoreCase("Doesn't Matter")) {
                    // Don't filter by dosham - show all profiles regardless of dosham
                    System.out.println("✅ Skipping dosham filter as 'Doesn't Matter' was selected");
                } else if (dosham.equalsIgnoreCase("Yes")) {
                    // Show profiles that have dosham (not null/empty and not "No")
                    Predicate hasDosham1 = criteriaBuilder.isNotNull(root.get("dosham"));
                    Predicate hasDosham2 = criteriaBuilder.notEqual(root.get("dosham"), "");
                    Predicate hasDosham3 = criteriaBuilder.notEqual(root.get("dosham"), "No");
                    predicates.add(criteriaBuilder.and(hasDosham1, hasDosham2, hasDosham3));
                    System.out.println("✅ Applied dosham filter: Yes (has dosham)");
                } else if (dosham.equalsIgnoreCase("No")) {
                    // Show profiles with no dosham (null, empty, or "No")
                    Predicate noDosham1 = criteriaBuilder.isNull(root.get("dosham"));
                    Predicate noDosham2 = criteriaBuilder.equal(root.get("dosham"), "");
                    Predicate noDosham3 = criteriaBuilder.equal(root.get("dosham"), "No");
                    predicates.add(criteriaBuilder.or(noDosham1, noDosham2, noDosham3));
                    System.out.println("✅ Applied dosham filter: No (no dosham)");
                } else {
                    // Text search for specific dosham types
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("dosham")),
                            "%" + dosham.toLowerCase() + "%"
                    ));
                    System.out.println("✅ Applied dosham text filter: " + dosham);
                }
            }

            // ✅ FIXED: Annual Income filter - handle range formats properly
            if (annualIncome != null && !annualIncome.trim().isEmpty()) {
                try {
                    // Handle range formats like "0-2", "2-5", "5-10", etc.
                    if (annualIncome.contains("-")) {
                        String[] range = annualIncome.split("-");
                        if (range.length == 2) {
                            try {
                                Integer minIncome = Integer.parseInt(range[0].trim()) * 100000; // Convert lakhs to actual amount
                                Integer maxIncome = Integer.parseInt(range[1].trim()) * 100000;
                                predicates.add(criteriaBuilder.between(root.get("annualIncome"), minIncome, maxIncome));
                                System.out.println("✅ Applied annual income range filter: " + minIncome + "-" + maxIncome);
                            } catch (NumberFormatException e) {
                                // If range parsing fails, fall back to text search
                                predicates.add(criteriaBuilder.like(
                                        criteriaBuilder.lower(root.get("annualIncome").as(String.class)),
                                        "%" + annualIncome.toLowerCase() + "%"
                                ));
                                System.out.println("✅ Applied annual income text filter (range fallback): " + annualIncome);
                            }
                        }
                    }
                    // Handle "20+" format
                    else if (annualIncome.endsWith("+")) {
                        try {
                            Integer minIncome = Integer.parseInt(annualIncome.replace("+", "").trim()) * 100000;
                            predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("annualIncome"), minIncome));
                            System.out.println("✅ Applied annual income min filter: " + minIncome + "+");
                        } catch (NumberFormatException e) {
                            predicates.add(criteriaBuilder.like(
                                    criteriaBuilder.lower(root.get("annualIncome").as(String.class)),
                                    "%" + annualIncome.toLowerCase() + "%"
                            ));
                            System.out.println("✅ Applied annual income text filter (plus fallback): " + annualIncome);
                        }
                    }
                    // Handle simple number (fallback)
                    else {
                        try {
                            Integer incomeValue = Integer.parseInt(annualIncome) * 100000;
                            Integer minIncome = (int) (incomeValue * 0.8);
                            Integer maxIncome = (int) (incomeValue * 1.2);
                            predicates.add(criteriaBuilder.between(root.get("annualIncome"), minIncome, maxIncome));
                            System.out.println("✅ Applied annual income approximate filter: " + minIncome + "-" + maxIncome);
                        } catch (NumberFormatException e) {
                            // If not a number, do text search
                            predicates.add(criteriaBuilder.like(
                                    criteriaBuilder.lower(root.get("annualIncome").as(String.class)),
                                    "%" + annualIncome.toLowerCase() + "%"
                            ));
                            System.out.println("✅ Applied annual income text filter: " + annualIncome);
                        }
                    }
                } catch (Exception e) {
                    // Final fallback - text search
                    predicates.add(criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("annualIncome").as(String.class)),
                            "%" + annualIncome.toLowerCase() + "%"
                    ));
                    System.out.println("✅ Applied annual income text filter (final fallback): " + annualIncome);
                }
            }

            // Country filter
            if (country != null && !country.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("country")),
                        "%" + country.toLowerCase() + "%"
                ));
                System.out.println("✅ Applied country filter: " + country);
            }

            // State filter
            if (state != null && !state.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("state")),
                        "%" + state.toLowerCase() + "%"
                ));
                System.out.println("✅ Applied state filter: " + state);
            }

            // District filter
            if (district != null && !district.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("district")),
                        "%" + district.toLowerCase() + "%"
                ));
                System.out.println("✅ Applied district filter: " + district);
            }

            System.out.println("🎯 Total predicates applied: " + predicates.size());
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    // Helper method to get opposite gender
    private static Profile.Gender getOppositeGender(Profile.Gender userGender) {
        if (userGender == null) {
            return null;
        }

        switch (userGender) {
            case MALE:
                return Profile.Gender.FEMALE;
            case FEMALE:
                return Profile.Gender.MALE;
            default:
                return null;
        }
    }

    // Additional helper specifications for common searches
    public static Specification<Profile> byGender(Profile.Gender gender) {
        return (root, query, criteriaBuilder) ->
                gender != null ? criteriaBuilder.equal(root.get("gender"), gender) : null;
    }

    public static Specification<Profile> byAgeRange(Integer minAge, Integer maxAge) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (minAge != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("age"), minAge));
            }
            if (maxAge != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("age"), maxAge));
            }
            return predicates.isEmpty() ? null : criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Profile> byReligion(String religion) {
        return (root, query, criteriaBuilder) ->
                (religion != null && !religion.trim().isEmpty()) ?
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("religion")), "%" + religion.toLowerCase() + "%") : null;
    }

    // Specification for opposite gender
    public static Specification<Profile> byOppositeGender(Profile.Gender userGender) {
        return (root, query, criteriaBuilder) -> {
            Profile.Gender oppositeGender = getOppositeGender(userGender);
            return oppositeGender != null ? criteriaBuilder.equal(root.get("gender"), oppositeGender) : null;
        };
    }
}
