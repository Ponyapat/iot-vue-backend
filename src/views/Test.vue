<template lang="">
  <div>
    <div>TEST</div>
    <div>----{{test}}----</div>
    <div>----{{test2}}----</div>
    <div>----{{states.account}}----</div>
    <button class="bg-red-400" @click="onClick1">click1</button><br>
    <button class="bg-red-400" @click="onClick2">click2</button><br>
    <button class="bg-red-400" @click="clear">clear</button>
    <hr>
    <Login title="senddd" :icon="states.account"></Login>
    <LoginForm @eventlogin="fnLogin" />
  
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import Login from "@/components/TestLogin.vue"
  import LoginForm from "@/components/TestLoginForm.vue"
  import Icon from '@/components/Icon.vue'
  
  let test = 1
  let test2 = ref("nongsonic")
  const states = reactive({
    account : {username:"admin",password:"1234"}
  })

  onMounted(()=>{
    console.log("onMounted");
  })

  const onClick1 = ()=> {
    test++
    console.log(test)
  }

  const onClick2 = ()=> {
    test++
    test2.value += test2.value = "5555"
   
    console.log(test2.value)
  }

  const clear = ()=> {
    states.account.username = ""
    states.account.password = ""
    console.log(states.account)
  }

  const fnLogin = (username,password)=> {
    alert ("hey"+" "+username+ " " + password)
  }
  

</script>

<style lang="">
  
</style>