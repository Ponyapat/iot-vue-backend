<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiBallot, mdiBallotOutline, mdiAccount, mdiMail } from "@mdi/js";
import MainSection from "@/components/MainSection.vue";
import TitleBar from "@/components/TitleBar.vue";
import CardComponent from "@/components/CardComponent.vue";
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import FilePicker from "@/components/FilePicker.vue";
import HeroBar from "@/components/HeroBar.vue";
import Field from "@/components/Field.vue";
import Control from "@/components/Control.vue";
import Divider from "@/components/Divider.vue";
import JbButton from "@/components/JbButton.vue";
import JbButtons from "@/components/JbButtons.vue";
import BottomOtherPagesSection from "@/components/BottomOtherPagesSection.vue";
import TitledSection from "@/components/TitledSection.vue";
import TitleSubBar from "@/components/TitleSubBar.vue";
import axios from "axios"; 
import Swal from "sweetalert2";

const titleStack = ref(["Admin", "เพิ่มข้อมูลภูมิศาสตร์ (ที่ดิน)"]);

// const selectOptions = [
//   { id: 1, label: "Business development" },
//   { id: 2, label: "Marketing" },
//   { id: 3, label: "Sales" },
// ];

// const customElementsForm = reactive({
//   checkbox: ["lorem"],
//   radio: "one",
//   switch: ["one"],
//   file: null,
// });

const router = useRouter();

const form = reactive({
  title: "title",
  detail: "detail",
  lat: "100.3424324",
  long: "13.32423423",
  land_detail: "land_detail",

  ri: "1",
  ngan: "2",
  wa: "3",

  land_size: "land_size",
  land_code: "land_code",
  land_img: "land_img",
  land_price_rate: "land_price_rate",
  land_price: "land_price",
  land_type: "land_type",
  land_properties: "land_properties",
  land_water: "land_water",
  land_mineral: "land_mineral",
  land_limitation: "land_limitation",

  fileupload:null,
  //department: selectOptions[0],
});

const upload_image = () => {
  console.log("upload_image")
  //console.log(form.fileupload)
  const token = localStorage.getItem("tkfw");
  let formData = new FormData();
  let imagefile = document.querySelector('#imgInp');
  formData.append("file", imagefile.files[0]);
  //console.log(formData)
  axios.post(
      import.meta.env.VITE_API_ENDPOINT + "/api/image?imageableType=land",formData, 
      {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json'
        },
      }
    )
    .then((data) => {
      console.log(data);
      if (data.status == 201) {
        //console.log(data.status);
        form.land_img = data.data.url
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'อัพโหลดรูปสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        })
 
      } else {
        Swal.fire({
          position: 'top-end',
          icon: "warning",
          title: "ไม่สามารถอัพโหลดรูปได้",
          timer: 1500,
        });
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });

  const [file] = imgInp.files
  if (file) {
       blah.src = URL.createObjectURL(file)
  }
};

