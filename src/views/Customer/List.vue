<template>
  <div>
    <title-bar :title-stack="titleStack" />
  </div>
</template>
<script setup>
import { ref } from "vue"
import titleBar from "@/components/TitleBar.vue";

const titleStack = ref(["Customers", "ลูกค้า"])
</script>
