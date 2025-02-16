import { axiosInstance } from '@/api/axiosInstance';

const path = 'product;';

const ProductService = {

    async createProduct(postData) {
        try {
            const formData = new FormData();
            formData.append('name', postData.name);
            formData.append('price', postData.price);
            formData.append('description', postData.description);
            formData.append('image', postData.image);
            formData.append('categoryId', postData.categoryId);

            const response = await axiosInstance.post(path, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async getProducts() {
        try {
            const response = await axiosInstance.get(path);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async getProductById(id) {
        try {
            const response = await axiosInstance.get(path + "/" +id);
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async updateProduct(id, postData) {
        try {
            const formData = new FormData();
            formData.append('name', postData.name);
            formData.append('price', postData.price);
            formData.append('description', postData.description);
            formData.append('image', postData.image);
            formData.append('categoryId', postData.categoryId);

            const url = path + "/" + id;

            const response = await axiosInstance.put(url, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    async deleteProduct(id) {
        try {
            const response = await axiosInstance.delete(path + "/" + id);
            return response.data;
        } catch (error) {
            return error;
        }
    }


};
export default ProductService;