const submit = () => { 
  const token = localStorage.getItem("tkfw");
  console.log(token);
  console.log(form);
  axios
    .post(
      import.meta.env.VITE_API_ENDPOINT + "/api/geo",
      {
        title: form.title,
        detail: form.detail,
        lat: form.lat,
        lon: form.long,
        landImg: form.land_img,
        landDetail: form.land_detail,
        landSize: form.ri+"-"+form.ngan+"-"+form.wa,
        landCode: form.land_code,
        landPriceRate: form.land_price_rate,
        landPrice: form.land_price,
        landType: form.land_type,
        landProperties: form.land_properties,
        landWater: form.land_water,
        landMineral: form.land_mineral,
        landLimitation: form.land_limitation,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
    .then((data) => {
      console.log(data.data);
      if (data.data.status == 201) {
        console.log(data.data.status);
        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลภูมิศาสตร์ (ที่ดิน) สำเร็จ",
          timer: 2500,
          showConfirmButton: 1,
        });
        router.push("/geography");
      } else {
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถเพิ่มข้อมูลภูมิศาสตร์ได้",
          timer: 3000,
          showConfirmButton: 1,
        });
        return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  //
};
</script>

<template>
  <title-bar :title-stack="titleStack" />
  <!-- <hero-bar>Forms</hero-bar> -->

  <main-section>
    <!-- <title-sub-bar
      :icon="mdiBallotOutline"
      title="Forms example"
    /> -->
    <card-component
      title="กรอกข้อมูลภูมิศาสตร์ (ที่ดิน)"
      :icon="mdiBallot"
      form
      @submit.prevent="submit"
    >
      <field label="หัวข้อ" placeholder="กรอกชื่อหัวข้อ">
        <control
          v-model="form.title"
          type="text"
          placeholder="กรอกชื่อหัวข้อ"
        />
      </field>

      <field label="รายละเอียด">
        <control
          v-model="form.detail"
          type="text"
          placeholder="กรอกรายละเอียด"
        />
      </field>

      <field label="พิกัดที่ดิน" help="Latitude , Longitude">
        <control v-model="form.lat" type="text" placeholder="พิกัดละติจูด" />
        <control v-model="form.long" type="text" placeholder="พิกัดลองจิจูด" />
      </field>

      <!-- <field label="Dropdown">
        <control v-model="form.department" :options="selectOptions" />
      </field> -->

      <divider />

      <field label="รายละเอียดที่ดิน">
        <control
          v-model="form.land_detail"
          type="textarea"
          placeholder="กรอกข้อมูลรายละเอียดที่ดิน"
        />
      </field>

      <field label="ขนาดที่ดิน (ไร่-งาน-วา)">
        <control v-model="form.ri" type="text" placeholder="ไร่" />
        <control v-model="form.ngan" type="text" placeholder="งาน" />
        <control v-model="form.wa" type="text" placeholder="ตารางวา" />
      </field>

      <field label="เลขโฉนดที่ดิน">
        <control
          v-model="form.land_code"
          type="text"
          placeholder="กรอกเลขโฉนดที่ดิน"
        />
      </field>

      <field label="รูปภาพขอบเขตที่ดิน">
        <control
          type="file"
          placeholder="รูปภาพขอบเขตที่ดิน"
          name="imgInp"
          id="imgInp"
          @change="upload_image"
          v-model="form.fileupload"
        />
      </field>

      <div><img id="blah" src="/images/noimage.png" width="300" /></div>
      

      <field label="ราคาประเมิน (บาท/ตารางวา)">
        <control
          v-model="form.land_price_rate"
          type="text"
          placeholder="กรอกราคาประเมิน"
        />
      </field>

      <field label="ราคาประเมินทั้งแปลง">
        <control
          v-model="form.land_price"
          type="text"
          placeholder="ราคาประเมินทั้งแปลง"
        />
      </field>

      <field label="ชนิดของดิน">
        <control
          v-model="form.land_type"
          type="text"
          placeholder="ชนิดของดิน"
        />
      </field>

      <field label="คุณสมบัติของดิน">
        <control
          v-model="form.land_properties"
          type="text"
          placeholder="คุณสมบัติของดิน"
        />
      </field>
      <field label="แหล่งน้ำใกล้เคียง">
        <control
          v-model="form.land_water"
          type="text"
          placeholder="แหล่งน้ำใกล้เคียง"
        />
      </field>
      <field label="แหล่งแร่ธาตุใกล้เคียง">
        <control
          v-model="form.land_mineral"
          type="text"
          placeholder="แหล่งแร่ธาตุใกล้เคียง"
        />
      </field>
      <field label="ข้อจำกัดของดิน">
        <control
          v-model="form.land_limitation"
          type="text"
          placeholder="ข้อจำกัดของดิน"
        />
      </field>

      <divider />

      <jb-buttons>
        <jb-button type="submit" color="info" label="เพิ่ม" />
        <jb-button type="reset" color="info" outline label="รีเซต" />
      </jb-buttons>
    </card-component>
  </main-section>

  <!-- <titled-section> Custom elements </titled-section>

  <main-section>
    <card-component title="Custom elements" :icon="mdiBallotOutline">
      <field label="Checkbox" wrap-body>
        <check-radio-picker
          v-model="customElementsForm.checkbox"
          name="sample-checkbox"
          :options="{ lorem: 'Lorem', ipsum: 'Ipsum', dolore: 'Dolore' }"
        />
      </field>

      <divider />

      <field label="Radio" wrap-body>
        <check-radio-picker
          v-model="customElementsForm.radio"
          name="sample-radio"
          type="radio"
          :options="{ one: 'One', two: 'Two' }"
        />
      </field>

      <divider />

      <field label="Switch">
        <check-radio-picker
          v-model="customElementsForm.switch"
          name="sample-switch"
          type="switch"
          :options="{ one: 'One', two: 'Two' }"
        />
      </field>

      <divider />

      <file-picker v-model="customElementsForm.file" />
    </card-component>
  </main-section> -->

  <bottom-other-pages-section />
</template>
