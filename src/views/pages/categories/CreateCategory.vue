<template>
    <div class="card w-full">
        <div class="page-title">Kategori Tanımlama</div>
        <div class="w-full mt-4">
            <Form v-slot="$form" :initialValues="categoryForm" :resolver="resolver" :validateOn @submit="onFormSubmit" class="flex flex-col gap-4">
                <div class="w-full flex flex-wrap gap-4">
                    <!-- Name Field -->
                    <FormField as="section" name="name" initialValue="" class="w-[49%] py-2">
                        <label for="name" class="block mb-2 font-medium">Kategori Adı</label>
                        <InputText v-model="categoryForm.name" class="w-full" type="text" placeholder="Kategori Adı" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error.message }}
                        </Message>
                    </FormField>

                    <!-- Description Field -->
                    <FormField as="section" name="description" initialValue="" class="w-[49%] py-2">
                        <label for="description" class="block mb-2 font-medium">Kategori Açıklaması</label>
                        <Textarea v-model="categoryForm.description" class="w-full" placeholder="Kategori Açıklaması" :autoResize="true" rows="5" />
                        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.description.error.message }}
                        </Message>
                    </FormField>

                    <!-- Image Field -->
                    <FormField as="section" name="image" initialValue="" class="w-56 py-2 flex items-start flex-col">
                        <label for="image" class="block mb-2 font-medium">Kategori Resmi</label>
                        <div v-if="image" class="image-upload-container">
                            <img :src="image" alt="Selected Image" class="w-full h-full object-fill rounded-lg" />
                            <Button icon="pi pi-trash" class="image-upload-delete-button p-button-danger" @click="removeImage" />
                        </div>

                        <FileUpload v-else mode="basic" name="image" url="./upload.php" accept="image/*" :maxFileSize="1000000" :file-limit="1" @select="onImageUpload" chooseLabel="Seç" :auto="false" uploadLabel="Yükle" cancelLabel="İptal" />
                        <Message v-if="$form.image?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.image.error.message }}
                        </Message>
                    </FormField>

                    <!-- Submit Button -->
                    <div class="w-full flex justify-end mt-4">
                        <Button type="submit" label="Kaydet" class="p-button-success" />
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script setup>
import categoryService from '@/service/CategoryService';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { z } from 'zod';

const toast = useToast();

// Define the validation schema for the category form
const resolver = zodResolver(
    z.object({
        name: z.string().min(1, { message: 'Kategori Adı gereklidir.' }),
        description: z.string().min(1, { message: 'Kategori Açıklaması gereklidir.' }),
        image: z.any().refine((val) => val !== null, { message: 'Resim gereklidir.' })
    })
);

const image = ref(null);
const categoryForm = ref({
    name: '',
    description: '', // Added description field
    image: null
});
const router = useRouter();

const onImageUpload = (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    categoryForm.value.image = file;
    reader.onload = (e) => {
        image.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = () => {
    categoryForm.value.image = null;
    image.value = null;
};

const onFormSubmit = ({ valid }) => {
    if (!valid) return;
    createCategory();
};

const createCategory = async () => {
    try {
        const result = await categoryService.createCategory(categoryForm.value);
        if (result.status !== 200) {
            throw new Error('Kategori eklenirken bir hata oluştu');
        }
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kategori başarıyla eklendi', life: 3000 });
        await router.push('/categories/list');
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Kategori eklenirken bir hata oluştu', life: 3000 });
    }
};
</script>

<style scoped>
.image-upload-container {
    position: relative;
    width: 100%;
    height: 200px;
}

.image-upload-delete-button {
    position: absolute;
    top: 10px;
    right: 10px;
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
