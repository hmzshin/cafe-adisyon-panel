<script setup>
import { onMounted, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import tableService from '@/service/TableService';

const toast = useToast();
const router = useRouter();

import { computed } from 'vue';

// Get tableId from the store
const tableId = computed(() => router.currentRoute.value.params.id);

// Reactive form data
const tableForm = ref({
    name: '',
    capacity: null
});

// Validation schema (same as the create form)
const resolver = zodResolver(
    z.object({
        name: z.string().min(1, { message: 'Masa Adı gereklidir.' }),
        capacity: z.number().min(1, { message: 'Masa Kapasitesi en az 1 olmalıdır.' })
    })
);

watch(
    tableForm,
    (newVal) => {
        // Perform validation logic here
        const validationResult = resolver(newVal);
        if (!validationResult.success) {
            // Handle validation errors
            console.log(validationResult.error);
        }
    },
    { deep: true }
);

// Fetch table details when the component is mounted
onMounted(async () => {
    try {
        console.log('tableId.value', tableId.value);
        const response = await tableService.getTable(tableId.value);
        if (response.status === 200) {
            tableForm.value = {
                name: response.data.name,
                capacity: parseInt(response.data.capacity || 0)
            };
        } else {
            throw new Error('Masa bilgileri alınamadı');
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Masa bilgileri alınamadı', life: 3000 });
    }
});

// Handle form submission (update table)
const onFormSubmit = async ({ valid }) => {
    if (!valid) return;

    try {
        // Send the updated table data to the API
        const result = await tableService.updateTable(tableId.value, tableForm.value);
        if (result.status !== 200) {
            throw new Error('Masa güncellenirken bir hata oluştu');
        }

        // Show success message
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Masa başarıyla güncellendi', life: 3000 });
        await router.push('/tables/list');
        // Optionally, redirect or reset the form
        // tableForm.value = { name: '', capacity: null };
    } catch (error) {
        // Show error message
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Masa güncellenirken bir hata oluştu', life: 3000 });
    }
};
</script>

<template>
    <div class="card w-full">
        <div class="page-title">Masa Düzenleme</div>
        <div class="w-full mt-4">
            <Form v-slot="$form" :initialValues="tableForm" :resolver="resolver" :validateOn @submit="onFormSubmit" class="flex flex-col gap-4">
                <div class="w-full flex flex-wrap gap-4">
                    <!-- Table Name Field -->
                    <FormField as="section" name="name" initialValue="" class="w-[49%] py-2">
                        <label for="name" class="block mb-2 font-medium">Masa Adı</label>
                        <InputText id="name" v-model="tableForm.name" class="w-full" type="text" placeholder="Masa Adı" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.name.error.message }}
                        </Message>
                    </FormField>

                    <!-- Table Capacity Field -->
                    <FormField as="section" name="capacity" initialValue="" class="w-[49%] py-2">
                        <label for="capacity" class="block mb-2 font-medium">Kapasite</label>
                        <InputNumber id="capacity" v-model="tableForm.capacity" class="w-full" placeholder="Masa Kapasitesi" :min="1" />
                        <Message v-if="$form.capacity?.invalid" severity="error" size="small" variant="simple">
                            {{ $form.capacity.error.message }}
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

<style scoped>
/* Add custom styles if needed */
</style>
