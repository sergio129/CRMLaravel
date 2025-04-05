<template>
  <div class="login-form">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          required
          class="form-control"
        >
      </div>
      
      <div class="form-group">
        <label for="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          required
          class="form-control"
        >
      </div>
      
      <div class="alert alert-danger" v-if="error">
        {{ error }}
      </div>
      
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: null,
      loading: false
    }
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.form)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }
        
        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect or update UI
        window.location.href = '/dashboard';
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.form-group {
  margin-bottom: 1rem;
}
.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background-color: #3490dc;
  color: white;
  border: none;
}
.alert {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}
.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
