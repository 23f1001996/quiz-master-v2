import Home from './components/Home.js'
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import Login from './components/Login.js'
import AlertMessage from './components/AlertMessage.js'

import Register from './components/Register.js'
import Dashboard from './components/Dashboard.js'
import Admin from './components/Admin.js'

const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/dashboard', component: Dashboard},
    {path: '/admin', component: Admin},
]

const router = new VueRouter({
    routes
})

const app = new Vue({
    el: '#app',
    router,
    data(){
        return {
            message: null 
        };
    },
    template: `
    <div class="container d-flex flex-column vh-100">
        <nav-bar></nav-bar>
        <alert-message :message="message"></alert-message> 
        <div class="flex-grow-1">
            <router-view></router-view>
        </div>
        <foot></foot>
    </div>`,
    components:{
        "nav-bar": Navbar,
        "foot": Footer,
        "alert-message": AlertMessage
    }
})