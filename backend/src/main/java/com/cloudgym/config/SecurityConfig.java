@@ .. @@
             .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
             .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/register").permitAll()
                .requestMatchers("/api/auth/validate").permitAll()
                .requestMatchers("/api/gyms/nearby").permitAll()
                .requestMatchers("/api/gyms/search").permitAll()
                .requestMatchers("/api/gyms/{id}").permitAll()
                .requestMatchers("/api/gyms").permitAll()
                .requestMatchers("/api/bookings/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/ai/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
             )
             .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);