@@ .. @@
    @Query(value = "SELECT *, " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(g.latitude)) * " +
           "cos(radians(g.longitude) - radians(:lng)) + " +
           "sin(radians(:lat)) * sin(radians(g.latitude)))) AS distance " +
           "FROM gyms g " +
           "HAVING distance <= :radiusInKm " +
           "ORDER BY distance", nativeQuery = true)
-    List<Object[]> findNearbyGyms(@Param("lat") Double latitude, 
-                                  @Param("lng") Double longitude, 
-                                  @Param("radiusInKm") Double radiusInKm);
+    List<Object[]> findNearbyGyms(@Param("lat") Double latitude, 
+                                  @Param("lng") Double longitude, 
+                                  @Param("radiusInKm") Double radiusInKm);
+    
+    // Alternative approach using JPQL with a simpler distance calculation
+    @Query("SELECT g, " +
+           "SQRT((g.latitude - :lat) * (g.latitude - :lat) + (g.longitude - :lng) * (g.longitude - :lng)) * 111.32 AS distance " +
+           "FROM Gym g " +
+           "WHERE SQRT((g.latitude - :lat) * (g.latitude - :lat) + (g.longitude - :lng) * (g.longitude - :lng)) * 111.32 <= :radiusInKm " +
+           "ORDER BY distance")
+    List<Object[]> findNearbyGymsJPQL(@Param("lat") Double latitude, 
+                                      @Param("lng") Double longitude, 
+                                      @Param("radiusInKm") Double radiusInKm);