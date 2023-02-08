<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import TitleBar from "@/components/TitleBar.vue";
import moment from 'moment';

let url = new URL(window.location.href);
const id = url.searchParams.get("detail");
const titleStack = ref(["Customers", "รายละเอียดของลูกค้า"]);
const states = reactive({
  contactBy: "",
  type: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  subdistrict_name: "",
  district_name: "",
  province_name: "",
  postcode: "",
  detail: "",
  otherCustomerProduct: [],
  serial_number: "",
  purchase_date: "",
  warranty_expired: "",
  status: "",
  note: "",
  otherCustomerLog: [],
})

onMounted(() => {
  console.log(id);
  ApiMain.get(`/other-customer/${id}`).then(res => {
    console.log(res.data.data);
    states.contactBy = res.data.data.contactBy;
    states.type = res.data.data.type;
    states.name = res.data.data.name;
    states.phone = res.data.data.phone;
    states.email = res.data.data.email;
    states.address = res.data.data.address;
    states.subdistrict_name = res.data.data.subdistrict;
    states.district_name = res.data.data.district;
    states.province_name = res.data.data.province;
    states.postcode = res.data.data.postcode;
    states.detail = res.data.data.detail;
    states.note = res.data.data.note;
    states.contactBy = res.data.data.contactBy;
    states.status = res.data.data.status;
    states.otherCustomerProduct = res.data.data.otherCustomerProduct ;  //สินค้า
    states.otherCustomerLog = res.data.data.otherCustomerLog; // log


  }).catch((error) => {
    console.log(error.message);
  });



});


const reversedArray = computed(() => {

  let arr = states.otherCustomerLog;
  return arr.slice().reverse();
});


const formatdate =(date)=>{
  let str = date.toString();
  // console.log(d);
  let x = str.substring(str.indexOf('T')+1);
  let time = x.substring(0,x.indexOf('.000Z'));

  return  time.slice(0, 5);
};



