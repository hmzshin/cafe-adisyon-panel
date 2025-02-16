<template>
    <div class="card w-full">
        <div class="page-title">Masa Tanımlama</div>
        <div class="w-full mt-4">
            <Form v-slot="$form" :initialValues="tableForm" :resolver="resolver" :validateOn @submit="onFormSubmit" class="flex flex-col gap-4">
                <div class="w-full flex flex-wrap gap-4">
                    <!-- Table Name Field -->
                    <FormField as="section" name="name" initialValue="" class="w-[49%] py-2">
                        <label for="name" class="block mb-2 font-medium">Masa Adı</label>
                        <InputText id="name" v-model="tableForm.name" class="w-full" type="text" placeholder="Masa Adı" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error.message }}</Message>
                    </FormField>

                    <!-- Table Capacity Field -->
                    <FormField as="section" name="capacity" initialValue="" class="w-[49%] py-2">
                        <label for="capacity" class="block mb-2 font-medium">Kapasite</label>
                        <InputNumber id="capacity" v-model="tableForm.capacity" class="w-full" placeholder="Masa Kapasitesi" :min="1" />
                        <Message v-if="$form.capacity?.invalid" severity="error" size="small" variant="simple">{{ $form.capacity.error.message }}</Message>
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
import tableService from '@/service/TableService'; // Assuming you have a service for table operations
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { z } from 'zod';

const toast = useToast();

// Define the validation schema for the table form
const resolver = zodResolver(
    z.object({
        name: z.string().min(1, { message: 'Masa Adı gereklidir.' }),
        capacity: z.number().min(1, { message: 'Masa Kapasitesi en az 1 olmalıdır.' })
    })
);

// Reactive form data
const tableForm = ref({
    name: '',
    capacity: null
});

// Handle form submission
const onFormSubmit = async ({ valid }) => {
    if (!valid) return;

    try {
        // Send the table data to the API
        const result = await tableService.createTable(tableForm.value);
        if (result.status !== 200) {
            throw new Error('Masa eklenirken bir hata oluştu');
        }

        // Show success message
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Masa başarıyla eklendi', life: 3000 });

        // Reset the form after successful submission
        tableForm.value = { name: '', capacity: null };
    } catch (error) {
        // Show error message
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Masa eklenirken bir hata oluştu', life: 3000 });
    }
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
