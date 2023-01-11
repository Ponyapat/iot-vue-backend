<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

let url = new URL(window.location.href);
const id = url.searchParams.get("customer_edit");
let type_form = ref('');
const router = useRouter();

let type_list = reactive([
  { id: 1, type: 'B2C' }, { id: 2, type: 'B2B' },
  { id: 3, type: 'Dealer' }, { id: 4, type: 'Seller' },
  { id: 5, type: 'Dropship' }]);

let product_list = reactive([
  { id: 1, product: 'XS-3CH' }, { id: 2, product: 'S-1CH (A)' }, { id: 3, product: 'S-1CH (B)' }, { id: 4, product: 'S-3CH (A)' }, { id: 5, product: 'S-3CH (B)' }, { id: 6, product: 'S-3CH++' },
  { id: 7, product: 'SET A XS-3CH' }, { id: 8, product: 'SET A S-1CH' }, { id: 9, product: 'SET A S-3CH' }, { id: 10, product: 'SET A S-3CH++' },
  { id: 11, product: 'SET B XS-3CH' }, { id: 12, product: 'SET B S-1CH' }, { id: 13, product: 'SET B S-3CH' }, { id: 14, product: 'SET B S-3CH++' },
  { id: 15, product: '2061 (Weather station)' }, { id: 16, product: '2053 (MA+AP)' }, { id: 17, product: '2053 (MA)' }, { id: 18, product: '2053 (AP)' }, { id: 19, product: 'Smart garden A' }, { id: 20, product: 'Smart garden B' }, { id: 21, product: 'Smart Bag' }
]);

let contactby_list = reactive([{ id: 1, contactBy: 'offline' }, { id: 2, contactBy: 'online' }]);
let status_list = reactive([{ id: 1, status: 'ปิดการขาย' }, { id: 2, status: 'กำลังดำเนินการ' }, { id: 3, status: 'สอบถามข้อมูล' }]);

const dataform = reactive({
  name: "",
  contactName: "",
  phone: "",
  address: "",
  type: "",
  detail: "",
  product: "",
  contactBy: "",
  status: "",
  note: ""
});


const phone_number = helpers.regex(/^(\d{3})(\d{3})(\d{4})$/);
const rules = {
  name: { required: helpers.withMessage('กรุณาระบุชื่อลูกค้า', required) },// ชื่อ
  contactName: { required: helpers.withMessage('กรุณาระบุข้อมูลติดต่อ', required) },
  phone: {
    required: helpers.withMessage('กรุณาระบุเบอร์โทรศัพท์มือถือ', required),
    phone_number: helpers.withMessage(() => "เบอร์โทรศัพท์ไม่ถูกต้อง", phone_number)
  },
  // address: { required: helpers.withMessage('กรุณาระบุที่อยู่', required) },
  type: { required: helpers.withMessage('กรุณาระบุประเภท', required) },
  // detail: { required: helpers.withMessage('กรุณาระบุรายละเอียด', required) },
  // product: { required: helpers.withMessage('กรุณาเลือกสินค้า', required) },
  contactBy: { required: helpers.withMessage('กรุณาเลือกช่องทาง', required) },
  status: { required: helpers.withMessage('กรุณาเลือกสถานะ', required) },
}
const v$ = useVuelidate(rules, dataform);

onMounted(() => {
  if (id) {
    type_form.value = 'แก้ไข';
    ApiMain.get("/other-customer/" + id).then((res) => {
      console.log(res);
      dataform.name = res.data.data.name;
      dataform.contactName = res.data.data.contactName;
      dataform.phone = res.data.data.phone;
      dataform.address = res.data.data.address;
      dataform.type = res.data.data.type;
      dataform.detail = res.data.data.detail;
      dataform.product = res.data.data.product;
      dataform.contactBy = res.data.data.contactBy;
      dataform.status = res.data.data.status;
      dataform.note = res.data.data.note;
    }).catch((error) => {
      console.log(error);
    });
  }
  else {
    type_form.value = 'เพิ่ม';

  }
})


