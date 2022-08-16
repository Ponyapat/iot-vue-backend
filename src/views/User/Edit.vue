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
// import CheckRadioPicker from '@/components/CheckRadioPicker.vue'

// const router = useRouter()

const titleStack = ref(['Admin', 'เพิ่มข้อมูลผู้ใช้'])

const selectOptions = [
  { role: 'admin', label: 'Admin' },
  { role: 'super_admin', label: 'Super Admin' }
]

const form = reactive({
  id: '',
  name: '',
  email: '',
  username: '',
  password: '',
  role: selectOptions[0]
})

onMounted(() => {
  // ดึงค่า user id นั้นๆมา
})

const submit = () => {
  console.log('add data user')
  console.log(form)
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
      <field label="E-mail" placeholder="กรอก E-mail ผู้ใช้">
        <control
          v-model="form.email"
          type="text"
          placeholder="E-mail"
        />
      </field>
      <field label="Username" placeholder="กรอก Username ผู้ใช้">
        <control
          v-model="form.username"
          type="text"
          placeholder="Username"
        />
      </field>
      <field label="Password" placeholder="กรอก Username ผู้ใช้">
        <control
          v-model="form.username"
          type="text"
          placeholder="Password"
        />
      </field>
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
