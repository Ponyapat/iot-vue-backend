<template>
  <title-bar :title-stack="titleStack" />
  <card-component
      :icon="mdiFruitWatermelon"
      title="ประเภทพืชพรรณผลไม้"
      has-table
      :addlink="Addlink"
    >
    <FruitsTypeTable />
    </card-component>
</template>

<script setup>
import { computed, ref , onMounted , onBeforeMount } from "vue";
import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import FruitsTypeTable from '@/components/FruitsTypeTable.vue'
import { mdiFruitWatermelon } from '@mdi/js'
const titleStack = ref(["ประเภทพืชพรรณผลไม้"]);
const Addlink = ref(null);

onBeforeMount(() => {
  if(ck_pms("create","breed-categorise")){
    Addlink.value = "/fruits-type/add"
  }
});

</script>

<style>

</style>