const submit = async () => {
  const result = await v$.value.$validate();

  if (id) {
    if (result) {
      ApiMain.put("/other-customer/"+id, {
        name: dataform.name,
        contactName: dataform.contactName,
        phone: dataform.phone,
        address: dataform.address,
        type: dataform.type,
        detail: dataform.detail,
        product: dataform.product,
        contactBy: dataform.contactBy,
        status: dataform.status,
        note: dataform.note
      }).then((data) => {
        if (data.data.status == 204 || data.data.status == 200 || data.data.status == 201) {
          console.log(data.data.status);
          Swal.fire({
            icon: "success",
            title: "เพิ่มข้อมูลสถานะสำเร็จ",
            timer: 2500,
            showConfirmButton: 1,
          });
          router.push("/customers");
        } else {
          Swal.fire({
            icon: "warning",
            title: "ไม่สามารถเพิ่มข้อมูลได้",
            timer: 3000,
            showConfirmButton: 1,
          });
          return false;
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุข้อมูลให้ครบ",
        timer: 3000,
        showConfirmButton: 1,
      });
    }
  } else {
    if (result) {
      ApiMain.post("/other-customer", {
        name: dataform.name,
        contactName: dataform.contactName,
        phone: dataform.phone,
        address: dataform.address,
        type: dataform.type,
        detail: dataform.detail,
        product: dataform.product,
        contactBy: dataform.contactBy,
        status: dataform.status,
        note: dataform.note
      }).then((data) => {
        if (data.data.status == 204 || data.data.status == 200 || data.data.status == 201) {
          console.log(data.data.status);
          Swal.fire({
            icon: "success",
            title: "เพิ่มข้อมูลสถานะสำเร็จ",
            timer: 2500,
            showConfirmButton: 1,
          });
          router.push("/customers");
        } else {
          Swal.fire({
            icon: "warning",
            title: "ไม่สามารถเพิ่มข้อมูลได้",
            timer: 3000,
            showConfirmButton: 1,
          });
          return false;
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุข้อมูลให้ครบ",
        timer: 3000,
        showConfirmButton: 1,
      });
    }

  }

};
const closeForm = () => {
  router.push('/customers');
};
</script>
<template>
  <div class="flex justify-center bg-white dark:bg-slate-700 m-4 p-10 rounded-2xl shadow-custom">
    <div class="w-full md:w-[800px] h-full">
      <h1 class="text-center font-semibold text-black text-2xl mb-6 dark:text-white">{{ type_form }}ข้อมูลลูกค้า</h1>
      <form @submit.prevent="submit">
        <div class="mb-4 w-full">
          <label for="name" class="block mb-2 text-base font-medium text-black dark:text-white">ชื่อลูกค้า <span
              class="text-red-500">*</span></label>
          <input type="text" id="name" v-model="dataform.name"
            :class="v$.name.$error ? 'border-red-300' : 'border-gray-300'"
            class="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <small v-if="v$.name.$error" class="text-red-500 float-right">{{ v$.name.$errors[0].$message }}</small>
        </div>
        <div class="mb-4 w-full ">
          <label for="contactName" class="block mb-2 text-base font-medium text-black dark:text-white">ชื่อผู้ติดต่อ
            <span class="text-red-500">*</span></label>
          <input type="text" id="contactName" v-model="dataform.contactName"
            :class="v$.name.$error ? 'border-red-300' : 'border-gray-300'"
            class="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <small v-if="v$.contactName.$error" class="text-red-500 float-right">{{
            v$.contactName.$errors[0].$message
          }}</small>
        </div>
        <div class="mb-4 w-full ">
          <label for="phone" class="block mb-2 text-base font-medium text-black dark:text-white">เบอร์โทรศัพท์มือถือ
            <span class="text-red-500">*</span></label>
          <input type="tel" id="phone" v-model="dataform.phone"
            :class="v$.phone.$error ? 'border-red-300' : 'border-gray-300'"
            class="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <small v-if="v$.phone.$error" class="text-red-500 float-right">{{ v$.phone.$errors[0].$message }}</small>
        </div>
        <div class="mb-4 w-full ">
          <label for="address" class="block mb-2 text-base font-medium text-black dark:text-white">ที่อยู่ <span class="text-black opacity-50">(ไม่บังคับ)</span></label>
          <textarea id="address" rows="1" v-model="dataform.address"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
          <!-- <small v-if="v$.address.$error" class="text-red-500 float-right">{{ v$.address.$errors[0].$message }}</small> -->
        </div>
        <div class="mb-4">
          <label for="type" class="block mb-2 text-base font-medium text-black dark:text-white">ประเภท <span
              class="text-red-500">*</span></label>
          <select id="type" v-model="dataform.type" :class="v$.type.$error ? 'border-red-300' : 'border-gray-300'"
            class="bg-gray-50 border  text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:focus:border-blue-500">
            <option value="" disabled selected>เลือกประเภท</option>
            <option v-for="val of type_list" :key="val" :value="val.type">{{val.type}}</option>
          </select>
          <small v-if="v$.type.$error" class="text-red-500 float-right">{{ v$.type.$errors[0].$message }}</small>
        </div>
        <div class="mb-4 w-full ">
          <label for="detail" class="block mb-2 text-base font-medium text-black dark:text-white">รายละเอียด <span class="text-black opacity-50">(ไม่บังคับ)</span></label>
          <textarea id="address" rows="1" v-model="dataform.detail" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
          <!-- <small v-if="v$.detail.$error" class="text-red-500 float-right">{{ v$.detail.$errors[0].$message }}</small> -->
        </div>
        <div class="flex flex-row w-full">
          <div class="mb-4 w-full ">
            <label for="product" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">สินค้า <span class="text-black opacity-50">(ไม่บังคับ)</span></label>
            <select id="type" v-model="dataform.product"
              class="bg-gray-50 border text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:focus:border-blue-500">
              <option value="" disabled selected>เลือกสินค้า</option>
              <option v-for="val of product_list" :key="val" :value="val.product">{{ val.product }}</option>
            </select>
            <!-- <small v-if="v$.product.$error" class="text-red-500 float-right">{{
              v$.product.$errors[0].$message
            }}</small> -->
          </div>
          <div class="mb-4 w-full mx-2">
            <label for="status" class="block mb-2 text-base font-medium text-black dark:text-white ">ช่องทาง <span
                class="text-red-500">*</span></label>
            <select id="type" v-model="dataform.contactBy"
              :class="v$.contactBy.$error ? 'border-red-300' : 'border-gray-300'"
              class="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:focus:border-blue-500">
              <option value="" disabled selected>เลือกช่องทาง</option>
              <option v-for="val of contactby_list" :key="val" :value="val.contactBy">{{ val.contactBy }}</option>
            </select>
            <small v-if="v$.contactBy.$error" class="text-red-500 float-right">{{
              v$.contactBy.$errors[0].$message
            }}</small>
          </div>
          <div class="mb-4 w-full">
            <label for="status" class="block mb-2 text-base font-medium text-black dark:text-white ">สถานะ <span
                class="text-red-500">*</span></label>
            <select id="type" v-model="dataform.status" :class="v$.status.$error ? 'border-red-300' : 'border-gray-300'"
              class="bg-gray-50 border  text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:focus:border-blue-500">
              <option value="" disabled selected>เลือกสถานะ</option>
              <option v-for="val of status_list" :key="val" :value="val.status">{{ val.status }}</option>
            </select>
            <small v-if="v$.status.$error" class="text-red-500 float-right">{{ v$.status.$errors[0].$message }}</small>
          </div>
        </div>
        <div class="mb-6 w-full ">
          <label for="note" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">หมายเหตุ  <span class="text-black opacity-50">(ไม่บังคับ)</span></label>
          <textarea id="note" rows="1" v-model="dataform.note"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
        </div>
        <div class="flex flex-row items-center justify-center">
          <button type="submit"
            class="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mr-2"><i
              class="fa-solid fa-check mr-3"></i>บันทึกข้อมูล</button>
          <button type="button" @click="closeForm()"
            class="text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base w-full sm:w-[256px] px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-2"><i
              class="fa-solid fa-xmark mr-3"></i>ยกเลิก</button>
        </div>
      </form>
    </div>
  </div>
</template>



<style scoped>
.shadow-custom {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
</style>
