export default {
    template: `
    <nav class="w-100 navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <router-link class="nav-link" to="/">Home</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <router-link class="nav-link" to="/login">Login</router-link>
            </div>
            <div class="navbar-nav">
                <router-link class="nav-link" to="/register">Register</router-link>
            </div>
            </div>
        </div>
    </nav>
    `
}