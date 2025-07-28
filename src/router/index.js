/* eslint-disable */
// createWebHashHistory
//import { createRouter, createWebHashHistory } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

import providerService from '../service/providers'
import recipientService from '../service/recipients'
import loginService from '../service/login'
import validation from '../helpers/loginValidation.js'
import axios from "axios";

// let authenticated
// const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
// if (loggedUserJSON) {
//     const user = JSON.parse(loggedUserJSON)
//
//     console.log("User token in router: " + user.token)
//     authenticated = user
// }

const validateToken = async () => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')

    if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        const tokenValid = await loginService.verifyToken(user.token)
        if (!tokenValid) {
            window.localStorage.removeItem('loggedAppUser')
        }
    }

}


const routes = [
    {
        path: "/admin",
        name: "admin-panel",
        component: () => import("../pages/AdminPanel.vue")
    },
    {
        path: "/",
        name: "dash-board",
        component: () => import("../pages/Home.vue")
        // meta: {
        //     color: "#f1f1f1"
        // }
    },
    {
        path: "/language",
        name: "language",
        component: () => import("../components/Language")
    },
    {
        path: "/register",
        name: "app-register",
        component: () => import("../components/RegisterForm.vue")
    },
    {
        path: "/login",
        name: "login-register",
        component: () => import("../pages/LoginRegister.vue")

    },
    {
        path: "/profile",
        name: "user-profile",
        component: () => import("../pages/Profile.vue")
    },
    {
        path: "/pay-plan",
        name: "pay-plan",
        component: () => import("../pages/PayPlan")

    },
    {
        path: "/rules",
        name: "rules",
        component: () => import("../pages/Rules.vue")
    },
    {
        path: "/recipient-public",
        name: "recipient-public",
        component: () => import("../pages/RecipientPublic")
    },
    {
        path: "/recipient-form",
        name: "recipient-form",
        component: () => import("../pages/RecipientForm.vue"),
        props: true,
        // beforeEnter: async (to, from, next) => {
        //     const isAuthenticated = window.localStorage.getItem('loggedAppUser')
        //
        //     const user = JSON.parse(isAuthenticated)
        //     const results = await recipientService.getOwnBookings(user.id)
        //
        //     if (results.length > 0) {
        //         return next('/received');
        //     } else {
        //         next();
        //     }
        // },
        meta: {
            requiresAuth: true
        }


    },
    {
        path: "/received",
        name: "recipient-panel",
        component: () => import("../pages/RecipientPanel.vue"),


    },
    {
        path: "/recipient-result",
        name: "recipient-result",
        component: () => import("../pages/RecipientPanelResult")
    },
    {
        path: "/received-final/:data",
        name: "recipient-final",
        component: () => import("../pages/RecipientPanelFinal"),
        props: true
    },
    {
        path: '/rf',
        name: 'r-form',
        component: () => import("../pages/RecipientForm.vue"),
    },
    {
        path:  "/provider-public",
        name: "provider-public",
        component:() => import("../pages/ProviderPublic"),
        beforeEnter: async (to, from, next) => {
            const isAuthenticated = window.localStorage.getItem('loggedAppUser')



            if (!isAuthenticated){
                return next()
            } else {
                const user = JSON.parse(isAuthenticated)
                const isProvider = await providerService.getProvider(user.id)
                if (isProvider) {
                    return next('/provider-panel');
                } else next();

            }

        }
    },
    {
        path:  "/pro-public-search",
        name: "provider-public-search",
        component:() => import("../pages/ProviderPublic"),
    },
    {
        path: "/provider-form",
        name: "provider-form",
        component: () => import("../pages/ProviderForm.vue"),
        beforeEnter: async (to, from, next) => {
            const isAuthenticated = window.localStorage.getItem('loggedAppUser')

            const user = JSON.parse(isAuthenticated)
            //const isProvider = null;
            const isProvider = await providerService.getProvider(user.id)

            if (isProvider){
                return next('/provider-panel')
            } else {
                next()
            }

        }
    },
    {
        path: "/provider-panel",
        name: "provider-panel",
        component: () => import("../pages/ProviderPanel.vue"),
        // beforeEnter: async (to, from, next) => {
        //     const isAuthenticated = window.localStorage.getItem('loggedAppUser')
        //
        //     const providers = await providerService.getProviders();
        //
        //     if (!isAuthenticated){
        //         return next('/login')
        //     } else {
        //         const user = JSON.parse(isAuthenticated)
        //         console.log("user id index: " + user.id)
        //         providers.some(provider => {
        //             if (provider.user.id === user.id){
        //                 return next('/provider-panel');
        //             } else {
        //                 next('/provider-form');
        //             }
        //         })
        //         next();
        //     }
        //     next()
        // },
        props: true

    },
    {
      path: "/calendar",
      name: "calendar",
      component: () => import("../pages/Calendar.vue")
    },

    {
        path: "/location",
        name: "user-location",
        component: () => import("../pages/UserLocation")
    },
    {
        path: "/notification",
        name: "client-notifications",
        component: () => import("../pages/Notification.vue")
    },
    // {
    //     path: "/chat",
    //     name: "chat-panel",
    //     component: () => import("../pages/LiveChat.vue"),
    //     // meta: {
    //     //     reload: true,
    //     // },
    // },
    {
        path: "/chat",
        name: "live-chat",
        component: () => import("../pages/LiveChat")
    },
    {
        path: "/history",
        name: "user-history",
        component: () =>import("../pages/History.vue")
    },
    {
        path: "/feedback",
        name: "Feedback",
        component: () => import("../pages/Feedback.vue")
    },
    {
        path: "/gallery",
        name: "Gallery",
        component: () => import("../pages/Gallery.vue")

    },
    {
        path: "/pro-gallery",
        name: "pro-gallery",
        component: () => import("../pages/ProGallery.vue"),
        beforeEnter: checkAuth
    },
    {
        path: "/forgot_auth",
        name: "Forgot",
        component: () => import("../components/Forgot.vue")
    },
    {
        path: "/reset_auth/:token",
        name: "Reset",
        props: true,
        component: () => import("../components/Reset.vue")
    },
    {
      path: "/manual",
      name: "manual",
      component: () => import("../pages/Manual")
    },
    {
        path: "/message",
        name: "message",
        component: () => import("../pages/Messages")
    },
    {
        path: "/prompt",
        name: "actionPanel",
        component: () => import("../components/PromptPanel")
    }



];


