<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import TitleBar from "@/components/TitleBar.vue";
import { useMainStore } from "@/stores/main";
import moment from "moment";
const mainStore = useMainStore();

const titleStack = ref(["Customers", "แบบฟอร์มข้อมูลลูกค้า"]);

let url = new URL(window.location.href);
const id = url.searchParams.get("customer_edit");
let type_form = ref('');
const router = useRouter();


const profileForm = reactive({
  name: mainStore.userName,
  username: mainStore.userName,
  email: mainStore.userEmail,
});

let step = ref(1);

let type_list = reactive([
  { id: 1, type: 'B2C' }, { id: 2, type: 'B2B' },
  { id: 3, type: 'Dealer' }, { id: 4, type: 'Seller' },
  { id: 5, type: 'Dropship' }]);

// let product_list = reactive([
//   'XS-3CH', 'S-1CH (A)', 'S-1CH (B)', 'S-3CH (A)', 'S-3CH (B)', 'S-3CH++',
//   'SET A XS-3CH', 'SET A S-1CH', 'SET A S-3CH', 'SET A S-3CH++',
//   'SET B XS-3CH', 'SET B S-1CH', 'SET B S-3CH', 'SET B S-3CH++',
//   '2061 (Weather station)', '2053 (MA+AP)', '2053 (MA)', '2053 (AP)', 'Smart garden A', 'Smart garden B', 'Smart Bag'
// ]);
let product_list = reactive([
  { id: 1, name: 'XS-3CH' }, { id: 2, name: 'S-1CH (A)' }, { id: 3, name: 'S-1CH (B)' }, { id: 4, name: 'S-3CH (A)' }, { id: 5, name: 'S-3CH (B)' }, { id: 6, name: 'S-3CH+' },
  { id: 7, name: 'SET A XS-3CH' }, { id: 8, name: 'SET A S-1CH' }, { id: 9, name: 'SET A S-3CH' }, { id: 10, name: 'SET A S-3CH++' },
  { id: 11, name: 'SET B XS-3CH' }, { id: 12, name: 'SET B S-1CH' }, { id: 13, name: 'SET B S-3CH' }, { id: 14, name: 'SET B S-3CH++' },
  { id: 15, name: '2061 (Weather station)' }, { id: 16, name: '2053 (MA+AP)' }, { id: 17, name: '2053 (MA)' }, { id: 18, name: '2053 (AP)' }, { id: 19, name: 'Smart garden A' }, { id: 20, name: 'Smart garden B' }, { id: 21, name: 'Smart Bag' }
]);

let contactby_list = reactive([{ id: 1, contactBy: 'Facebook' }, { id: 2, contactBy: 'Line' }, { id: 3, contactBy: 'Walk in' }, { id: 4, contactBy: 'By phone' }, { id: 5, contactBy: 'M2M' }, { id: 6, contactBy: 'ตัวแทน' }]);
let status_list = reactive([{ id: 1, status: 'ปิดการขาย' }, { id: 2, status: 'กำลังดำเนินการ' }, { id: 3, status: 'สอบถามข้อมูล' }]);



let statusBy_admin = reactive([{ id: 1, status: 'สอบถามข้อมูล' }, { id: 2, status: 'กำลังดำเนินการ' }, { id: 3, status: 'จัดเตรียมสินค้า' }, { id: 4, status: 'ปิดการขาย' }, { id: 5, status: 'ติดตามผล' }])
const dataform = reactive({
  contactBy: "",
  type: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  subdistrict: "",
  district: "",
  province: "",
  postcode: "",
  detail: "",
  otherCustomerProduct: [
    { estimate: '', quotation: '', name: '', serialNumber: '', purchaseDate: '', warrantyExpired: '', additionalServices: '', etc: '' },
  ],
  status: "",
  note: "",


  province: [],
  province_id: "",
  province_name: "",

  district: [],
  district_id: "",
  district_name: "",

  subdistrict: [],
  subdistrict_id: "",
  subdistrict_name: "",

  postcode: "",
  array: []

});




const dataform2 = reactive({
  status: '',
  detail: ''
})

