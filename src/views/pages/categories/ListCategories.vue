<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import categoryService from '@/service/CategoryService';
import { imagePath } from '@/api/axiosInstance';

const toast = useToast();
const router = useRouter();
const categories = ref([]);

// Fetch all categories when the component is mounted
onMounted(async () => {
    await getCategoryList();
});

// Edit category (navigate to edit page or open a dialog)
const editCategory = (categoryId) => {
    router.push(`/categories/edit/${categoryId}`);
};

// Delete category
const deleteCategory = async (categoryId) => {
    try {
        const response = await categoryService.deleteCategory(categoryId);
        if (response.status === 200) {
            // Remove the deleted category from the list
            categories.value = categories.value.filter((category) => category.id !== categoryId);
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kategori başarıyla silindi', life: 3000 });
        } else {
            throw new Error('Kategori silinirken bir hata oluştu');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Kategori silinirken bir hata oluştu', life: 3000 });
    }
};

const getCategoryList = async () => {
    try {
        const response = await categoryService.getCategoryList();
        if (response.status === 200) {
            categories.value = response.data;
        } else {
            throw new Error('Kategoriler alınamadı');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Kategoriler alınamadı', life: 3000 });
    }
};
</script>

<template>
    <div class="card w-full">
        <div class="page-title">Kategori Listesi</div>
        <div class="w-full mt-4">
            <DataTable
                :value="categories"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20, 50]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} - {last} / {totalRecords} Kategoriler"
                responsiveLayout="scroll"
            >
                <!-- Category ID Column -->
                <Column field="id" header="Kategori ID" :sortable="true"></Column>

                <Column header="Resim">
                    <template #body="{ data }">
                        <img v-if="data.image" :src="imagePath + data.image" alt="Category Image" class="w-16 h-16 object-cover rounded-lg" />
                        <span v-else>-</span>
                    </template>
                </Column>

                <!-- Category Name Column -->
                <Column field="name" header="Kategori Adı" :sortable="true"></Column>

                <!-- Category Description Column -->
                <Column field="description" header="Açıklama" :sortable="true">
                    <template #body="{ data }">
                        {{ data.description || '-' }}
                    </template>
                </Column>

                <!-- Category Image Column -->

                <!-- Actions Column -->
                <Column header="İşlemler">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-button-text" @click="editCategory(data.id)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" @click="deleteCategory(data.id)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped>
/* Add custom styles if needed */
</style>
