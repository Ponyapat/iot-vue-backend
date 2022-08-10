<template lang="">
  <div>
    <title-bar :title-stack="titleStack" />
    <card-component
      :icon="mdiMonitorCellphone"
      title="ผู้ใช้งาน"
      has-table
      addlink="/user/add"
    >
      <!-- <UserTable /> -->
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
// import UserTable from '@/components/UserTable.vue';

const titleStack = ref(["Admin", "ผู้ใช้"]);
</script>
