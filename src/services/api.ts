@@ .. @@
     if (!response.ok) {
       const errorText = await response.text();
       console.error('API Error Response:', errorText);
-      throw new Error(`API Error: ${response.status} ${response.statusText}`);
+      
+      // Try to parse JSON error response
+      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
+      try {
+        const errorData = JSON.parse(errorText);
+        if (errorData.message) {
+          errorMessage = errorData.message;
+        }
+      } catch (e) {
+        // If not JSON, use the text response
+        if (errorText) {
+          errorMessage = errorText;
+        }
+      }
+      
+      throw new Error(errorMessage);
     }