function checkAuth(to, from, resolve) {
    //const { currentUser } = firebase.auth();
    const isAuthenticated = window.localStorage.getItem('loggedAppUser')

    const currentUser = JSON.parse(isAuthenticated)

    if (!currentUser) {
        return resolve('/login');


    } else resolve();
}

const protectedRoutes = [
    "recipient-form",
    "provider-form",
    "Gallery",
    "pro-gallery"
    //"provider-panel"
]

const router = createRouter({
    //history: createWebHashHistory(),
    history: createWebHistory(),

    routes,
    // routes: [
    //     { path: '/api/', children: routes}
    // ]
});

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = window.localStorage.getItem('loggedAppUser');

    if (isAuthenticated) {
        const user = JSON.parse(isAuthenticated)

    }

    const isProtected = protectedRoutes.includes(to.name);
    // isAuthenticated
    if(isProtected && !isAuthenticated){
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    } else next()

})



// router.beforeEach((to, from, next) => {
//     const isAuthenticated = window.localStorage.getItem('loggedAppUser')
//     const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//
//     if (requiresAuth && !isAuthenticated) {
//         //const loginpath = window.location.pathname;
//         const loginpath = ('/recipient-form')
//         next({ name: 'login-register', query: { from: loginpath } });
//     }
//     else next();
// });

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (!localStorage.getItem('loggedAppUser')) {
//             next({
//                 path: '/login',
//                 query: {
//                     redirectedFrom: to.fullPath
//                 }
//             })
//         } else {
//             next()
//         }
//     } else {
//         next()
//     }
// })





export default router;