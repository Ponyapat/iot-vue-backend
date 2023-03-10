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

const states = reactive({
  users: {},
});
const fetchData = () => {
  ApiMain.get("/users?order=ASC&page=" + (currentPage.value + 1) + "&take=" + perPage.value)
    .then((data) => {
      console.log("DEBUG", data.data.data, data.data);
      states.users = data.data.data;
      items.value = data.data.meta.itemCount;
    })
    .catch((error) => {
      console.log(error);
    });
};

onBeforeMount(() => {
  fetchData();
});

const edit = (id) => {
  router.push("/user/edit/" + id);
};
const del = (id) => {
  console.log("Delete", id);
  Swal.fire({
    title: "ยืนยันการลบ",
    text: "คุณต้องการลบ Admin ท่านนี้ใช่หรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ok",
  }).then((result) => {
    console.log("result", result);
    if (result.isConfirmed) {
      console.log("ยืนยันการลบ");
      // ส่งการลบไปยัง data base
      ApiMain.delete("/users/" + id)
        .then((data) => {
          setInterval(function () {
            location.reload();
          }, 1500);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};
const onChangeActive = (id, isActive) => {
  if (isActive == 1) {
    isActive = 0;
  } else if (isActive == 0) {
    isActive = 1;
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
    console.log("DEBUG:", id, isActive, result);
    if (result.isConfirmed) {
      //console.log("confirmed");
      ApiMain.put("/users/" + id + "/update-status", {
        isActive: isActive,
      }).then((data) => {
        console.log(data);
        fetchData();
        // location.reload();
      });
    }
  });
};

const pageNext = (page) => {
  currentPage.value = page;
  //console.log("pageNext " + (page+1));
  ApiMain.get(
    "/users?order=ASC&page=" + (page + 1) + "&take=" + perPage.value
  ).then((data) => {
    states.users = data.data.data;
  });
};
const nextPage = () => {
  let x = currentPage.value++;
  let pagelist = pagesList.value;
  if (x < pagelist.slice(-1)[0]) {
    ApiMain.get("/users?order=ASC&page=" + (x + 1) + "&take=" + perPage.value)
      .then((data) => {
        states.users = data.data.data;
      });
  }
  else {
    currentPage.value = pagelist.slice(-1)[0];
  }
};
const previousPage = () => {
  let x = currentPage.value--;
  if (x > 0) {
    ApiMain.get("/users?order=ASC&page=" + (x + 1) + "&take=" + perPage.value).then((data) => {
      states.users = data.data.data;
    });
  }
  else {
    currentPage.value = 0;
  }
};

const lastPage = () => {
  let pagelist = pagesList.value;
  currentPage.value = pagelist.slice(-1)[0];
  ApiMain.get("/users?order=ASC&page=" + (currentPage.value+1)  + "&take=" + perPage.value).then((data) => {
      states.users = data.data.data;
    });
};
const firstPage = () => {
  let pagelist = pagesList.value;
  console.log(pagelist[0]);
  currentPage.value = pagelist[0];

  ApiMain.get("/users?order=ASC&page=" + (currentPage.value+1)  + "&take=" + perPage.value).then((data) => {
      states.users = data.data.data;
    });
};
const pages = computed(() => {
    let numShown = 10; // This sets the number of page tabs
    let pagelist = pagesList.value ;
    numShown = Math.min(numShown, pagelist.length);

    let first = (currentPage.value) - Math.floor(numShown / 2);

    first = Math.max(first, 1);

    first = Math.min(first, pagelist.length - numShown + 1);
    return [...Array(numShown)].map((k,i) => i + first);
});
const statusText = (value) => {
  if (!value) {
    return "";
  } else if (value === "1") {
    return "Admin";
  } else if (value === "2") {
    return "Super Admin";
  }
};

</script>
<template>
  <div>
    <table>
      <thead class="bg-gray-700 text-white">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in states.users"
          :key="index"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
        >
          <td data-label="#">
            {{ index + 1 }}
          </td>
          <td class="p-3" data-label="Name">
            {{ user.name }}
          </td>
          <td class="p-3" data-label="E-mail">
            {{ user.email }}
          </td>
          <td class="p-3 text-gray-500" data-label="Role">
            {{ user.role ? user.role.name : "" }}
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
              <jb-button
                color="info"
                :icon="mdiGreasePencil"
                small
                @click="edit(user.id)"
              />
              <jb-button
                color="danger"
                :icon="mdiTrashCan"
                small
                @click="del(user.id)"
              />
            </jb-buttons>
          </td>
        </tr>
      </tbody>
    </table>
    <nav :class="lightBorderStyle" aria-label="Page navigation example" class="py-2 mx-3 lg:mx-6 border-t border-b ">
    <ul class="inline-flex items-center -space-x-px">
      <li @click="firstPage">
        <a href="#"
          class="flex flex-row  px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-l-lg">
          <i class="fa-solid fa-less-than  text-sm"></i>
          <i class="fa-solid fa-less-than  text-sm"></i>
        </a>
      </li>
      <li @click="previousPage">
        <a href="#"
          class="block px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-500 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:hover:bg-gray-700 dark:hover:text-white">
          <span class="sr-only">Previous</span>
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" class="fill-white dark:fill-white"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"></path>
          </svg>
        </a>
      </li>
      <li v-for="item in pages" :key="item" :class="{ active: item == currentPage+1}"
        @click="pageNext(item-1)" class=" px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-400 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white">
        <a href="#">{{item}}</a>
      </li>
      <li @click="nextPage">
        <a href="#"
        class="block px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-500 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:hover:bg-gray-700 dark:hover:text-white">
          <span class="sr-only">Next</span>
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFF" fill-rule="evenodd" class="fill-white dark:fill-white"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"></path>
          </svg>
        </a>
      </li>
      <li @click="lastPage">
        <a href="#"
        class="flex flex-row  px-2 py-2 ml-0 leading-tight text-white bg-gray-600 border border-gray-300  hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-white dark:text-white dark:hover:bg-gray-700 dark:hover:text-white rounded-r-lg">
          <i class="fa-solid fa-greater-than text-sm"></i>
          <i class="fa-solid fa-greater-than text-sm"></i>
        </a>
      </li>
    </ul>
    <small class="ml-4 text-sm font-medium">Page {{ currentPageHuman }} of {{ numPages }}</small>
  </nav>
  </div>
</template>
<style scoped>

li.active,li.active:hover {
  background-color: rgb(48, 48, 48);
  color: white;
}
</style>
