<template>
    <div class="card w-full">
        <div class="page-title">Kayıtlı Ürünler</div>
        <div class="w-full mt-4">
            <!-- DataTable to display products -->
            <DataTable
                :value="products"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20]"
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} - {last} of {totalRecords}"
                responsiveLayout="scroll"
            >
                <!-- Image Column -->
                <Column header="Resim">
                    <template #body="{ data }">
                        <img :src="imagePath + data.image" alt="Product Image" class="product-image" v-if="data.image" />
                        <span v-else>Resim Yok</span>
                    </template>
                </Column>

                <!-- Name Column -->
                <Column field="name" header="Ürün Adı" :sortable="true"></Column>

                <!-- Description Column -->
                <Column field="description" header="Açıklama" :sortable="true"></Column>

                <!-- Price Column -->
                <Column field="price" header="Fiyat" :sortable="true">
                    <template #body="{ data }">
                        {{ formatCurrency(data.price) }}
                    </template>
                </Column>

                <!-- Category Column -->
                <Column field="categoryName" header="Kategori" :sortable="true"></Column>
                <Column header="İşlemler">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-button-text" @click="editProduct(data.id)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" @click="deleteProduct(data.id)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import productService from '@/service/ProductService'; // Assuming you have a service for product operations
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import {  useRouter } from 'vue-router';
import { baseURL } from "@/api/axiosInstance";

const toast = useToast();
const products = ref([]);
const imagePath = baseURL + 'images/';
const router = useRouter();

// Fetch products on component mount
onMounted(async () => {
    try {
        const result = await productService.getProducts();
        products.value = result.data;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Ürünler yüklenirken bir hata oluştu', life: 3000 });
    }
});

// Format price as currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
};

// Edit product action
const editProduct = (productId) => {
    router.push(`/products/edit/${ productId}`);
};

// Confirm delete product action
const deleteProduct = async (productId) => {
    const confirm = window.confirm('Ürünü silmek istediğinize emin misiniz?');
    if (confirm) {
        try {
            const result = await productService.deleteProduct(productId);
            if (result.status === 200) {
                toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün başarıyla silindi', life: 3000 });
                products.value = products.value.filter((p) => p.id !== productId);
            } else {
                throw new Error('Ürün silinirken bir hata oluştu');
            }
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Hata', detail: 'Ürün silinirken bir hata oluştu', life: 3000 });
        }
    }

};
</script>

<style scoped>
/* Add custom styles for the product image */
.product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}
</style>
