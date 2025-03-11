<script setup>
import { computed, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/product.category.store';

const props = defineProps({
  categoryId: {
    type: String | null,
    default: null
  }
});

const categoryStore = useCategoryStore();

const category = computed(() => {
  if (!props.categoryId) return null;
  return categoryStore.categories.find(cat => cat.id === props.categoryId);
});

const categoryName = computed(() => {
  return category.value ? category.value.name : 'Sans catégorie';
});

onMounted(async () => {
  if (categoryStore.categories.length === 0) {
    await categoryStore.fetchCategories();
  }
});
</script>

<template>
  <span 
    class="category-badge" 
    :class="{ 'no-category': !category }"
    :title="category?.description"
  >
    {{ categoryName }}
  </span>
</template>