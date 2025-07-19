@@ .. @@
     try {
       console.log('Validation passed, calling register API...');
       await register({
         username: formData.username,
         email: formData.email,
         password: formData.password,
         contactNumber: formData.contactNumber,
       });
       console.log('Registration successful, closing modal');
       onClose();
       setFormData({
         username: '',
         email: '',
         password: '',
         confirmPassword: '',
         contactNumber: '',
       });
     } catch (err) {
       console.error('Registration failed:', err);
-      setErrors({ general: 'Registration failed. Please try again.' });
+      setErrors({ 
+        general: err instanceof Error ? err.message : 'Registration failed. Please try again.' 
+      });
     } finally {
       setLoading(false);
       console.log('=== REGISTRATION FORM SUBMISSION DEBUG END ===');
     }
   };