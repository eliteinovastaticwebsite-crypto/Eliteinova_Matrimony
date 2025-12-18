-- Insert plan features
INSERT INTO plan_features (plan_id, feature)
VALUES
    (1, 'Create Complete Profile'),
    (1, 'Browse Limited Profiles Daily'),
    (1, 'Send 10 Interests Monthly'),
    (1, 'Basic Search Filters'),
    (1, 'Email Support'),
    (1, 'Profile Verification Available'),
    (1, 'Mobile App Access'),

    (2, 'Unlimited Profile Views'),
    (2, 'Priority in Search Results'),
    (2, 'Send Unlimited Interests'),
    (2, 'Advanced Search Filters'),
    (2, 'View Contact Details'),
    (2, 'Dedicated Support Manager'),
    (2, 'Profile Highlighting'),
    (2, 'Compatibility Reports'),
    (2, 'Message Read Receipts'),
    (2, 'Extended Profile Visibility'),

    (3, 'All Gold Features'),
    (3, 'Personal Matchmaking Assistant'),
    (3, 'Video Profile Creation'),
    (3, 'Premium Background Verification'),
    (3, 'Astrology Compatibility Reports'),
    (3, 'Family Mediation Services'),
    (3, '24/7 Priority Support'),
    (3, 'Featured Profile Daily'),
    (3, 'Verified Trust Badge'),
    (3, 'Exclusive Events Access'),
    (3, 'Relationship Counseling Sessions')
    ON CONFLICT DO NOTHING;