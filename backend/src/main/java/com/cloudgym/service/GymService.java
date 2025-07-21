@@ .. @@
    public List<GymDTO> getNearbyGyms(Double latitude, Double longitude, Double radiusInKm) {
-        List<Object[]> results = gymRepository.findNearbyGyms(latitude, longitude, radiusInKm);
        try {
            // Try using JPQL approach first (simpler and more reliable)
            List<Object[]> results = gymRepository.findNearbyGymsJPQL(latitude, longitude, radiusInKm);
            
            return results.stream().map(result -> {
                Gym gym = (Gym) result[0];
                Double distance = ((Number) result[1]).doubleValue();
                
                GymDTO gymDTO = new GymDTO(gym);
                gymDTO.setDistance(distance);
                return gymDTO;
            }).toList();
            
        } catch (Exception e) {
            // Fallback to getting all gyms and calculating distance in Java
            List<Gym> allGyms = gymRepository.findAll();
            
            return allGyms.stream()
                .map(gym -> {
                    double distance = calculateDistance(latitude, longitude, gym.getLatitude(), gym.getLongitude());
                    GymDTO gymDTO = new GymDTO(gym);
                    gymDTO.setDistance(distance);
                    return gymDTO;
                })
                .filter(gymDTO -> gymDTO.getDistance() <= radiusInKm)
                .sorted((a, b) -> Double.compare(a.getDistance(), b.getDistance()))
-            GymDTO gymDTO = new GymDTO(gym);
-            return gymDTO;
-        }).toList();
        return distance;
+        return results.stream().map(result -> {
+            // The native query returns all gym columns plus distance
+            // We need to manually map the result array to a Gym entity
+            Gym gym = new Gym();
+            gym.setId(((Number) result[0]).longValue());
+            gym.setName((String) result[1]);
+            gym.setAddress((String) result[2]);
+            gym.setLatitude((Double) result[3]);
+            gym.setLongitude((Double) result[4]);
+            gym.setRating((Double) result[5]);
+            gym.setReviewCount((Integer) result[6]);
+            gym.setCapacity((Integer) result[7]);
+            gym.setCurrentOccupancy((Integer) result[8]);
+            gym.setPriceRange((String) result[9]);
+            gym.setDescription((String) result[10]);
+            gym.setContactPhone((String) result[11]);
+            gym.setContactEmail((String) result[12]);
+            
+            // Distance is the last column
+            Double distance = ((Number) result[result.length - 1]).doubleValue();
+            
+            GymDTO gymDTO = new GymDTO(gym);
+            gymDTO.setDistance(distance);
+            return gymDTO;
+        }).toList();
    }