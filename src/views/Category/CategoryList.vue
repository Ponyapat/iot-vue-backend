<template>
  <div>
  <title-bar class="p-4" :title-stack="titleStack" />
  <card-component
    :icon="mdiMonitorCellphone"
    title="Category"
    has-table
    :addlink="Addlink"
  >
    <!-- table -->
    <CategoryTable/>
  </card-component>
</div>
</template>

<script setup>
import { ref , onBeforeMount } from "vue";
import { mdiMonitorCellphone } from "@mdi/js";
import TitleBar from "@/components/TitleBar.vue";
import CategoryTable from "@/components/CategoryTable.vue";
import CardComponent from "@/components/CardComponent.vue";

const titleStack = ref(["Master Categories"]);
const Addlink = ref(null);

onBeforeMount(() => {
  if(ck_pms("create","sensor-mgr")){
    Addlink.value = "/category-list/add"
  }
});

</script>
