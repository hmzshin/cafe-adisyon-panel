import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
    state: () => ({
        tableId: null // Holds the ID of the table to edit
    }),
    actions: {
        // Set the tableId
        setTableID(id) {
            this.tableId = id;
        },
        // Clear the tableId
        clearTableID() {
            this.tableId = null;
        }
    },
    getters: {
        // Get the tableId
        getTableID: (state) => state.tableId
    }
});