const url_format = helpers.regex(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/);
const phone_number = helpers.regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
const rules = {
  name: { required: helpers.withMessage('กรุณาระบุชื่อลูกค้า', required) },// ชื่อ
  phone: {
    required: helpers.withMessage('กรุณาระบุเบอร์โทรศัพท์มือถือ', required),
    phone_number: helpers.withMessage(() => "เบอร์โทรศัพท์ไม่ถูกต้อง", phone_number)
  },
}


const rulesForm2 = {
  status: { required: helpers.withMessage('กรุณาเลือกสถานะ', required) },// ชื่อ
  detail: { required: helpers.withMessage('กรุณาระบุรายละเอียด', required) },// ชื่อ
}


const v1$ = useVuelidate(rules, dataform);
const v2$ = useVuelidate(rulesForm2, dataform2);


onMounted(() => {
  getProvinceAll();

  if (id) {
    type_form.value = 'แก้ไข';
    ApiMain.get("/other-customer/" + id).then((res) => {
      console.log(res.data.data);

      dataform.contactBy = res.data.data.contactBy;
      dataform.type = res.data.data.type;
      dataform.name = res.data.data.name;
      dataform.phone = res.data.data.phone;
      dataform.email = res.data.data.email;
      dataform.address = res.data.data.address;
      dataform.subdistrict_name = res.data.data.subdistrict;
      dataform.district_name = res.data.data.district;
      dataform.province_name = res.data.data.province;
      dataform.postcode = res.data.data.postcode;
      dataform.detail = res.data.data.detail;
      dataform.note = res.data.data.note;
      dataform.contactBy = res.data.data.contactBy;
      dataform.status = res.data.data.status;

      if ((res.data.data.otherCustomerProduct).length == 0) {
        dataform.otherCustomerProduct = [{ estimate: '', quotation: '', name: '', serialNumber: '', purchaseDate: '', warrantyExpired: '', additionalServices: '', etc: '' }]
      }
      else {

        let obj_data = res.data.data.otherCustomerProduct;
        let arr = [];
        obj_data.forEach((item, index) => {
          arr.push({
            id: item.id,
            additionalServices: item.additionalServices,
            createdAt: item.createdAt,
            createdBy: item.createdBy,
            estimate: item.estimate,
            name: item.name,
            etc: item.etc,
            purchaseDate: moment(new Date(item.purchaseDate)).format('YYYY-MM-DD'),
            quotation: item.quotation,
            serialNumber: item.serialNumber,
            warrantyExpired: moment(new Date(item.warrantyExpired)).format('YYYY-MM-DD'),
            otherCustomerId: item.otherCustomerId,
          })
        })
        dataform.otherCustomerProduct = arr;

        console.log(arr, dataform.otherCustomerProduct);

      }

      searchSubDistrict.value = res.data.data.subdistrict;
      searchDistrict.value = res.data.data.district;
      searchProvince.value = res.data.data.province;
    }).catch((error) => {
      console.log(error);
    });
  }
  else {
    type_form.value = 'เพิ่ม';

  }
});



// NEW
let searchProvince = ref('');
let searchDistrict = ref('');
let searchSubDistrict = ref('');
let show1 = ref(false);
let show2 = ref(false);
let show3 = ref(false);


const filter_province = computed(() => {
  let province_list = dataform.province;
  return province_list.filter(data => {
    const province = data.name_th.toLowerCase() || data.provinceName.toLowerCase();
    return province.includes(searchProvince.value)
  });
});

const filter_district = computed(() => {
  let district_list = dataform.district;
  return district_list.filter(data => {
    const district_ = data.name_th.toLowerCase() || data.districtName.toLowerCase();
    return district_.includes(searchDistrict.value)
  });
});
const filter_subdistrict = computed(() => {
  let sub_list = dataform.subdistrict;
  return sub_list.filter(data => {
    const subdistrict_ = data.name_th.toLowerCase() || data.subdistrictName.toLowerCase();
    return subdistrict_.includes(searchSubDistrict.value)
  });
});

const input_province = computed(() => {
  if (searchProvince.value == "") {
    searchDistrict.value = "";
    searchSubDistrict.value = "";
    dataform.district_name = '';
    dataform.district_id = '';
    dataform.subdistrict_name = '';
    dataform.subdistrict_id = '';
  }
})
const input_district = computed(() => {
  if (searchDistrict.value == "") {
    searchSubDistrict.value = "";
    dataform.subdistrict_name = '';
    dataform.subdistrict_id = '';
  }
});



