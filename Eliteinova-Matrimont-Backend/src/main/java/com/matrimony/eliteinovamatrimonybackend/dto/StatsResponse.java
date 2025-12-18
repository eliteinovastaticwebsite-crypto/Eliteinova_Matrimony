package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;
import java.util.Map;

@Data
public class StatsResponse {
    private Long totalProfiles;
    private Long maleProfiles;
    private Long femaleProfiles;
    private Long verifiedProfiles;
    private Long premiumProfiles;
    private Long recentProfiles;
    private Map<String, Long> byReligion;
    private Map<String, Long> byCommunity;
    private String lastUpdated;
}