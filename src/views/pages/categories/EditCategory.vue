<template>
    <div class="card w-full">
        <div class="page-title">Kategori Düzenleme</div>
        <div class="w-full mt-4">
            <Form v-slot="$form" :initialValues="categoryForm" :resolver="resolver" :validateOn @submit="onFormSubmit" class="flex flex-col gap-4">
                <div class="w-full flex flex-wrap gap-4">
                    <!-- Name Field -->
                    <FormField as="section" name="name" initialValue="" class="w-[49%] py-2">
                        <label for="name" class="block mb-2 font-medium">Kategori Adı</label>
                        <InputText v-model="categoryForm.name" class="w-full" type="text" placeholder="Kategori Adı" id="name" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error.message }}
                        </Message>
                    </FormField>

                    <!-- Description Field -->
                    <FormField as="section" name="description" initialValue="" class="w-[49%] py-2">
                        <label for="description" class="block mb-2 font-medium">Kategori Açıklaması</label>
                        <Textarea v-model="categoryForm.description" class="w-full" placeholder="Kategori Açıklaması" :autoResize="true" rows="5" id="description" />
                        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.description.error.message }}
                        </Message>
                    </FormField>

                    <!-- Image Field -->
                    <FormField as="section" name="image" initialValue="" class="py-2 flex items-start flex-col">
                        <label for="image" class="block mb-2 font-medium">Kategori Resmi</label>
                        <div v-if="image" class="image-upload-container">
                            <img :src="imagePath + image" alt="Selected Image" class="w-full h-full object-fill rounded-lg" />
                            <Button icon="pi pi-trash" class="image-upload-delete-button p-button-danger" @click="removeImage" />
                        </div>
                        <FileUpload v-else mode="basic" name="image" accept="image/*" :maxFileSize="1000000" :file-limit="1" @select="onImageUpload" chooseLabel="Seç" :auto="false" uploadLabel="Yükle" cancelLabel="İptal" id="image" />
                        <Message v-if="$form.image?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.image.error.message }}
                        </Message>
                    </FormField>

                    <!-- Submit Button -->
                    <div class="w-full flex justify-end mt-4">
                        <Button type="submit" label="Güncelle" class="p-button-success" />
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import categoryService from '@/service/CategoryService';
import { imagePath } from '@/api/axiosInstance';

const toast = useToast();
const route = useRoute();
const router = useRouter();

const categoryId = route.params.id;

// Reactive form data
const categoryForm = ref({
    name: '',
    description: '',
    image: null
});

// Image preview
const image = ref(null);

// Validation schema
const resolver = zodResolver(z.object({}));

// Fetch category details when the component is mounted
onMounted(async () => {
    await getCategoryById();
});

const onImageUpload = (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    categoryForm.value.image = file;
    reader.onload = (e) => {
        image.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

// Remove image
const removeImage = () => {
    categoryForm.value.image = null;
    image.value = null;
};

// Handle form submission
const onFormSubmit = async ({ valid }) => {
    if (!valid) return;

    try {
        // Update the category
        const result = await categoryService.updateCategory(categoryId, categoryForm.value);
        if (result.status !== 200) {
            throw new Error('Kategori güncellenirken bir hata oluştu');
        }

        // Show success message
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kategori başarıyla güncellendi', life: 3000 });

        // Optionally, navigate back to the category list
        await router.push('/categories/list');
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Kategori güncellenirken bir hata oluştu',
            life: 3000
        });
    }
};

const getCategoryById = async () => {
    try {
        // Fetch the category details
        const response = await categoryService.getCategoryById(categoryId);
        if (response.status === 200) {
            // Populate the form with the fetched data
            categoryForm.value = {
                name: response.data.name,
                description: response.data.description,
                image: response.data.image
            };

            // Set the image preview if an image exists
            if (response.data.image) {
                image.value = response.data.image;
            }
        } else {
            throw new Error('Kategori bilgileri alınamadı');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Kategori bilgileri alınamadı', life: 3000 });
    }
};
</script>

<style scoped>
.image-upload-container {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-upload-delete-button {
    position: absolute;
    top: calc(50% - 20px);
    left: calc(50% - 20px);
}

/* Optional: Add custom styles for the Textarea */
textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
}
</style>
