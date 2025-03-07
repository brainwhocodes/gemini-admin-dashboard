<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold text-center mb-6">Reset Your Password</h2>
        
        <div v-if="emailSent" class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Password reset instructions have been sent to your email.</span>
        </div>
        
        <form v-if="!emailSent" @submit.prevent="handleForgotPassword">
          <!-- Email Input -->
          <div class="form-control w-full mt-4">
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
          
          <!-- Submit Button -->
          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
              {{ isLoading ? 'Sending...' : 'Send Reset Instructions' }}
            </button>
          </div>
        </form>
        
        <!-- Back to Login Link -->
        <div class="text-center mt-4">
          <NuxtLink to="/login" class="link link-primary">Back to Login</NuxtLink>
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

// Form data
const email = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const emailSent = ref(false);

// Forgot password handler
const handleForgotPassword = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Call the forgot-password API endpoint
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { 
        email: email.value
      }
    });
    
    if (response.success) {
      emailSent.value = true;
    } else {
      errorMessage.value = response.message || 'Failed to send reset instructions. Please try again.';
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    errorMessage.value = error.data?.statusMessage || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>
