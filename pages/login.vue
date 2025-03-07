<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold text-center justify-center">Sign in to your account</h2>
        <p class="text-center text-sm">
          Or
          <NuxtLink to="/register" class="link link-primary">
            create a new account
          </NuxtLink>
        </p>
        
        <div v-if="error" class="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ error }}</span>
        </div>
        
        <form class="mt-4 space-y-4" @submit.prevent="login">
          <!-- Email Input -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Email address</span>
            </label>
            <input
              type="email"
              autocomplete="email"
              required
              v-model="form.email"
              class="input input-bordered w-full"
              placeholder="Email address"
            />
          </div>
          
          <!-- Password Input -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              type="password"
              autocomplete="current-password"
              required
              v-model="form.password"
              class="input input-bordered w-full"
              placeholder="Password"
            />
          </div>

          <div class="flex items-center justify-between mt-2">
            <div class="form-control">
              <label class="label cursor-pointer">
                <input
                  type="checkbox"
                  v-model="form.rememberMe"
                  class="checkbox checkbox-primary"
                />
                <span class="label-text ml-2">Remember me</span>
              </label>
            </div>

            <div>
              <NuxtLink to="/forgot-password" class="link link-primary text-sm">
                Forgot your password?
              </NuxtLink>
            </div>
          </div>

          <div class="form-control mt-6">
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary w-full"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter();
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
});
const loading = ref(false);
const error = ref('');

// Check if user is already logged in
onMounted(async () => {
  try {
    const { data } = await useFetch('/api/auth/me');
    if (data.value?.success) {
      router.push('/dashboard');
    }
  } catch (err) {
    // Not logged in, stay on login page
  }
});

async function login() {
  try {
    loading.value = true;
    error.value = '';
    
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password
      }
    });
    
    if (response.success) {
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      error.value = response.message || 'An error occurred during login';
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = err.data?.statusMessage || 'Invalid credentials';
  } finally {
    loading.value = false;
  }
}
</script>
