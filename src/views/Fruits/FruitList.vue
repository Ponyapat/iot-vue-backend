<template>
  <title-bar :title-stack="titleStack"  />
  <card-component
      :icon="mdiFruitCherries"
      title="พืชพรรณผลไม้"
      has-table
      :addlink="Addlink"
    >
    <FruitsTable />
    </card-component>
</template>

<script setup>
import { computed, ref, onMounted , onBeforeMount } from "vue";
import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import FruitsTable from '@/components/FruitsTable.vue'
import { mdiFruitCherries } from '@mdi/js'
const titleStack = ref(["พืชพรรณผลไม้"]);
const Addlink = ref(null);
onBeforeMount(() => {
  if(ck_pms("create","breed")){
    Addlink.value = "/fruits/add"
  }
});
</script>

<style>

</style>
