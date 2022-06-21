<template>
  <div>
      <div><input type="text" class="bg-green-400" name="username" v-model="states.account.username" /></div>
      <div><input type="text" class="bg-green-400" name="password" v-model="states.account.password" /></div>
      <button class="bg-red-200" @click="handleclick">submit</button>
      <div>debug : {{states.account}}</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const emit = defineEmits(['eventlogin'])

let states = reactive({
    account : { username:"11212",password:"123123" }
})

const handleclick = () => {
  emit('eventlogin' , states.account.username , states.account.password)
}



</script>

<style lang="scss" scoped></style>
