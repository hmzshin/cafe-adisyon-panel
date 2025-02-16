import { axiosInstance } from '@/api/axiosInstance';

const  path = 'desk;';
var url = "";

const TableService = {
    async createTable(postData) {
        try {
            const formData = new FormData();
            formData.append('name', postData.name);
            formData.append('capacity', postData.capacity);
            const response = await axiosInstance.post(path, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            throw error;
        }
    },



    async getTable(tableId) {
        try {
           let url = path + "/" + tableId;
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async getTableList() {
        try {
            const  response =  await  axiosInstance.get(path);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async updateTable(tableId, postData) {
        try {
            const formData = new FormData();
            formData.append('name', postData.name);
            formData.append('capacity', postData.capacity);
            url = path + "/" + tableId;
            const response = await axiosInstance.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async deleteTable(tableId) {
        try {
            let url = path + "/" + tableId;
            const response = await axiosInstance.delete(url);
            return response.data;
        } catch (error) {
            return error;
        }
    }
};
export default TableService;
