import { defineStore } from "pinia";
import { ref } from "vue";

const usePropertyStore = defineStore('properties', () => {
    const data = ref();

    function setProperties(properties) {
        data.value = properties;
    }

    return {
        data,
        setProperties
    }
})

export default usePropertyStore;