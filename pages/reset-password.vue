<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold text-center mb-6">Create New Password</h2>
        
        <div v-if="resetSuccess" class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Your password has been successfully reset.</span>
          <div class="mt-4">
            <NuxtLink to="/login" class="btn btn-primary">Go to Login</NuxtLink>
          </div>
        </div>
        
        <form v-if="!resetSuccess" @submit.prevent="handleResetPassword">
          <!-- New Password Input -->
          <div class="form-control w-full mt-4">
            <label class="label">
              <span class="label-text">New Password</span>
            </label>
            <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                placeholder="Create a new password" 
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
            <label class="label">
              <span class="label-text-alt">Password must be at least 8 characters, include uppercase, lowercase, and a number</span>
            </label>
          </div>
          
          <!-- Confirm Password Input -->
          <div class="form-control w-full mt-4">
            <label class="label">
              <span class="label-text">Confirm New Password</span>
            </label>
            <input 
              type="password" 
              v-model="confirmPassword" 
              placeholder="Confirm your new password" 
              class="input input-bordered w-full" 
              required
            />
          </div>
          
          <!-- Submit Button -->
          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isLoading || !passwordsMatch"
            >
              <span v-if="isLoading" class="loading loading-spinner loading-sm"></span>
              {{ isLoading ? 'Resetting Password...' : 'Reset Password' }}
            </button>
          </div>
        </form>
        
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
import { ref, computed, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

// Form data
const token = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const resetSuccess = ref(false);

// Computed properties
const passwordsMatch = computed(() => {
  return !password.value || !confirmPassword.value || password.value === confirmPassword.value;
});

// Get token from URL on component mount
onMounted(() => {
  token.value = route.query.token ? String(route.query.token) : '';
  
  if (!token.value) {
    errorMessage.value = 'Invalid or missing reset token. Please request a new password reset link.';
  }
});

// Reset password handler
const handleResetPassword = async () => {
  try {
    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
    
    // Validate token exists
    if (!token.value) {
      errorMessage.value = 'Invalid or missing reset token. Please request a new password reset link.';
      return;
    }
    
    isLoading.value = true;
    errorMessage.value = '';
    
    // Call the reset-password API endpoint
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { 
        token: token.value,
        password: password.value
      }
    });
    
    if (response.success) {
      resetSuccess.value = true;
    } else {
      errorMessage.value = response.message || 'Failed to reset password. Please try again.';
    }
  } catch (error) {
    console.error('Reset password error:', error);
    errorMessage.value = error.data?.statusMessage || 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>
