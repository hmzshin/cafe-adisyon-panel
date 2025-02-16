<template>
    <div class="card w-full">
        <div class="page-title">Masa Listesi</div>
        <div class="w-full mt-4">
            <DataTable
                :value="tableList"
                :paginator="true"
                :rows="10"
                :rowsPerPageOptions="[5, 10, 20, 50]"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="{first} - {last} / {totalRecords} Masalar"
                responsiveLayout="scroll"
            >
                <!-- Table ID Column -->
                <Column field="id" header="Masa ID" :sortable="true"></Column>

                <!-- Table Name Column -->
                <Column field="name" header="Masa Adı" :sortable="true"></Column>

                <!-- Table Capacity Column -->
                <Column field="capacity" header="Kapasite" :sortable="true">
                    <template #body="{ data }">
                        {{ data.capacity }}
                    </template>
                </Column>

                <!-- Actions Column (Optional) -->
                <Column header="İşlemler">
                    <template #body="{ data }">
                        <Button
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-success p-button-text"
                            @click="editTable(data.id)"
                        />
                        <Button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger p-button-text"
                            @click="deleteTable(data.id)"
                        />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

import tableService from '@/service/TableService';
import { useStore } from "@/store/store.js"; // Your table service for API calls

const toast = useToast();
const tableList = ref([]); // Holds the list of tableList
const store = useStore();
const router = useRouter();

// Fetch all tableList when the component is mounted
onMounted(async () => {
    try {
        const response = await tableService.getTableList();
        if (response.status === 200) {
            tableList.value = response.data;
            console.log(response.data);
            console.log(tableList.value);
        } else {
            throw new Error('Masalar alınamadı');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Masalar alınamadı', life: 3000 });
    }
});

const editTable = (tableId) => {
    store.setTableID(tableId);
    router.push(`/tables/edit/${tableId}`);
};

// Delete table
const deleteTable = async (tableId) => {
    try {
        const response = await tableService.deleteTable(tableId);
        if (response.status === 200) {
            // Remove the deleted table from the list
            tableList.value = tableList.value.filter((table) => table.id !== tableId);
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Masa başarıyla silindi', life: 3000 });
        } else {
            throw new Error('Masa silinirken bir hata oluştu');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Masa silinirken bir hata oluştu', life: 3000 });
    }
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
