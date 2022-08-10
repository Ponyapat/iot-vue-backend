<script setup>
import { mdiCog, mdiPlus } from "@mdi/js";
import { useMainStore } from "@/stores/main";
import { computed } from "vue";
import Icon from "@/components/Icon.vue";

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  headerIcon: {
    type: String,
    default: null,
  },
  rounded: {
    type: String,
    default: "md:rounded",
  },
  hasTable: Boolean,
  empty: Boolean,
  form: Boolean,
  hoverable: Boolean,
  modal: Boolean,
  addlink: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["header-icon-click", "submit"]);

const is = computed(() => (props.form ? "form" : "div"));

const mainStore = useMainStore();

const lightBorderStyle = computed(() => mainStore.lightBorderStyle);

const componentClass = computed(() => {
  const base = [
    props.rounded,
    lightBorderStyle.value,
    props.modal ? "dark:bg-gray-900" : "dark:bg-gray-900/70",
  ];

  if (props.hoverable) {
    base.push("hover:shadow-lg transition-shadow duration-500");
  }

  return base;
});

const computedHeaderIcon = computed(() => props.headerIcon ?? mdiCog);

const headerIconClick = () => {
  emit("header-icon-click");
  console.log(props.addlink);
};

const submit = (e) => {
  emit("submit", e);
};
</script>

<template>
  <component
    :is="is"
    :class="componentClass"
    class="bg-white border dark:border-gray-800"
    @submit="submit"
  >
    <header
      v-if="title"
      :class="lightBorderStyle"
      class="flex items-stretch border-b dark:border-gray-800"
    >
      <p
        class="flex items-center py-3 grow font-bold"
        :class="[icon ? 'px-4' : 'px-6']"
      >
        <icon v-if="icon" :path="icon" class="mr-3" />
        {{ title }}
      </p>
      <!-- <a
        v-if="computedHeaderIcon"
        href="#"
        class="flex items-center py-3 px-4 justify-center ring-blue-700 focus:ring"
        aria-label="more options"
        @click.prevent="headerIconClick"
      >
        <icon :path="computedHeaderIcon" />
      </a> -->

      <router-link v-if="addlink != null" :to="addlink">
        <button
          class="bg-green-700 hover:bg-green-900 text-white font-bold m-2 py-2 px-4 rounded"
        >
          เพิ่ม ​{{title}}
          <!-- {{ title }} -->
        </button>
      </router-link>

      <!-- <a
        v-if="addlink != null"
        href="#"
        class="flex items-center py-3 px-4 justify-center ring-blue-700 focus:ring"
        aria-label="more options"
        @click.prevent="headerIconClick"
      >
        <icon :path="computedHeaderIcon" />
      </a> -->
    </header>
    <div
      v-if="empty"
      class="text-center py-24 text-gray-500 dark:text-gray-400"
    >
      <p>Nothing's here…</p>
    </div>
    <div v-else :class="{ 'p-6': !hasTable }">
      <slot />
    </div>
  </component>
</template>