const sortThaiDictionary = (list) => {
  const newList = [...list]
  newList.sort((a, b) => a.localeCompare(b, 'th'))
  return newList
}


const getProvinceAll = () => {
  ApiCore.get("/v2/get-province").then((response) => {

    let obj = response.data.data;

    let arr_th = [];
    obj.forEach((element, index) => {
      arr_th.push(element.name_th);
    });

    let province_arr = [];
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_province = obj.filter(x => x.name_th == name);
      province_arr.push(obj_province[0]);
    });
    dataform.province = province_arr;
  });
}

const select_province = (data) => {
  searchProvince.value = data.provinceName || data.name_th;
  dataform.province_name = data.provinceName || data.name_th;
  dataform.province_id = data.province_id;

  console.log(dataform.province_id);
  ApiCore.get("/v2/get-district?province=" + dataform.province_id).then((response) => {
    let obj = response.data.data;
    let arr_th = [];

    obj.forEach((element, index) => {
      arr_th.push(element.name_th);
    });

    let district = [];
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_district = obj.filter(x => x.name_th == name);
      district.push(obj_district[0]);
    });
    dataform.district = district;

  });

};

const select_district = (data) => {
  searchDistrict.value = data.districtName || data.name_th;
  dataform.district_name = data.districtName || data.name_th;
  dataform.district_id = data.district_id;
  ApiCore.get("/v2/get-subdistrict?district=" + dataform.district_id).then((response) => {
    let obj = response.data.data;

    console.log(response.data.data);
    let arr_th = [];

    obj.forEach((element, index) => {
      arr_th.push(element.name_th);
    });

    let subdistrict = [];
    let sort_name = sortThaiDictionary(arr_th);  //เรียงชื่อ

    sort_name.forEach((name) => {
      let obj_subdistrict = obj.filter(x => x.name_th == name);
      subdistrict.push(obj_subdistrict[0]);
    });
    dataform.subdistrict = subdistrict;
  });

};

const select_subdistrict = (data) => {

  searchSubDistrict.value = data.subdistrictName || data.name_th;
  dataform.subdistrict_name = data.subdistrictName || data.name_th;
  dataform.subdistrict_id = data.subdistrict_id;
  dataform.postcode = data.zipcode;

};



