@@ .. @@
 interface AuthResponse {
   user: User;
   token: string;
+  success?: boolean;
+  message?: string;
 }

 interface AuthContextType {
@@ .. @@
   const login = async (email: string, password: string) => {
     console.log('Login attempt for:', email);
     try {
-      const response = await apiService.login(email, password) as AuthResponse;
-      setUser(response.user);
-      setToken(response.token);
-      localStorage.setItem('authToken', response.token);
+      const response = await apiService.login(email, password) as any;
+      console.log('Login response:', response);
+      
+      if (response.success && response.user && response.token) {
+        setUser(response.user);
+        setToken(response.token);
+        localStorage.setItem('authToken', response.token);
+      } else {
+        throw new Error(response.message || 'Login failed');
+      }
       console.log('Login successful');
     } catch (error) {
       console.error('Login failed:', error);
-      throw new Error('Invalid credentials');
+      throw error;
     }
   };

   const register = async (userData: RegisterData) => {
     console.log('Register attempt for:', userData.email);
     try {
-      const response = await apiService.register(userData) as AuthResponse;
-      setUser(response.user);
-      setToken(response.token);
-      localStorage.setItem('authToken', response.token);
+      const response = await apiService.register(userData) as any;
+      console.log('Register response:', response);
+      
+      if (response.success && response.user && response.token) {
+        setUser(response.user);
+        setToken(response.token);
+        localStorage.setItem('authToken', response.token);
+      } else {
+        throw new Error(response.message || 'Registration failed');
+      }
       console.log('Registration successful');
     } catch (error) {
       console.error('Registration failed:', error);
-      throw new Error('Registration failed');
+      throw error;
     }
   };