import { axiosInstance } from '@/api/axiosInstance';

const path = 'desk;';

const TableService = {
    async createTable(postData) {
        const formData = new FormData();
        formData.append('name', postData.name);
        formData.append('capacity', postData.capacity);
        const response = await axiosInstance.post(path, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    },

    async getTable(tableId) {
        let url = path + '/' + tableId;
        const response = await axiosInstance.get(url);
        return response.data;
    },

    async getTableList() {
        const response = await axiosInstance.get(path);
        return response.data;
    },

    async updateTable(tableId, postData) {
        const formData = new FormData();
        formData.append('name', postData.name);
        formData.append('capacity', postData.capacity);
        const url = path + '/' + tableId;
        const response = await axiosInstance.put(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async deleteTable(tableId) {
        let url = path + '/' + tableId;
        const response = await axiosInstance.delete(url);
        return response.data;
    }
};

export default TableService;
