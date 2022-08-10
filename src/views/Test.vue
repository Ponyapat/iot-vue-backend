<template lang="">
  <div>
    <div>TEST</div>
    <div>----test={{test}}----</div>
    <div>----test2={{test2}}----</div>
    <div>----testh1={{testh1}}----</div>
    <div>----testh2={{testh2}}----</div>
    <div>----{{states.account}}----</div>
    <div>----{{myVar}}----</div>
    <div>currentPageHuman----{{currentPageHuman}}----</div>
    <button class="bg-red-400" @click="onClick1">click1</button><br>
    <button class="bg-red-400" @click="onClick2">click2</button><br>
    <button class="bg-red-400" @click="clear">clear</button>
    <h1 ref="testh1">12345</h1>
    <hr>
    <Login title="senddd" :icon="states.account"></Login>
    <LoginForm @eventlogin="fnLogin" />
  
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted , computed } from 'vue'
  import Login from "@/components/TestLogin.vue"
  import LoginForm from "@/components/TestLoginForm.vue"
  import Icon from '@/components/Icon.vue'
   
  const myVar = import.meta.env.VITE_API_ENDPOINT;

  let test = 1
  let test2 = ref("nongsonic")
  const testh1 = ref(null);
  const testh2 = ref(null);
  const states = reactive({
    account : {username:"admin",password:"1234"}
  })

  const currentPage = ref(0);

  onMounted(()=>{
    console.log("onMounted");
  })

  const onClick1 = ()=> {
    test++
    console.log(test)
    testh2.value ++
    //this.$refs.testh1.focus()
    //console.log(testh1.value.textContent)
    //console.log(testh2.value.textContent)
  }

  const onClick2 = ()=> {
    test++
    test2.value += test2.value = "5555"
    
    console.log(test2.value)
    console.log(test)
  }

  const clear = ()=> {
    states.account.username = ""
    states.account.password = ""
    console.log(states.account)
  }

  const fnLogin = (username,password)=> {
    alert ("hey"+" "+username+ " " + password)
  }
  
  const currentPageHuman = computed(() => testh2.value)
</script>

<style lang="">
  
</style>