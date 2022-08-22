<script setup>
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import TitleBar from '@/components/TitleBar.vue'
import { reactive, ref, onMounted } from 'vue'
import MainSection from '@/components/MainSection.vue'
import CardComponent from '@/components/CardComponent.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import { mdiBallot } from '@mdi/js'
import BottomOtherPagesSection from '@/components/BottomOtherPagesSection.vue'
import Divider from '@/components/Divider.vue'
import JbButton from '@/components/JbButton.vue'
import JbButtons from '@/components/JbButtons.vue'
import axios from 'axios'
import Swal from 'sweetalert2'
// import CheckRadioPicker from '@/components/CheckRadioPicker.vue'

const router = useRouter()
const token = localStorage.getItem("tkfw");

const titleStack = ref(['Admin', 'เพิ่มข้อมูลผู้ใช้'])

// const selectOptions = [
//   { role: 'admin', label: 'Admin' },
//   { role: 'super_admin', label: 'Super Admin' }
// ]
const states = reactive({
  roles: "",
});

onMounted(() => {
  clearData()
  fetchRole()
})

const form = reactive({
  name: '',
  email: '',
  username: '',
  password: '',
  role_id: states.roles[1]
})

const clearData = () => {
  console.log('clearData')
  form.name = ''
  form.email = ''
  form.username = ''
  form.password = ''
  form.role_id = states.roles[1]
}

const fetchRole = () => {
  console.log('fetch role')
  axios
    .get(import.meta.env.VITE_API_ENDPOINT+"/api/role", {
      headers: {
        Authorization: "Bearer " + token,
      }
    })
    .then((data) => {
      // console.log('DEBUG ROLE: ', data)
      states.roles = data.data.data
      // set role default เป็น admin
      form.role = states.roles[1]
    })
}

const submit = () => {
  console.log('add data user')
  console.log(form)
  // axios
  //   .post(import.meta.env.VITE_API_ENDPOINT+"/api/auth/register", {
  //     name: form.name,
  //     username: form.username,
  //     email: form.email,
  //     password: form.password,
  //   })
  //   .then((r) => {
  //     console.log("success");
  //     Swal.fire({
  //       icon: "success",
  //       title: "เพิ่ม Admin สำเร็จ",
  //       showConfirmButton: 1,
  //       timer: 3000,
  //     });
  //     router.push("/users");
  //   })
  //   .catch((error) => {
  //     console.log(error.response.data.message);
  //     if (error.response.data.message == "Error: User not registration!"){
  //       Swal.fire({
  //         icon: "warning",
  //         title: "มีผู้ใช้งานในระบบนี้แล้ว",
  //         showConfirmButton: 1
  //       });
  //     }
  //   });
}

</script>

<template>
  <title-bar :title-stack="titleStack" />
  <main-section>
    <card-component
      title="กรอกข้อมูลผู้ใช้งาน"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <field label="Name" placeholder="กรอก Name ผู้ใช้" :require="true">
        <control
          v-model="form.name"
          type="text"
          placeholder="Name"
        />
      </field>
      <field label="Username" placeholder="กรอก Username ผู้ใช้" :require="true">
        <control
          v-model="form.username"
          type="text"
          placeholder="Username"
        />
      </field>
      <field label="E-mail" placeholder="กรอก E-mail ผู้ใช้" :require="true">
        <control
          v-model="form.email"
          type="email"
          placeholder="E-mail"
        />
      </field>
      <field label="Password" placeholder="กรอก Password" :require="true">
        <control
          v-model="form.password"
          type="password"
          autocomplete="none"
          placeholder="Password"
        />
      </field>
      <field label="กำหนดสิทธ์">
        <control
          v-model="form.role_id"
          :options="states.roles"
        />
      </field>

      <divider />

      <jb-buttons>
        <jb-button type="submit" color="info" label="เพิ่ม" />
        <jb-button type="reset" color="info" outline label="รีเซต" />
      </jb-buttons>
    </card-component>
  </main-section>

  <bottom-other-pages-section />
</template>