// step 1
const submitForm = async () => {

  // แก้ไขข้อมูล
  if (id) {
    let data = {};
    if (dataform.email == '') {
      data = {
        contactBy: dataform.contactBy,
        type: dataform.type,
        name: dataform.name,
        phone: dataform.phone,
        address: dataform.address,
        subdistrict: dataform.subdistrict_name,
        district: dataform.district_name,
        province: dataform.province_name,
        postcode: dataform.postcode,
        detail: dataform.detail,
        status: dataform2.status,
        note: dataform.note,
        statusLog: dataform2.status,
      }
    }
    else {
      data = {
        contactBy: dataform.contactBy,
        type: dataform.type,
        name: dataform.name,
        phone: dataform.phone,
        email: dataform.email,
        address: dataform.address,
        subdistrict: dataform.subdistrict_name,
        district: dataform.district_name,
        province: dataform.province_name,
        postcode: dataform.postcode,
        detail: dataform.detail,
        status: dataform2.status,
        note: dataform.note,
        statusLog: dataform2.status
      }
    }
    ApiMain.put(`/other-customer/${id}`, data).then(async (res) => {

      if (res.data.status == 204 || res.data.status == 200 || res.data.status == 201) {


        console.log(dataform.otherCustomerProduct);
        let product = dataform.otherCustomerProduct;
        for (let index = 0; index < product.length; index++) {
          const element = product[index];
          if (element.id) {
            await ApiMain.put(`/other-customer/${id}/edit-product/${element.id}`, {
              estimate: element.estimate,
              quotation: element.quotation,
              name: element.name,
              serialNumber: element.serialNumber,
              purchaseDate: element.purchaseDate,
              warrantyExpired: element.warrantyExpired,
              additionalServices: element.additionalServices,
              etc: element.etc
            }).then(response => {
              console.log(response.data);
            }).catch(error => {
              console.log(error.message);
            });
          }
          else {

            if (element.name ) {
              await ApiMain.post(`/other-customer/${id}/add-product`, {
                estimate: element.estimate,
                quotation: element.quotation,
                name: element.name,
                serialNumber: element.serialNumber,
                purchaseDate: element.purchaseDate,
                warrantyExpired: element.warrantyExpired,
                additionalServices: element.additionalServices,
                etc: element.etc
              }).then(response => {
                console.log(response.data);
              }).catch(error => console.log(error));
            }
          }
        }

        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลสถานะสำเร็จ",
          showConfirmButton: 1,
        });
        router.push("/customers");

      } else {
        Swal.fire({
          icon: "warning",
          title: "แก้ไขข้อมูลผิดพลาด",
          showConfirmButton: 1,
        });
        return false;
      }
    });

    // เพิ่ม log
    ApiMain.put(`/other-customer/${id}/update-status`, {
      status: dataform2.status,
      statusLog: dataform2.detail,
    }).then(response => {
      if (response.data.status == 204 || response.data.status == 200 || response.data.status == 201) {
        console.log(' เพิ่ม Log  สำเร็จ', response.data);
      }
      else {
        console.log(' เพิ่ม Log  ไม่สำเร็จ', response.data);
      }
    }).catch(error => {
      console.log(error);
    });

  }
  // เพิ่มข้อมูล
  else {

    let data = {};

    if (dataform.email == '') {
      data = {
        contactBy: dataform.contactBy,
        type: dataform.type,
        name: dataform.name,
        phone: dataform.phone,
        address: dataform.address,
        subdistrict: dataform.subdistrict_name,
        district: dataform.district_name,
        province: dataform.province_name,
        postcode: dataform.postcode,
        detail: dataform.detail,
        status: dataform2.status,
        note: dataform.note,
        statusLog: dataform2.status
      }
    }
    else {
      data = {
        contactBy: dataform.contactBy,
        type: dataform.type,
        name: dataform.name,
        phone: dataform.phone,
        email: dataform.email,
        address: dataform.address,
        subdistrict: dataform.subdistrict_name,
        district: dataform.district_name,
        province: dataform.province_name,
        postcode: dataform.postcode,
        detail: dataform.detail,
        status: dataform2.status,
        note: dataform.note,
        statusLog: dataform2.status
      }
    }
    // Add data
    ApiMain.post("/other-customer", data).then(async (response) => {
      const customer_id = response.data.data.id;
      if (response.data.status == 204 || response.data.status == 200 || response.data.status == 201) {

        let product = dataform.otherCustomerProduct;

        for (let index = 0; index < product.length; index++) {
          const element = product[index];

          if (element.name) {
          // if ((element.name && element.serialNumber) && (element.purchaseDate && element.warrantyExpired)) {
            //  เพิ่มข้อมูลสินค้าของลูกค้าคนนี้
            await ApiMain.post(`/other-customer/${customer_id}/add-product`, {
              estimate: element.estimate,
              quotation: element.quotation,
              name: element.name,
              serialNumber: element.serialNumber,
              purchaseDate: element.purchaseDate,
              warrantyExpired: element.warrantyExpired,
              additionalServices: element.additionalServices,
              etc: element.etc
            }).then((response) => {
              if (response.data.status == 201 || response.data.status == 200) {
                console.log('add successfully !!!');

              }
              else {
                Swal.fire({
                  icon: "success",
                  title: "เพิ่มข้อมูลลูกค้าสไม่สำเร็จ",
                  confirmButtonText: 'ตกลง',
                  showConfirmButton: 1,
                });
              }

            }).catch((error) => {
              console.log(error.message);
            });
          }

        }
        Swal.fire({
              icon: "success",
              title: "เพิ่มข้อมูลลูกค้าสำเร็จ",
              confirmButtonText: 'ตกลง',
              showConfirmButton: 1,
            });
            router.push("/customers");


      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถเพิ่มข้อมูลได้",
          confirmButtonText: 'ตกลง',
          showConfirmButton: 1,
        });
      }

    });
  }

}


