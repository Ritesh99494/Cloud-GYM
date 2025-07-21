@@ .. @@
   const login = async (email: string, password: string) => {
     console.log('Login attempt for:', email);
     try {
-      const response = await apiService.login(email, password) as AuthResponse;
-      setUser(response.user);
-      setToken(response.token);
-      localStorage.setItem('authToken', response.token);
+      const response = await apiService.login(email, password) as any;
+      
+      // Handle different response formats
+      if (response.success && response.user && response.token) {
+        setUser(response.user);
+        setToken(response.token);
+        localStorage.setItem('authToken', response.token);
+      } else if (response.user && response.token) {
+        // Direct response format
+        setUser(response.user);
+        setToken(response.token);
+        localStorage.setItem('authToken', response.token);
+      } else {
+        throw new Error('Invalid response format from server');
+      }
+      
       console.log('Login successful');
     } catch (error) {
       console.error('Login failed:', error);
-      throw new Error('Invalid credentials');
+      throw error; // Re-throw the original error with proper message
     }
   };