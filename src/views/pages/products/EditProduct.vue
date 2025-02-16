<template>
    <div class="card w-full">
        <div class="page-title">Ürün Düzenleme</div>
        <div class="w-full mt-4">
            <Form v-slot="$form" :initialValues="productForm" :resolver="resolver" :validateOn @submit="onFormSubmit" class="flex flex-col gap-4">
                <div class="w-full flex flex-wrap gap-4">
                    <!-- Product Name Field -->
                    <FormField as="section" name="name" initialValue="" class="w-[49%] py-2">
                        <InputText v-model="productForm.name" class="w-full" type="text" placeholder="Ürün Adı" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error.message }}
                        </Message>
                    </FormField>

                    <!-- Product Description Field -->
                    <FormField as="section" name="description" initialValue="" class="w-[49%] py-2">
                        <InputText v-model="productForm.description" class="w-full" type="text" placeholder="Ürün Açıklaması" />
                        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.description.error.message }}
                        </Message>
                    </FormField>

                    <!-- Product Price Field -->
                    <FormField as="section" name="price" initialValue="0" class="w-[49%] py-2">
                        <InputNumber v-model="productForm.price" class="w-full" showButtons mode="currency" locale="tr-Tr" currency="TRY" placeholder="Ürün fiyatı" />
                        <Message v-if="$form.price?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.price.error.message }}
                        </Message>
                    </FormField>

                    <!-- Product Category Field -->
                    <FormField as="section" name="categoryId" initialValue="" class="w-[49%] py-2">
                        <Select v-model="productForm.categoryId" class="w-full" :options="categoryOptions" option-label="name" option-value="id" placeholder="Kategori" />
                        <Message v-if="$form.categoryId?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.categoryId.error.message }}
                        </Message>
                    </FormField>

                    <!-- Product Image Field -->
                    <FormField as="section" name="image" initialValue="" class="w-[49%] py-2 flex items-start flex-col">
                        <div v-if="image" class="image-upload-container">
                            <img :src="imagePath + image" alt="Selected Image" class="w-full h-full object-fill rounded-lg" />
                            <Button icon="pi pi-trash" class="image-upload-delete-button p-button-danger" @click="removeImage" />
                        </div>
                        <FileUpload v-else mode="basic" name="image" url="./upload.php" accept="image/*" :maxFileSize="1000000" :file-limit="1" @select="onImageUpload" chooseLabel="Seç" :auto="false" uploadLabel="Yükle" cancelLabel="İptal" />

                        <Message v-if="$form.image?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.image.error.message }}
                        </Message>
                    </FormField>

                    <!-- Submit Button -->
                    <div class="w-full flex justify-end mt-4">
                        <Button type="submit" label="Güncelle" class="w-60" />
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import categoryService from '@/service/CategoryService';
import productService from '@/service/ProductService';
import { imagePath } from '@/api/axiosInstance';

const toast = useToast();
const route = useRoute();
const router = useRouter();

// Extract productId from the route (e.g., /product/edit/10)
const productId = computed(() => route.params.id);

// Reactive form data
const productForm = ref({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    image: null
});
const product = ref(null);

// Image preview
const image = ref(null);

// Category options
const categoryOptions = ref([]);

// Validation schema
const resolver = zodResolver(z.object({}));

// Fetch product details when the component is mounted
onMounted(async () => {
    await Promise.all([getProductById(), getCategoryList()]).then(() => {
        productForm.value.categoryId = product.value.categoryId;
    });
});

// Handle image upload
const onImageUpload = (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    productForm.value.image = file;
    reader.onload = (e) => {
        image.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

// Remove image
const removeImage = () => {
    productForm.value.image = null;
    image.value = null;
};

// Handle form submission
const onFormSubmit = async ({ valid }) => {
    if (!valid) return;

    try {
        // Update the product
        const result = await productService.updateProduct(productId.value, productForm.value);
        if (result.status !== 200) {
            throw new Error('Ürün güncellenirken bir hata oluştu');
        }

        // Show success message
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün başarıyla güncellendi', life: 3000 });

        // Optionally, navigate back to the product list
        await router.push('/products/list');
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Ürün güncellenirken bir hata oluştu', life: 3000 });
    }
};

const getProductById = async () => {
    try {
        // Fetch the product details
        const productResponse = await productService.getProductById(productId.value);

        // Check for a successful response (status 200)
        if (productResponse && productResponse.status === 200) {
            // Populate the form with the fetched data
            productForm.value = {
                name: productResponse.data.name,
                description: productResponse.data.description,
                price: productResponse.data.price,
                categoryId: productResponse.data.categoryId,
                image: productResponse.data.image
            };
            product.value = productResponse.data;

            // Set the image preview if an image exists
            if (productResponse.data.image) {
                image.value = productResponse.data.image;
            }
        } else {
            // Handle if the response status is not 200
            throw new Error('Ürün bilgileri alınamadı');
        }
    } catch (error) {
        // Add a toast notification for error handling
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Ürün detay yüklenirken hata oluştu', life: 3000 });
    }
};

const getCategoryList = async () => {
    try {
        // Fetch the list of categories
        const categoryResponse = await categoryService.getCategoryList();

        // Check for a successful response (status 200)
        if (categoryResponse && categoryResponse.status === 200) {
            // Populate the category options
            categoryOptions.value = categoryResponse.data;
        } else {
            // Handle if the response status is not 200
            throw new Error('Kategoriler alınamadı');
        }
    } catch (error) {
        // Add a toast notification for error handling
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Kategoriler yüklenirken hata oluştu', life: 3000 });
    }
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
