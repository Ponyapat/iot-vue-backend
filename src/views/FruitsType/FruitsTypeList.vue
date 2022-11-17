<template>
  <title-bar :title-stack="titleStack" />
  <card-component
      :icon="mdiFruitWatermelon"
      title="ประเภทพืชพันธุ์ผลไม้"
      has-table
      addlink="/fruits-type/add"
    >
    <FruitsTypeTable />
    </card-component>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import FruitsTypeTable from '@/components/FruitsTypeTable.vue'
import { mdiFruitWatermelon } from '@mdi/js'
const titleStack = ref(["ปรเภทพืชพันธุ์ผลไม้", "ผู้ดูแลระบบ"]);
</script>

<style>

</style>
