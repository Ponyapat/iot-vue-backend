<script setup>
// import { useRouter } from 'vue-router'
// import { useMainStore } from '@/stores/main'
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
import Swal from 'sweetalert2';
// import CheckRadioPicker from '@/components/CheckRadioPicker.vue'

// const router = useRouter()

const titleStack = ref(['Admin', 'เพิ่มข้อมูลผู้ใช้'])

const selectOptions = [
  { role: 'admin', label: 'Admin' },
  { role: 'super_admin', label: 'Super Admin' }
]
const url = window.location.href;
const id = url.split("/")[5];

onMounted(async () => {
  const token = localStorage.getItem("tkfw");
  await axios
    .get(import.meta.env.VITE_API_ENDPOINT + "/api/users/"+id+"/profile",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then(response => {
      console.log('DEBUG: ', response)
      form.name = response.data.user.name
      form.username = response.data.user.username
      form.email = response.data.user.email
    })
})

const form = reactive({
  id: '',
  name: '',
  email: '',
  username: '',
  password: '',
  role: selectOptions[0]
})

const submit = () => {
  console.log('update data user')
  const token = localStorage.getItem("tkfw");
  axios
    .put(
      import.meta.env.VITE_API_ENDPOINT + "/api/users/"+id+"/profile",
      {
        name: form.name,
        email: form.email,
        username: form.username,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    ).then((data) => {
      console.log('DEBUG data', data)
      if (data.data.status == 204 || data.data.status == 200) {
        console.log(data.data.status);
        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูล Admin สำเร็จ",
          timer: 2500,
          showConfirmButton: 1,
        });
        router.push("/users");
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถแก้ไขข้อมูล",
          timer: 3000,
          showConfirmButton: 1,
        });
        return false;
      }
    }).catch(err => {
      console.log(err)
    })
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
      <field label="Name" placeholder="กรอก Name ผู้ใช้">
        <control
          v-model="form.name"
          type="text"
          placeholder="Name"
        />
      </field>
      <field label="Username" placeholder="กรอก Username ผู้ใช้">
        <control
          v-model="form.username"
          type="text"
          placeholder="Username"
        />
      </field>
      <field label="E-mail" placeholder="กรอก E-mail ผู้ใช้">
        <control
          v-model="form.email"
          type="text"
          placeholder="E-mail"
        />
      </field>
      <!-- <field label="Password" placeholder="กรอก Username ผู้ใช้">
        <control
          v-model="form.username"
          type="text"
          placeholder="Password"
        />
      </field> -->
      <field label="กำหนดสิทธ์">
        <control
          v-model="form.role"
          :options="selectOptions"
        />
      </field>

      <divider />

      <jb-buttons>
        <jb-button type="submit" color="info" label="อัพเดท" />
        <!-- <jb-button type="reset" color="info" outline label="รีเซต" /> -->
      </jb-buttons>
    </card-component>
  </main-section>

  <bottom-other-pages-section />
</template>
