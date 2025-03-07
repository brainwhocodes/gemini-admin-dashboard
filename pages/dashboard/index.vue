<template>
  <div class="min-h-screen bg-base-100">
    <!-- Navbar -->
    <div class="navbar bg-base-200 shadow-md">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">Admin Dashboard</a>
      </div>
      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img alt="User avatar" src="https://ui-avatars.com/api/?name=Admin+User&background=random" />
            </div>
          </div>
          <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a @click="logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="flex">
      <!-- Sidebar -->
      <div class="w-64 min-h-[calc(100vh-4rem)] bg-base-200 shadow-lg">
        <ul class="menu p-4 text-base-content">
          <li class="menu-title">Main</li>
          <li><a class="active">Dashboard</a></li>
          <li><a>Analytics</a></li>
          <li><a>Reports</a></li>
          
          <li class="menu-title mt-4">Management</li>
          <li><a>Users</a></li>
          <li><a>Products</a></li>
          <li><a>Orders</a></li>
          
          <li class="menu-title mt-4">Settings</li>
          <li><a>Account</a></li>
          <li><a>Preferences</a></li>
        </ul>
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-8">
        <h1 class="text-3xl font-bold mb-6">Dashboard Overview</h1>
        
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="stats shadow">
            <div class="stat">
              <div class="stat-title">Total Users</div>
              <div class="stat-value">31K</div>
              <div class="stat-desc">Jan 1st - Feb 1st</div>
            </div>
          </div>
          
          <div class="stats shadow">
            <div class="stat">
              <div class="stat-title">New Users</div>
              <div class="stat-value text-primary">4,200</div>
              <div class="stat-desc">↗︎ 400 (22%)</div>
            </div>
          </div>
          
          <div class="stats shadow">
            <div class="stat">
              <div class="stat-title">Sales</div>
              <div class="stat-value text-secondary">$45,600</div>
              <div class="stat-desc">↗︎ 15% from last month</div>
            </div>
          </div>
          
          <div class="stats shadow">
            <div class="stat">
              <div class="stat-title">Active Users</div>
              <div class="stat-value text-accent">12K</div>
              <div class="stat-desc">↘︎ 90 (14%)</div>
            </div>
          </div>
        </div>
        
        <!-- Recent Activity -->
        <div class="card bg-base-100 shadow-xl mb-8">
          <div class="card-body">
            <h2 class="card-title">Recent Activity</h2>
            <div class="overflow-x-auto">
              <table class="table table-zebra">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar">
                          <div class="mask mask-squircle w-8 h-8">
                            <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">John Doe</div>
                          <div class="text-sm opacity-50">United States</div>
                        </div>
                      </div>
                    </td>
                    <td>Logged in</td>
                    <td>10 minutes ago</td>
                    <td><div class="badge badge-success">Success</div></td>
                  </tr>
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar">
                          <div class="mask mask-squircle w-8 h-8">
                            <img src="https://ui-avatars.com/api/?name=Jane+Smith&background=random" alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">Jane Smith</div>
                          <div class="text-sm opacity-50">Canada</div>
                        </div>
                      </div>
                    </td>
                    <td>Created a new post</td>
                    <td>25 minutes ago</td>
                    <td><div class="badge badge-success">Success</div></td>
                  </tr>
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar">
                          <div class="mask mask-squircle w-8 h-8">
                            <img src="https://ui-avatars.com/api/?name=Robert+Johnson&background=random" alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">Robert Johnson</div>
                          <div class="text-sm opacity-50">United Kingdom</div>
                        </div>
                      </div>
                    </td>
                    <td>Updated profile</td>
                    <td>1 hour ago</td>
                    <td><div class="badge badge-success">Success</div></td>
                  </tr>
                  <tr>
                    <td>
                      <div class="flex items-center gap-3">
                        <div class="avatar">
                          <div class="mask mask-squircle w-8 h-8">
                            <img src="https://ui-avatars.com/api/?name=Emily+Davis&background=random" alt="Avatar" />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">Emily Davis</div>
                          <div class="text-sm opacity-50">Australia</div>
                        </div>
                      </div>
                    </td>
                    <td>Failed login attempt</td>
                    <td>2 hours ago</td>
                    <td><div class="badge badge-error">Failed</div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Quick Actions</h2>
              <div class="flex flex-wrap gap-2 mt-2">
                <button class="btn btn-primary">Add User</button>
                <button class="btn btn-secondary">Create Report</button>
                <button class="btn btn-accent">Export Data</button>
                <button class="btn btn-info">Send Notifications</button>
              </div>
            </div>
          </div>
          
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">System Status</h2>
              <div class="mt-2">
                <div class="flex justify-between mb-2">
                  <span>Server Load</span>
                  <span>65%</span>
                </div>
                <progress class="progress progress-primary w-full" value="65" max="100"></progress>
                
                <div class="flex justify-between mt-4 mb-2">
                  <span>Memory Usage</span>
                  <span>42%</span>
                </div>
                <progress class="progress progress-secondary w-full" value="42" max="100"></progress>
                
                <div class="flex justify-between mt-4 mb-2">
                  <span>Disk Space</span>
                  <span>78%</span>
                </div>
                <progress class="progress progress-accent w-full" value="78" max="100"></progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  // Here you would typically clear authentication tokens/cookies
  // For example:
  // localStorage.removeItem('authToken');
  
  // Redirect to login page
  router.push('/');
};
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