const closeForm = () => {
  router.push('/customers');
};


let progress = ref(0);
let percent = computed(() => progress.value);

const prevStep = () => {
  step.value = 1;
  progress.value = 0;
  if (step.value < 1) {
    step.value = 1;

  }
}
const nextStep = async () => {
  const result1 = await v1$.value.$validate();
  const result2 = await v2$.value.$validate();

  if (result1 && result2) {
    progress.value = 100;
    step.value = 2;
  }
  else {
    Swal.fire({
      icon: "warning",
      title: 'โปรดระบุข้อมูลให้ถูกต้อง',
      text: "กรุณาระบุ ชื่อลูกค้า กับ เบอร์โทรศัพท์มือถือ",
      timer: 5000,
      showConfirmButton: 1,
    });
  }
};


const addGroup = () => {
  if (id) {
    dataform.otherCustomerProduct.push({ id: '', estimate: '', quotation: '', name: '', serialNumber: '', purchaseDate: '', warrantyExpired: '', additionalServices: '', etc: '' })
  }
  else {
    dataform.otherCustomerProduct.push({ estimate: '', quotation: '', name: '', serialNumber: '', purchaseDate: '', warrantyExpired: '', additionalServices: '', etc: '' })
  }

};

const deleteItem = (index, customer, product_id) => {
  if (id) {
    Swal.fire({
      title: "ยืนยันการลบ",
      text: `คุณต้องการลบสินค้าชิ้นนี้หรือไม่ ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ok"
    }).then((result) => {
      if (result.isConfirmed) {
        ApiMain.delete(`/other-customer/${customer}/delete-product/${product_id}`).then(res => {
          console.log(res);
          if ((dataform.otherCustomerProduct).length > 1) {
            dataform.otherCustomerProduct.splice(index, 1);
          }
        }).catch(error => {
          console.log(error.message);
        });
      }
    })
  }
  else {
    if ((dataform.otherCustomerProduct).length > 1) {
      dataform.otherCustomerProduct.splice(index, 1);
    }
  }
};

</script>
<template>

  <div class="hidden">{{ input_province }} {{ input_district }} </div>
  <title-bar class="p-4 pb-0" :title-stack="titleStack" />
  <div class="bg-white shadow-custom m-4 p-4 rounded-lg ">
    <div class="relative flex flex-row justify-center">
      <!-- steper -->
      <div class="relative">
        <div class="w-[800px] bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
          <div class="bg-green-600 h-2.5 rounded-full" style="width:0%" :style="{ 'width': percent + '%' }"></div>
        </div>
        <button type="button"
          :class="percent == 0 ? ' border-green-600 bg-green-100 border-2' : step == 2 ? 'bg-green-500 border-0' : 'bg-gray-200'"
          class="bg-gray-50 rounded-full py-2 px-3 absolute top-0">
          <span v-if="percent == 0" class="text-base p-1">1</span>
          <span v-else><i class="fa-solid fa-check text-green-800"></i></span>
        </button>
        <button type="button"
          :class="percent == 100 ? ' border-green-600 bg-green-200 border-2' : step == 2 ? 'bg-green-500 border-0' : 'bg-gray-200'"
          class="bg-gray-50 rounded-full py-2 px-4 border-2 border-gray-200 absolute top-0 right-0">2</button>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="mt-10 w-[800px]">
        <div v-if="step === 1">
          <div class="flex flex-row justify-center mb-4">
            <div class="w-full md:w-[800px] h-full">
              <h1 class="text-center font-semibold text-black text-2xl mb-4 dark:text-white">{{ type_form }}ข้อมูลลูกค้า
              </h1>
              <div>
                <div class="mb-4 w-full">
                  <label for="name" class="block mb-2 text-base font-medium text-black dark:text-white">ชื่อลูกค้า
                    <span class="text-red-500">*</span></label>
                  <input type="text" id="name" v-model="dataform.name"
                    :class="v1$.name.$error ? 'border-red-300' : 'border-gray-300'"
                    class="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <small v-if="v1$.name.$error" class="text-red-500 float-right">{{
                    v1$.name.$errors[0].$message
                  }}</small>
                </div>
                <div class="mb-4 w-full ">
                  <label for="phone"
                    class="block mb-2 text-base font-medium text-black dark:text-white">เบอร์โทรศัพท์มือถือ <span
                      class="text-red-500">*</span></label>
                  <input type="tel" id="phone" v-model="dataform.phone"
                    :class="v1$.phone.$error ? 'border-red-300' : 'border-gray-300'"
                    class="bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <small v-if="v1$.phone.$error" class="text-red-500 float-right">{{
                    v1$.phone.$errors[0].$message
                  }}</small>
                </div>
                <div class="mb-4 w-full ">
                  <label for="phone" class="block mb-2 text-base font-medium text-black dark:text-white">E-mail</label>
                  <input type="email" id="email" v-model="dataform.email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                </div>
                <div class="mb-4 w-full ">
                  <label for="address" class="block mb-2 text-base font-medium text-black dark:text-white">ที่อยู่
                    <span class="text-black opacity-50">(ไม่บังคับ)</span></label>
                  <textarea id="address" rows="1" v-model="dataform.address"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 border-gray-300  rounded-lg border  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                </div>
                <div class="flex flex-row mb-4 gap-2">
                  <div @click="show1 = !show1" class="w-full relative">
                    <div>
                      <label for="province"
                        class="block mb-2 text-base font-medium text-gray-900 dark:text-white">จังหวัด</label>
                      <div class="relative">
                        <input type="text" v-model="searchProvince" id="province" autocomplete="off"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="เลือกจังหวัด">
                        <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                          <img src="../../assets/images/arrow-down-sign-to-navigate.png" alt=""
                            :class="show1 ? 'rotate-180' : ''" class="w-[10px]">
                        </div>
                      </div>
                    </div>
                    <div v-if="show1 == true" class="z-10 absolute w-full">
                      <ul class="bg-gray-50 mt-0.5 rounded-lg shadow h-auto overflow-scroll"
                        :class="filter_province.length >= 1 && filter_province.length >= 5 ? 'h-[200px]' : 'h-auto'">
                        <li v-for="item of filter_province" :key="item.province_id"
                          class="hover:bg-gray-200 hover:font-medium hover:shadow py-1 px-4 cursor-pointer w-full"
                          @click="select_province(item)">
                          <span>{{ item.name_th }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div @click="show2 = !show2" class="w-full relative">
                    <div>
                      <label for="province"
                        class="block mb-2 text-base font-medium text-gray-900 dark:text-white">อำเภอ</label>
                      <div class="relative">
                        <input type="text" v-model="searchDistrict" id="district" autocomplete="off"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="เลือกอำเภอ">
                        <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                          <img src="../../assets/images/arrow-down-sign-to-navigate.png" alt=""
                            :class="show2 ? 'rotate-180' : ''" class="w-[10px]">
                        </div>
                      </div>
                    </div>
                    <div v-if="show2 == true" class="z-10 absolute w-full">
                      <ul class="bg-gray-50 mt-0.5 rounded-lg shadow h-auto overflow-scroll"
                        :class="filter_district.length >= 1 && filter_district.length >= 5 ? 'h-[200px]' : 'h-auto'">
                        <li v-for="item of filter_district" :key="item.district_id"
                          class="hover:bg-gray-200 hover:font-medium hover:shadow py-1 px-4 cursor-pointer w-full"
                          @click="select_district(item)">
                          <span>{{ item.name_th }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div @click="show3 = !show3" class="w-full relative ">
                    <div>
                      <label for="province" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">ตำบล
                      </label>
                      <div class="relative">
                        <input type="text" v-model="searchSubDistrict" id="sub-district" autocomplete="off"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="เลือกตำบล">
                        <div class="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                          <img src="../../assets/images/arrow-down-sign-to-navigate.png" alt=""
                            :class="show3 ? 'rotate-180' : ''" class="w-[10px]">
                        </div>
                      </div>
                    </div>
                    <div v-if="show3 == true" class="z-10 absolute w-full">
                      <ul class="bg-gray-50 mt-0.5 rounded-lg shadow h-auto overflow-scroll"
                        :class="filter_subdistrict.length >= 1 && filter_subdistrict.length >= 5 ? 'h-[200px]' : 'h-auto'">
                        <li v-for="item of filter_subdistrict" :key="item.id"
                          class="hover:bg-gray-200 hover:font-medium hover:shadow py-1 px-4 cursor-pointer w-full"
                          @click="select_subdistrict(item)">
                          <span>{{ item.name_th }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="w-full relative ">
                    <div>
                      <label for="province"
                        class="block mb-2 text-base font-medium text-gray-900 dark:text-white">รหัสไปรษณีย์
                      </label>
                      <div class="relative">
                        <input type="text" v-model="dataform.postcode" id="zipcode" autocomplete="off"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pr-4 p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          readonly>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-4">
                  <label for="type" class="block mb-2 text-base font-medium text-black dark:text-white">ประเภท</label>
                  <select id="type" v-model="dataform.type"
                    class="bg-gray-50 border-gray-300 border  text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:focus:border-blue-500">
                    <option value="" disabled selected>เลือกประเภท</option>
                    <option v-for="val of type_list" :key="val" :value="val.type">{{ val.type }}</option>
                  </select>
                </div>
                <div class="mb-4 w-full ">
                  <label for="detail" class="block mb-2 text-base font-medium text-black dark:text-white">รายละเอียด
                    <span class="text-black opacity-50">(ไม่บังคับ)</span></label>
                  <textarea id="address" rows="1" v-model="dataform.detail"
                    class="block p-2.5 w-full text-sm border-gray-300  text-gray-900 bg-gray-50 rounded-lg border  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                </div>

                <div class="flex flex-row w-full gap-2">
                  <div class="mb-4 w-full">
                    <label for="status" class="block mb-2 text-base font-medium text-black dark:text-white ">ช่องทาง
                    </label>
                    <select id="type" v-model="dataform.contactBy"
                      class="bg-gray-50 border-gray-300 border text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:focus:border-blue-500">
                      <option value="" disabled selected>เลือกช่องทาง</option>
                      <option v-for="val of contactby_list" :key="val" :value="val.contactBy">{{ val.contactBy }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="mb-6 w-full ">
                  <label for="note" class="block mb-2 text-base font-medium text-gray-900 dark:text-white">หมายเหตุ
                    <span class="text-black opacity-50">(ไม่บังคับ)</span></label>
                  <textarea id="note" rows="1" v-model="dataform.note"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row justify-center mb-4">
            <div class="w-full md:w-[800px] h-full">
              <h1 class="text-center font-semibold text-black text-2xl mb-6 dark:text-white">สถานะดำเนินการ</h1>
              <div class="mb-4">
                <label for="type" class="block mb-2 text-base font-medium text-black dark:text-white">สถานะ <span
                    class="text-red-500">*</span></label>
                <select id="type" v-model="dataform2.status"
                  :class="v2$.status.$error ? 'border-red-300' : 'border-gray-300'"
                  class="bg-gray-50 border  text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:focus:border-blue-500">
                  <option value="" disabled selected>เลือกสถานะ</option>
                  <option v-for="val of statusBy_admin" :key="val" :value="val.status">{{ val.status }}</option>
                </select>
                <small v-if="v2$.status.$error" class="text-red-500 float-right">{{
                  v2$.status.$errors[0].$message
                }}</small>
              </div>
              <div class="mb-4 w-full ">
                <label for="detail2" class="block mb-2 text-base font-medium text-black dark:text-white">รายละเอียด
                  <span class="text-red-500">*</span></label>
                <textarea id="detail2" rows="2" v-model="dataform2.detail"
                  :class="v2$.detail.$error ? 'border-red-300' : 'border-gray-300'"
                  class="block p-2.5 w-full  text-sm text-gray-900 bg-gray-50 rounded-lg border  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                <small v-if="v2$.detail.$error" class="text-red-500 float-right">{{
                  v2$.detail.$errors[0].$message
                }}</small>
              </div>
              <div>
              </div>
            </div>
          </div>
          <div class="flex justify-end ">
            <button type="submit" class="bg-green-500 py-2 px-4 rounded-lg hover:bg-green-400 font-medium"
              @click="nextStep">ถัดไป <i class="fa-solid fa-arrow-right ml-2"></i></button>
          </div>
        </div>

        <div v-if="step === 2">
          <form @submit.prevent="submitForm">
            <div class="mt-10 relative ">
              <h1 class="font-bold text-lg text-center mb-10">{{ type_form }}ข้อมูลสินค้า</h1>
              <div v-for="(group, index) in dataform.otherCustomerProduct" :key="index"
                class="shadow-custom mt-4  p-4 rounded-lg">
                <div class="flex justify-end"><button type="button"
                    @click="deleteItem(index, group.otherCustomerId, group.id)"><i
                      class="fa-solid fa-circle-xmark text-[32px] text-red-500 hover:text-red-700 cursor-pointer"></i></button>
                </div>
                <p class="text-basse font-bold mb-4 text-center">สินค้าชิ้นที่ {{ index+ 1 }} </p>
                <div class="flex flex-row gap-2">
                  <div class="mb-4 w-full ">
                    <label for="detail"
                      class="block mb-2 text-base font-medium text-black dark:text-white">ชื่อสินค้า</label>
                    <select id="type" v-model="group.name"
                      class="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:focus:border-blue-500">
                      <option value="" disabled selected>เลือกสินค้า</option>
                      <option v-for="val of product_list" :key="val" :value="val.name">{{ val.name }}</option>
                    </select>
                  </div>
                  <div class="mb-4 w-full ">
                    <label for="serialNumber" class="block mb-2 text-base font-medium text-black dark:text-white">Serial
                      number</label>
                    <input type="text" id="serialNumber" v-model="group.serialNumber"
                      class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  </div>
                </div>
                <div class="flex flex-row gap-2">
                  <div class="mb-4 w-full ">
                    <label for="purchaseDate"
                      class="block mb-2 text-base font-medium text-black dark:text-white">วันที่ซื้อ</label>
                    <input type="date" id="purchaseDate" v-model="group.purchaseDate"
                      class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  </div>
                  <div class="mb-4 w-full ">
                    <label for="warrantyExpired"
                      class="block mb-2 text-base font-medium text-black dark:text-white">วันที่หมดประกัน</label>
                    <input type="date" id="warrantyExpired" v-model="group.warrantyExpired"
                      class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  </div>
                </div>
                <div class="flex flex-row gap-2">
                  <div class="mb-4 w-full ">
                    <label for="quotation"
                      class="block mb-2 text-base font-medium text-black dark:text-white">ใบเสนอราคา</label>
                    <input type="url" id="quotation" v-model="group.quotation"
                      class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  </div>
                  <div class="mb-4 w-full ">
                    <label for="estimate"
                      class="block mb-2 text-base font-medium text-black dark:text-white">ใบประเมินราคา</label>
                    <input type="url" id="estimate" v-model="group.estimate"
                      class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  </div>
                </div>
                <div class="flex flex-row gap-2">
                  <div class="mb-4 w-full ">
                    <label for="additionalServices"
                      class="block mb-2 text-base font-medium text-black dark:text-white">บริการเสริม</label>
                    <input type="text" id="additionalServices" v-model="group.additionalServices"
                      class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  </div>
                  <div class="mb-4 w-full ">
                    <label for="etc" class="block mb-2 text-base font-medium text-black dark:text-white">อื่นๆ</label>
                    <input type="text" id="etc" v-model="group.etc"
                      class="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  </div>
                </div>
              </div>
              <div class="relative mt-10">
                <hr class="mt-4 mb-10 border border-green-700">
                <div class="absolute -bottom-4 left-[350px]">
                  <button type="button" @click="addGroup"
                    class="bg-green-700 hover:bg-green-400 hover:text-black rounded-full py-1.5 px-3 text-white"><i
                      class="fa-solid fa-plus "></i> เพื่มสินค้า</button>
                </div>
              </div>
            </div>
            <div class="flex flex-row justify-between ">
              <button type="button" class="bg-gray-200 py-2 px-4 rounded-lg hover:bg-gray-400 font-medium"
                @click="prevStep"> <i class="fa-solid fa-arrow-left mr-2"></i> ก่อนหน้า</button>
              <button type="submit"
                class="bg-green-500 py-2 px-4 rounded-lg hover:bg-green-700 font-medium">เสร็จสิ้น</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-custom {
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
</style>

