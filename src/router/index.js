import { createRouter, createWebHistory, RouterView } from "vue-router";
import PropertyListPage from "../pages/PropertyListPage.vue";
import axios from "axios";
import usePropertyStore from "../store/properties";
import PropertyDetailsPage from "../pages/PropertyDetailsPage.vue";

const routes = [
    {
        path: '/',
        component: RouterView,
        async beforeEnter(to, from) {
            const propertyStore = usePropertyStore();

            const response = await axios
                .get("https://property-search-api.flaviotulino.com/properties")


            propertyStore.setProperties(response.data.properties);
            return true;
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
    history: createWebHistory(),
    routes
})

export default router;
