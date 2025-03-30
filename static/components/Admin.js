export default {
    template: `
   <div class="container mt-4">
    <h2 class="text-center mb-4">Users List</h2>
    
    <!-- Search Bar with Select Filter -->
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <select v-model="filterKey" class="form-select" style="width: 150px;">
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
                <option value="qualification">Qualification</option>
                <option value="skills">Skills</option>
            </select>
        </div>
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Search users..." @input="searchUsers">
        <button class="btn btn-primary" @click="searchUsers">
            <i class="fas fa-search"></i>
        </button>
    </div>
    
    <!-- Show message if no users are found -->
    <div v-if="filteredUsers.length === 0" class="alert alert-warning text-center">
        No users found.
    </div>
    
    <!-- User Table -->
    <table v-else class="table table-bordered table-striped">
        <thead class="table-warning">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Qualification</th>
                <th>Skills</th>
                <th>Date of Birth</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in filteredUsers" :key="user.email">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user.qualification }}</td>
                <td>{{ Array.isArray(user.skills) ? user.skills.join(', ') : user.skills }}</td>
                <td>{{ new Date(user.dob).toLocaleDateString('en-GB') }}</td>
                <td>
                    <span :class="{'text-success': user.active, 'text-danger': !user.active}">
                        {{ user.active ? 'Active' : 'Inactive' }}
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
   </div>
    `,

    data() {
        return {
            userData: null,
            users: [],
            searchQuery: "",
            filteredUsers: [],
            filterKey: "name" // Default filter option
        };
    },

    mounted() {
        this.loadUser();
        this.loadUsers();
    },

    methods: {
        loadUser() {
            fetch('/api/user', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.userData = data;
            });
        },

        loadUsers() {
            fetch('/api/users', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authentication-Token": localStorage.getItem("auth_token")
                }
            })
            .then(response => response.json())
            .then(data => {
                this.users = data;
                this.filteredUsers = data;
            });
        },

        searchUsers() {
            const query = this.searchQuery.toLowerCase();
            this.filteredUsers = this.users.filter(user => {
                let fieldValue = user[this.filterKey];
                if (Array.isArray(fieldValue)) {
                    fieldValue = fieldValue.join(', ');
                }
                return fieldValue.toLowerCase().includes(query);
            });
        }
    }
}
