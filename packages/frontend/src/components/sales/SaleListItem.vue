<script setup lang="ts">
import type { Sale } from '@/types/models';
import { useSalesStore } from '../../stores/sales.store';
import { getFormatedDate } from '@/utils/dateUtils'

const props = defineProps<{
  sale: Sale;
}>();

const saleStore = useSalesStore();

const openSaleDetails = () => {
  saleStore.openSaleDetail(props.sale.id);
};

</script>

<template>
  <div class="sale-infos" v-on:click="openSaleDetails">
    <h3 class="main-info">{{ props.sale.buyerName }}</h3>
    <div class="sale-details">
      <div class="inner-details">
        <div class="md-col" :class="props.sale.status">
          <h4>{{ saleStore.statusLabels[props.sale.status] }}</h4>
        </div>
        <h4 class="md-col">{{ getFormatedDate(props.sale.date) }}</h4>
      </div>
      <div class="inner-details">
        <h4 class="xl-col">{{ props.sale.buyerAddress }}</h4>
        <h3 class="sm-col highligth-info">{{ props.sale.price }} €</h3>
      </div>
    </div>
  </div>
</template>