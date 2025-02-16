<script setup>
import categoryService from '@/service/CategoryService';
import productService from '@/service/ProductService';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { z } from 'zod';

const toast = useToast();

const resolver = zodResolver(
    z.object({
        name: z.string().min(1, { message: 'Ürün Adı gereklidir.' }),
        description: z.string().min(1, { message: 'Ürün Açıklaması gereklidir.' }),
        price: z.number().min(1, { message: 'Fiyat gereklidir.' })
    })
);

const categoryOptions = ref([]);
const image = ref(null);

const onImageUpload = (event) => {
    const file = event.files[0];
    const reader = new FileReader();
    productForm.value.image = file;
    reader.onload = (e) => {
        image.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const removeImage = () => {
    productForm.value.image = null;
    image.value = null;
};
const productForm = ref({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    image: null
});
const router = useRouter();
const onFormSubmit = ({ valid }) => {
    if (!valid) return;
    console.log(productForm.value);
    createProduct();
};

onMounted(() => {
    getCategoryList();
});

const getCategoryList = async () => {
    try {
        const result = await categoryService.getCategoryList();
        categoryOptions.value = result.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Kategoriler alınırken bir hata oluştu', life: 3000 });
    }
};

const createProduct = async () => {
    try {
        const result = await productService.createProduct(productForm.value);
        if (result.status !== 200) {
            throw new Error('Ürün eklenirken bir hata oluştu');
        }
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün başarıyla eklendi', life: 3000 });
        await router.push('/products/list');
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Ürün eklenirken bir hata oluştu', life: 3000 });
    }
};
</script>

<template>
    <div class="card w-full">
        <div class="page-title">Ürün Tanımlama</div>
        <div class="w-full mt-4">
            <Form v-slot="$form" :initialValues="productForm" :resolver="resolver" :validateOn @submit="onFormSubmit" class="flex flex-col gap-4">
                <div class="w-full flex flex-wrap gap-4">
                    <FormField as="section" name="name" initialValue="" class="w-[49%] py-2">
                        <label for="urunAdi" class="block mb-2 font-medium">Kategori Adı</label>
                        <InputText v-model="productForm.name" id="urunAdi" class="w-full" type="text" placeholder="Ürün Adı" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error.message }}
                        </Message>
                    </FormField>

                    <FormField as="section" name="description" initialValue="" class="w-[49%] py-2">
                        <label for="urunAciklama" class="block mb-2 font-medium">Ürün Açıklaması</label>
                        <InputText v-model="productForm.description" class="w-full" type="text" placeholder="Ürün Açıklaması" />
                        <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.description.error.message }}
                        </Message>
                    </FormField>

                    <FormField as="section" name="price" initialValue="0" class="w-[49%] py-2">
                        <label for="urunFiyati" class="block mb-2 font-medium">Ürün Fiyatı</label>
                        <InputNumber v-model="productForm.price" class="w-full" showButtons mode="currency" locale="tr-Tr" currency="TRY" placeholder="Ürün fiyatı" />
                        <Message v-if="$form.price?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.price.error.message }}
                        </Message>
                    </FormField>

                    <FormField as="section" name="categoryId" initialValue="" class="w-[49%] py-2">
                        <label for="kategori" class="block mb-2 font-medium">Kategori</label>
                        <Select v-model="productForm.categoryId" class="w-full" :options="categoryOptions" option-label="name" option-value="id" placeholder="Kategori" />
                        <Message v-if="$form.categoryId?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.categoryId.error.message }}
                        </Message>
                    </FormField>

                    <FormField as="section" name="image" initialValue="" class="w-[49%] py-2 flex items-start flex-col">
                        <label for="image" class="block mb-2 font-medium">Ürün Resmi</label>
                        <div v-if="image" class="image-upload-container">
                            <img :src="image" alt="Selected Image" class="w-full h-full object-fill rounded-lg" />
                            <Button icon="pi pi-trash" class="image-upload-delete-button p-button-danger" @click="removeImage" />
                        </div>
                        <FileUpload
                            v-else
                            mode="basic"
                            id="image"
                            name="image"
                            url="./upload.php"
                            accept="image/*"
                            :maxFileSize="1000000"
                            :file-limit="1"
                            @select="onImageUpload"
                            chooseLabel="Seç"
                            :auto="false"
                            uploadLabel="Yükle"
                            cancelLabel="İptal"
                        />

                        <Message v-if="$form.image?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.image.error.message }}
                        </Message>
                    </FormField>

                    <div class="w-full flex justify-end mt-4">
                        <Button type="submit" label="Kaydet" class="w-60" />
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>
