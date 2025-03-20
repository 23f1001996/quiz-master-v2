import Home from './components/Home.js'
import Navbar from './components/Navbar.js'
import Footer from './components/Footer.js'
import Login from './components/Login.js'
import AlertMessage from './components/AlertMessage.js'

import Register from './components/Register.js'
import Dashboard from './components/Dashboard.js'
import Admin from './components/Admin.js'
import Logout from './components/Logout.js'
import Subjects from './components/Subjects.js'
import Chapters from './components/Chapters.js'
import Quizzes from './components/Quizzes.js'
import Questions from './components/Questions.js'
import AttemptQuiz from './components/AttemptQuiz.js'
import QuizResult from './components/QuizResult.js'


const routes = [
    {path: '/', component: Home},
    {path: '/login', component: Login},
    {path: '/register', component: Register},
    {path: '/dashboard', component: Dashboard},
    {path: '/admin', component: Admin},
    {path: '/logout', component: Logout},
    {path: '/subjects', component: Subjects},
    {path: '/Chapters/:subjectId', component: Chapters},
    {path: '/Quizzes/:chapterId', component: Quizzes},
    {path: '/Questions/:quizId', component: Questions},
    {path: '/attempt/:quizId', component: AttemptQuiz},
    {path: '/result/:quizId', component: QuizResult},
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