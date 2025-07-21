@@ .. @@
             .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
             .authorizeHttpRequests(authz -> authz
-                .requestMatchers("/auth/**").permitAll()
+                .requestMatchers("/auth/**").permitAll()
                 .requestMatchers("/gyms/nearby").permitAll()
                 .requestMatchers("/gyms/search").permitAll()
                 .requestMatchers("/gyms/{id}").permitAll()
                 .requestMatchers("/gyms").hasRole("ADMIN")
                 .requestMatchers("/bookings/**").hasAnyRole("USER", "ADMIN")
                 .requestMatchers("/users/**").hasAnyRole("USER", "ADMIN")
                 .requestMatchers("/ai/**").hasAnyRole("USER", "ADMIN")
                 .anyRequest().authenticated()
             )