</script>
<template>
  <title-bar class="p-4 pb-0" :title-stack="titleStack" />
  <div class="flex flex-row gap-2 m-4">
    <div class="w-full bg-white shadow rounded-lg py-10 p-4">
      <div>
        <h1 class="text-xl font-bold text-center ">รายละเอียดลูกค้า</h1>
        <div class="flex justify-center mt-4 mb-4">
          <img src="../../assets/images/son.png" alt="" class=" bg-gray-100 px-4 py-3.5 rounded-full border-2">
        </div>
        <div class="flex justify-center">
          <div class="flex flex-col w-custom p-4">
          <div class="font-bold mb-2">ชื่อ :
            <span v-if="states.name == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal text-gray-800">{{ states.name }}</span>
          </div>
          <div class="font-bold mb-2">เบอร์โทร :
            <span v-if="states.phone == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal text-gray-800">{{ states.phone }}</span>
          </div>
          <div class="font-bold mb-2">ที่อยู่ :
            <span v-if="states.address == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <!-- <span v-else class="font-normal text-gray-800">{{ states.address }} ต.{{ states.subdistrict_name }} อ.{{ states.district_name }} จ. {{ states.province_name }} {{ states.postcode }}</span> -->
            <span v-else class="font-normal text-gray-800">{{ states.address }}</span>
          </div>
          <div class="font-bold mb-2">จังหวัด :
            <span v-if="states.province_name == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal text-gray-800">{{ states.province_name }}</span>
          </div>
          <div class="font-bold mb-2">อำเภอ :
            <span v-if="states.district_name == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal text-gray-800">{{ states.district_name }}</span>
          </div>
          <div class="font-bold mb-2">ตำบล :
            <span v-if="states.subdistrict_name == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal text-gray-800">{{ states.subdistrict_name }}</span>
          </div>
          <div class="font-bold mb-2">รหัสไปรษณีย์ :
            <span v-if="states.postcode == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal text-gray-800">{{ states.postcode }}</span>
          </div>
          <div class="font-bold mb-2">ประเภท :
            <span v-if="states.type == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal text-gray-800">{{ states.type }}</span>
          </div>
          <div class="font-bold mb-2 ">รายละเอียด :
            <p v-if="states.detail == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</p>
            <p v-else class="font-normal text-gray-800 indent-10" style="word-wrap: break-word;">{{ states.detail }}</p>
          </div>
          <div class="font-bold mb-2">ช่องทาง :
            <span v-if="states.contactBy == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal ">{{ states.contactBy }}</span>
          </div>
          <div class="font-bold mb-2">สถานะ :
            <span v-if="states.status == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal">{{ states.status }}</span>
          </div>
          <div class="font-bold mb-2">หมายเหตุ :
            <span v-if="states.note == ''" class="opacity-60 font-normal">ไม่ได้ระบุ</span>
            <span v-else class="font-normal">{{ states.note }}</span>
          </div>
        </div>
        </div>

      </div>
    </div>
    <div class="w-full bg-white shadow rounded-lg py-10">
      <h6 class="text-center font-bold text-lg mb-4">สถานะดำเนินการ</h6>
      <div v-if="(states.otherCustomerLog).length !=0">
        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-800 uppercase  dark:text-gray-400 ">
              <tr class="bg-gray-100">
                <th scope="col" class="w-[10px] p-0"></th>
                <th scope="col" class="px-2 py-3 text-base font-bold text-start ml-2 ">
                  สถานะ
                </th>
                <th scope="col" class="px-2 py-3 text-base font-bold text-center truncate">
                  รายละเอียด
                </th>
                <th scope="col" class="px-2 py-3 text-base font-bold text-center truncate">
                  วันที่ / เวลา
                </th>
                <th scope="col" class="px-2 py-3 text-base font-bold text-center truncate">
                  ผู้บันทึก
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white border-b dark:bg-gray-800 " :class="index==0?'bg-green-50':''" v-for="(log, index) in reversedArray" :key="index">
                <td class="w-[10px] px-2"><i v-if="index==0" class="text-green-500 fa-solid fa-circle-dot"></i></td>
                <td  class="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div v-if="log.status == 'สอบถามข้อมูล'">
                    <span class="bg-gray-200 py-1.5 px-4 rounded-lg">{{ log.status }}</span>
                  </div>
                  <div v-else-if="log.status == 'กำลังดำเนินการ'">
                    <span class="bg-pink-200 py-1.5 px-4 rounded-lg">{{ log.status }}</span>
                  </div>
                  <div v-else-if="log.status == 'จัดเตรียมสินค้า'">
                    <span class="bg-orange-200 py-1.5 px-4 rounded-lg">{{ log.status }}</span>
                  </div>
                  <div v-else-if="log.status == 'ปิดการขาย'">
                    <span class="bg-green-400 py-1.5 px-4 rounded-lg">{{ log.status }}</span>
                  </div>
                  <div v-else-if="log.status == 'ติดตามผล'">
                    <span class="bg-indigo-200 py-1.5 px-4 rounded-lg">{{ log.status }}</span>
                  </div>
                  <div v-else>
                    <span class="bg-blue-200 py-1.5 px-4 rounded-lg">{{ log.status }}</span>
                  </div>

                </td>
                <td class="px-2 py-4 text-center text-gray-900 ">
                  <p class="">{{ log.detailLog }}</p>
                </td>
                <td class="px-2 py-4 text-center text-gray-900">
                  {{ moment(new Date(log.createdAt)).format('DD/MM/YYYY') }} <br>
                  {{ formatdate(log.createdAt) }} น.
                </td>
                <td class="px-2 py-4 text-center text-gray-900">
                  {{ (log.createdBy).substring(0, (log.createdBy).indexOf('.')) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      <div v-else class="text-center ">
        <span class="opacity-70 " >ยังไม่มีข้อมูล</span>
      </div>
    </div>
  </div>
  <div>
    <div class=" bg-white  shadow-custom h-[500px] m-4 rounded-lg py-10 px-0 overflow-y-auto">
        <h1 class="text-center text-lg font-semibold mb-4">สินค้าที่สั่งซื้อทั้งหมด</h1>
        <div v-if="(states.otherCustomerProduct).length !=0" class="relative overflow-x-auto mx-1 ">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
            <thead class="text-base text-gray-900  bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-4 py-3 truncate ">
                  ชื่อสินค้า
                </th>
                <th scope="col" class="px-4 py-3 truncate">
                  Serial Number
                </th>
                <th scope="col" class="px-4 py-3 truncate ">
                  วันที่ซื้อ
                </th>
                <th scope="col" class="px-4 py-3 truncate">
                  วันที่หมดประกัน
                </th>
                <th scope="col" class="px-4 py-3 truncate ">
                  ใบประเมินราคา
                </th>
                <th scope="col" class="px-4 py-3 truncate">
                  ใบเสนอราคา
                </th>

                <th scope="col" class="px-6 py-3 truncate ">
                  บริการเสริม
                </th>
                <th scope="col" class="px-6 py-3">
                  อื่นๆ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white dark:bg-gray-800 " v-for="(product,index) in states.otherCustomerProduct" :key="index">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white bg-gray-50">
                  {{ product.name }}
                </th>
                <td class="px-6 py-4">
                  {{ product.serialNumber }}
                </td>
                <td class="px-6 py-4 bg-gray-50">
                  <span v-if=" product.purchaseDate == null">-</span>
                  <span v-else>{{ moment(new Date( product.purchaseDate)).format('DD/MM/YYYY') }}</span>

                </td>
                <td class="px-6 py-4">
                  <span v-if=" product.warrantyExpired == null">-</span>
                  <span v-else>{{ moment(new Date( product.warrantyExpired)).format('DD/MM/YYYY') }}</span>

                </td>
                <td class="px-6 py-4 bg-gray-50 text-center">
                  <div v-if="product.estimate == 'string' || product.estimate ==''">
                    -
                  </div>
                  <div v-else>
                    <a :href="product.estimate" target="_blank" class="hover:text-blue-500 flex flex-col"><i class="fa-solid fa-file text-lg"></i><span>link</span></a>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div v-if="product.quotation == 'string' || product.quotation == ''">
                    -
                  </div>
                  <div v-else>
                    <a :href="product.quotation" target="_blank" class="hover:text-blue-500 flex flex-col"><i class="fa-solid fa-file text-lg"></i><span>link</span></a>
                  </div>
                </td>
                <td class="px-6 py-4 bg-gray-50">
                  <div v-if="product.additionalServices == 'string' || product.additionalServices == ''">
                    -
                  </div>
                  <div v-else>
                    {{ product.additionalServices }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="product.etc == 'string' || product.etc == ''">
                    -
                  </div>
                  <div v-else>
                    {{ product.etc }}
                  </div>

                </td>
              </tr>
            </tbody>

          </table>
        </div>
        <div v-else class="text-center mt-10">
          <span class="opacity-70">ยังไม่มีข้อมูลสินค้า</span>
        </div>
      </div>
  </div>
</template>

<style scoped>

.shadow-custom {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}


@media (max-width:1160) {
  .w-custom  {
    width: 550px;
  }
}
@media (min-width:1160) {
  .w-custom  {
    width: 700px;
  }
}
</style>
