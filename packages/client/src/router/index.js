import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/availability',
            name: 'availability',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/Availability.vue'),
        },
        {
            path: '/waitlist',
            name: 'waitlist',
            component: () => import('../views/WaitlistView.vue')
        },
        {
            path: '/config/globalSettings',
            name: 'Config: Global Settings',
            component: () => import('../views/config/GlobalSettingsConfigView.vue')
        },
        {
            path: '/config/consoles',
            name: 'Config: Consoles',
            component: () => import('../views/config/ConsoleConfigView.vue')
        },
        {
            path: '/config/stations',
            name: 'Config: Stations',
            component: () => import('../views/config/StationConfigView.vue')
        }
    ],
})

export default router
