<template lang="">
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="ภูมิศาสตร์ ที่ดิน"
      has-table
    >
      <GeographyTable />
    </card-component>
  </div>
</template>

<script setup>
import { mdiMonitorCellphone, mdiAccountMultiple, mdiTableBorder, mdiTableOff } from '@mdi/js'
import { computed, ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import TitleBar from "@/components/TitleBar.vue";
import HeroBar from "@/components/HeroBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import GeographyTable from '@/components/ListData/GeographyTable.vue'

const titleStack = ref(["Admin", "ภูมิศาสตร์(ที่ดิน)"]);



</script>
