import { createRouter, createWebHashHistory, RouterView } from "vue-router";
import PropertyListPage from "../pages/PropertyListPage.vue";
import axios from "axios";
import usePropertyStore from "../store/properties";
import PropertyDetailsPage from "../pages/PropertyDetailsPage.vue";

const routes = [
    {
        path: '/',
        component: RouterView,
        beforeEnter(to, from, next) {
            const propertyStore = usePropertyStore();

            if (propertyStore.data) {
                return true;
            }

            axios.get('https://property-search.flaviotulino.com/api/properties').then(response => {
                propertyStore.setProperties(response.data.properties);
                return next()
            })
        },
        children: [
            {
                path: '',
                name: 'property.list',
                component: PropertyListPage
            },
            {
                path: ':id',
                name: 'property.details',
                component: PropertyDetailsPage
            }
        ]
    },
    {
        path: '/parse',
        name: 'property.parse',
        component: PropertyDetailsPage,
        meta: {
            isParsing: true
        }
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
