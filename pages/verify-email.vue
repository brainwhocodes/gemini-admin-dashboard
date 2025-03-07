<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold text-center mb-6">Email Verification</h2>
        
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-8">
          <div class="loading loading-spinner loading-lg"></div>
          <p class="mt-4 text-center">Verifying your email...</p>
        </div>
        
        <div v-else-if="verificationSuccess" class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Your email has been successfully verified!</span>
          <div class="mt-4">
            <NuxtLink to="/login" class="btn btn-primary">Go to Login</NuxtLink>
          </div>
        </div>
        
        <div v-else-if="errorMessage" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ errorMessage }}</span>
          <div class="mt-4">
            <NuxtLink to="/login" class="btn btn-outline">Back to Login</NuxtLink>
          </div>
        </div>
        
        <div v-else-if="!token" class="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>Invalid verification link. Please check your email and try again.</span>
          <div class="mt-4">
            <NuxtLink to="/login" class="btn btn-outline">Back to Login</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const route = useRoute();
const token = ref('');
const isLoading = ref(true);
const errorMessage = ref('');
const verificationSuccess = ref(false);

// Verify email on component mount
onMounted(async () => {
  // Get token from URL
  token.value = route.query.token ? String(route.query.token) : '';
  
  if (!token.value) {
    isLoading.value = false;
    return;
  }
  
  try {
    // Call the verify-email API endpoint
    const response = await $fetch(`/api/auth/verify-email?token=${token.value}`);
    
    if (response.success) {
      verificationSuccess.value = true;
    } else {
      errorMessage.value = response.message || 'Failed to verify email. Please try again.';
    }
  } catch (error) {
    console.error('Email verification error:', error);
    errorMessage.value = error.data?.statusMessage || 'Invalid or expired verification token.';
  } finally {
    isLoading.value = false;
  }
});
</script>
