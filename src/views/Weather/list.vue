<template lang="">
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="ภูมิอากาศ"
      has-table
    >
      <WeatherTable />
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
import WeatherTable from '@/components/ListData/WeatherTable.vue'

const titleStack = ref(["Admin", "ภูมิอากาศ"]);



</script>
