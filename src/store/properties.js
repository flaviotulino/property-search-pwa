import { defineStore } from "pinia";
import { ref } from "vue";

const usePropertyStore = defineStore('properties', () => {
    const data = ref();

    function setProperties(properties) {
        data.value = properties;
    }

    function deleteProperty(id) {
        data.value = data.value.filter(p => p.id !== id);
    }

    function addProperty(property) {
        data.value.push(property);
    }

    return {
        data,
        setProperties,
        deleteProperty,
        addProperty
    }
})

export default usePropertyStore;