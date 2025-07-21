@@ .. @@
     try {
-      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/gyms`, {
+      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/gyms`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
         },
         body: JSON.stringify(formData),
       });