export default {
    template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top w-100">
        <div class="container-fluid">
            <router-link class="navbar-brand d-flex align-items-center" to="/">
                <i class="fas fa-home me-2"></i> Home
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <router-link v-if="!userData" class="nav-link" to="/login">
                        <i class="fas fa-sign-in-alt me-2"></i> Login
                    </router-link>
                    <router-link v-if="!userData" class="nav-link" to="/register">
                        <i class="fas fa-user-plus me-2"></i> Register
                    </router-link>
                    <router-link v-if="userData?.role === 'admin'" class="nav-link text-primary" to="/admin">
                    <i class="fa-solid fa-chart-line"></i> Dashboard
                    </router-link>
                    <router-link v-if="userData?.role === 'admin'" class="nav-link" to="/subjects">
                    <i class="fa-duotone fa-solid fa-chart-bar"></i> Subjects
                    </router-link>
                    <router-link v-if="userData?.role === 'user'" class="nav-link" to="/subjects">
                    <i class="fa-duotone fa-solid fa-chart-bar"></i> Subjects
                    </router-link>
                    <router-link v-if="userData" class="nav-link text-danger" to="/logout">
                        <i class="fas fa-sign-out-alt me-2"></i> Logout
                    </router-link>
                </div>
            </div>
        </div>
    </nav>
    `,
    data() {
        return {
            userData: null
        };
    },
    mounted() {
        this.loadUser();
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
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load user data");
                }
                return response.json();
            })
            .then(data => {
                // this.$root.message = 'User not found'
                this.userData = data;
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
        }
    }
};
