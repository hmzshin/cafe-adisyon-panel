import { axiosInstance } from '@/api/axiosInstance';

const path = 'category;';

const CategoryService = {
    async getCategoryList() {
        try {
            const response = await axiosInstance.get(path);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async createCategory(postData) {
        try {
            const formData = new FormData();
            formData.append('name', postData.name);
            formData.append('description', postData.description);
            formData.append('image', postData.image);
            const response = await axiosInstance.post(path, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async updateCategory(categoryId, postData) {
        try {
            const formData = new FormData();
            formData.append('name', postData.name);
            formData.append('description', postData.description);
            formData.append('image', postData.image);
            const url = path + '/' + categoryId;
            const response = await axiosInstance.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async getCategoryById(categoryId) {
        try {
            const url = path + '/' + categoryId;

            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async deleteCategory(categoryId) {
        try {
            const url = path + '/' + categoryId;
            const response = await axiosInstance.delete(url);
            return response.data;
        } catch (error) {
            return error;
        }
    }
};
export default CategoryService;
