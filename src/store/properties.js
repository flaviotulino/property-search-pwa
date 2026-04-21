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

    function updateProperty(updatedProperty) {
        const index = data.value.findIndex(p => p.id === updatedProperty.id);
        if (index !== -1) {
            data.value[index] = updatedProperty;
        }
    }

    return {
        data,
        setProperties,
        deleteProperty,
        addProperty,
        updateProperty
    }
})

export default usePropertyStore;