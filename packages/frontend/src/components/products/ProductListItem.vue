<script setup lang="ts">
import Icon from '@/components/common/Icon.vue';
import CategoryBadge from '@/components/common/CategoryBadge.vue';
import type { Product } from '@/types/models';
import { computed } from 'vue';
import { useProductStore } from '@/stores/product.store';

const props = defineProps<{
  product: Product;
}>();

const productStore = useProductStore();

const getProductStatus = computed<string>(() => {
  if (props.product.quantity <= 0) {
    return 'Out of stock';
  } else if (props.product.quantity <= 5) {
    return 'Low stock';
  } else {
    return 'In stock';
  }
});

const getProductStatusClass = computed<string>(() => {
  if (props.product.quantity <= 0) {
    return 'sold-out';
  } else if (props.product.quantity <= 5) {
    return 'low-stock';
  } else {
    return 'in-stock';
  }
});

const openProductDetails = () => {
  productStore.openProductDetail(props.product.id);
};

</script>

<template>
  <div class="product-item">
    <div class="product-img">
      <template v-if="props.product.imageUrl">
        <img :src="props.product.imageUrl"/>
      </template>
      <div v-else class="product-image-placeholder">
        <Icon name="ImageOff" :size="50" :stroke-width="1" />
      </div>
    </div>
    <div class="product-infos" v-on:click="openProductDetails">
      <h3 class="main-info">{{ props.product.name }}</h3>
      <div class="product-details">
        <div class="inner-details">
          <h4 class="sm-col">HGS2354</h4>
          <div class="lg-col">
            <CategoryBadge :categoryId="props.product.categoryId" />
          </div>
        </div>
        <div class="inner-details">
          <div class="lg-col" :class="getProductStatusClass">
            <h4>{{ getProductStatus }}</h4>
          </div>
          <h3 class="sm-col highligth-info">{{ props.product.price }} €</h3>
        </div>
      </div>
    </div>
  </div>
</template>