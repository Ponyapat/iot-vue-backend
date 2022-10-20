<script setup>
import { computed, ref, onBeforeMount, reactive, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import { useRouter } from "vue-router";
import JbButtons from "@/components/JbButtons.vue";
import JbButton from "@/components/JbButton.vue";
import Level from "@/components/Level.vue";
import CheckRadioPicker from "@/components/CheckRadioPicker.vue";
import { mdiTrashCan, mdiGreasePencil } from "@mdi/js";
import Swal from "sweetalert2";
import axios from "axios";

const mainStore = useMainStore();

const router = useRouter();

const lightBorderStyle = computed(() => mainStore.lightBorderStyle);

const tableTrStyle = computed(() => mainStore.tableTrStyle);

const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle);

const darkMode = computed(() => mainStore.darkMode);

const items = ref(0);

const perPage = ref(10);

const currentPage = ref(0);


const numPages = computed(() => {
  return Math.ceil(items.value / perPage.value);
});

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }

  return pagesList;
});

const token = localStorage.getItem("tkfw");

const states = reactive({
  users: {},
});
const fetchData = () => {
  axios
    .get(import.meta.env.VITE_API_MAIN + "/api/users", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((data) => {
      console.log('DEBUG', data.data.data, data.data);
      states.users = data.data.data;
      items.value = data.data.meta.itemCount;
    })
    .catch((error) => {
      console.log(error);
    });
}

onBeforeMount(() => {
  fetchData()
  // axios
  //   .get(import.meta.env.VITE_API_MAIN + "/api/users", {
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //   })
  //   .then((data) => {
  //     console.log('DEBUG', data.data.data);
  //     states.users = data.data.data;
  //   //   items.value = data.data.meta.itemCount;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
});

const edit = (id) => {
  // console.log('Edit', id)
  router.push("/user/edit/" + id);
}
const del = (id) => {
  console.log('Delete', id)
  Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบ Admin ท่านนี้ใช่หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    console.log('result', result)
    if (result.isConfirmed) {
      console.log('ยืนยันการลบ')
      // ส่งการลบไปยัง data base
      axios
        .delete(import.meta.env.VITE_API_MAIN + "/api/users/" + id, {
          headers: {
            Authorization: "Bearer " + token
          }
        })
        .then((data) => {
          setInterval(function () {
            location.reload();
          }, 1500);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          // console.log("del" + id);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  })
}
const onChangeActive = (id, isActive) => {
  if (isActive == 1) {
    isActive = 0
  } else if (isActive == 0) {
    isActive = 1
  }
  Swal.fire({
    title: "ยืนยันการเปลี่ยนสถานะ",
    text: "คุณต้องการเปลี่ยนสถานะ Admin ท่านนี้ใช่หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    console.log('DEBUG:', id, isActive, result)
    if (result.isConfirmed) {
      console.log('confirmed')
      axios
        .put(import.meta.env.VITE_API_MAIN+"/api/users/"+id+"/update-status",
          {
            isActive: isActive
          },
          {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        ).then((data) => {
          console.log(data)
          fetchData()
          // location.reload();
        })
    }
  })
}

const pageNext = (page) => {
  currentPage.value = page;
  //console.log("pageNext " + (page+1));
  axios
    .get(import.meta.env.VITE_API_MAIN + "/api/users?order=ASC&page="+(page+1)+"&take="+perPage.value, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((data) => {
      states.users = data.data.data;
    });
}
const statusText = (value) => {
  if (!value) {
    return ''
  } else if (value === '1') {
    return 'Admin'
  } else if (value === '2') {
    return 'Super Admin'
  }
}

</script>
<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <!-- <th>Admin ID</th> -->
          <th>Username</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in states.users" :key="index" :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']">
          <td data-label="#">
            {{ index + 1 }}
          </td>
          <!-- <td data-label="ID" class="p-3">
            {{ user.id }}
          </td> -->
          <td class="p-3" data-label="Username">
            {{ user.username }}
          </td>
          <td class="p-3" data-label="Name">
            {{ user.name }}
          </td>
          <td class="p-3" data-label="E-mail">
            {{ user.email }}
          </td>
          <td class="p-3 text-gray-500" data-label="Role">
            {{ user.role ? user.role.name : '' }}
          </td>
          <td class="p-3" data-label="Status">
            <check-radio-picker
              v-model="user.isActive"
              name="sample-switch"
              type="switch"
              @click.prevent="onChangeActive(user.id, user.isActive)"
            />
          </td>
          <td class="actions-cell">
            <jb-buttons type="justify-start lg:justify-end" no-wrap>
              <jb-button color="info" :icon="mdiGreasePencil" small @click="edit(user.id)" />
              <jb-button color="danger" :icon="mdiTrashCan" small @click="del(user.id)"/>
            </jb-buttons>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      :class="lightBorderStyle"
      class="p-3 lg:px-6 border-t dark:border-gray-800"
    >
      <level>
        <jb-buttons>
          <jb-button
            v-for="page in pagesList"
            :key="page"
            :active="page === currentPage"
            :label="page + 1"
            :outline="darkMode"
            small
            @click="pageNext(page)"
          />
        </jb-buttons>
        <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
      </level>
    </div>
  </div>
</template>
