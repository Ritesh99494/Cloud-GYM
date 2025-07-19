@@ .. @@
     try {
       console.log('Calling login API...');
       await login(email, password);
       console.log('Login successful, closing modal');
       onClose();
       setEmail('');
       setPassword('');
     } catch (err) {
       console.error('Login failed:', err);
-      setError('Invalid email or password');
+      setError(err instanceof Error ? err.message : 'Invalid email or password');
     } finally {
       setLoading(false);
       console.log('=== LOGIN FORM SUBMISSION DEBUG END ===');
     }
   };