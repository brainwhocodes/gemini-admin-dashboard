<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold text-center mb-6">Login</h2>
        
        <form @submit.prevent="handleLogin">
          <!-- Email Input -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input 
              type="email" 
              v-model="email" 
              placeholder="your@email.com" 
              class="input input-bordered w-full" 
              required
            />
          </div>
          
          <!-- Password Input -->
          <div class="form-control w-full mt-4">
            <label class="label">
              <span class="label-text">Password</span>
              <a href="#" class="label-text-alt link link-hover">Forgot password?</a>
            </label>
            <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                placeholder="Enter your password" 
                class="input input-bordered w-full pr-10" 
                required
              />
              <button 
                type="button"
                @click="showPassword = !showPassword" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <span v-if="showPassword" class="text-sm opacity-70">Hide</span>
                <span v-else class="text-sm opacity-70">Show</span>
              </button>
            </div>
          </div>
          
          <!-- Remember Me Checkbox -->
          <div class="form-control mt-4">
            <label class="cursor-pointer label justify-start gap-2">
              <input type="checkbox" v-model="rememberMe" class="checkbox checkbox-sm" />
              <span class="label-text">Remember me</span>
            </label>
          </div>
          
          <!-- Login Button -->
          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>
        
        <!-- Divider -->
        <div class="divider text-xs opacity-70">OR CONTINUE WITH</div>
        
        <!-- Social Login Buttons -->
        <div class="flex gap-2">
          <button class="btn btn-outline flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Google
          </button>
          <button class="btn btn-outline flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
            </svg>
            LinkedIn
          </button>
        </div>
        
        <!-- Sign Up Link -->
        <div class="text-center mt-4">
          <p>Don't have an account? 
            <NuxtLink to="/register" class="link link-primary">Sign up</NuxtLink>
          </p>
        </div>
        
        <!-- Alert for errors -->
        <div v-if="errorMessage" class="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form data
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

// Login handler
const handleLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically make an API call to authenticate
    // For example:
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: email.value, password: password.value })
    // });
    
    // if (!response.ok) {
    //   throw new Error('Invalid credentials');
    // }
    
    // const data = await response.json();
    
    // For demo purposes, we're just redirecting
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>