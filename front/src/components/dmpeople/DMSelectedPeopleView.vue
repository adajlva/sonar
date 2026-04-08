<template>
  <div class="d-flex flex-column justify-content-center">
    <div v-if="value && value.length > 0" role="group" tabindex="-1" class="b-form-tags form-control h-auto">
      <ul class="b-form-tags-list list-unstyled mb-0 d-flex flex-wrap align-items-center">
        <li
          v-for="person in pagedValues"
          :key="person._id"
          class="badge b-form-tag d-inline-flex align-items-baseline mw-100 badge-secondary"
          :style="{
            cursor: canRemove(person) ? 'pointer' : 'not-allowed',
          }"
        >
          <span :id="person._id" class="b-form-tag-content flex-grow-1 text-truncate">{{ getPeopleResult(person) }}
            <button
              aria-keyshortcuts="Delete"
              type="button"
              :disabled="disabledDeleteButton || !canRemove(person)"
              aria-label="Remove tag"
              class="close b-form-tag-remove close-tag"
              :style="{
                cursor: canRemove(person) ? 'pointer' : 'not-allowed',
              }"
              @click="onDeletePerson(person)"
            >
              {{ canRemove(person) ? "×" : "-" }}
            </button>
          </span>
          <b-tooltip v-if="!canRemove(person)" :target="person._id" triggers="hover" style="white-space: nowrap">
            {{ $t("estecolaboradornaopodeserremovido") }}
          </b-tooltip>
        </li>
      </ul>
    </div>

    <div v-if="totalPages > 1" class="my-1 col-sm-12 col-md-12">
      <ul class="pagination my-0 b-pagination pagination-sm justify-content-center flex-wrap">
        <li
          v-for="n in totalPages"
          :key="n"
          role="presentation"
          class="page-item"
          :class="{
            active: n === page,
          }"
          @click="setPage(n)"
        >
          <button
            role="menuitemradio"
            type="button"
            aria-controls="researchPlanningTable"
            :aria-label="'Go to page ' + n"
            :aria-checked="n === page"
            aria-posinset="1"
            aria-setsize="1"
            :tabindex="n === page ? 0 : -1"
            class="page-link"
          >
            {{ n }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DMSelectedPeopleView',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    perPage: {
      type: Number,
      default: 50
    },
    disabledDeleteButton: {
      type: Boolean,
      default: false
    },
    canRemoveFromOtherUnity: {
      type: Boolean,
      default: true
    },
    unities: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      page: 1
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.value.length / this.perPage)
    },
    pagedValues() {
      return this.value.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      )
    }
  },
  watch: {
    value() {
      if (this.totalPages > 0 && this.page > this.totalPages) {
        this.page = this.totalPages
      }
    }
  },
  methods: {
    getPeopleResult({ person }) {
      return person.document ? person.name + ' - ' + person.document : person.name
    },
    onDeletePerson(deleted) {
      const newSelectedPeople = this.value.filter(
        ({ person }) => person._id !== deleted.person._id
      )
      this.$emit('input', newSelectedPeople)
      this.$emit('removed', deleted)
    },
    setPage(page) {
      this.page = page
    },
    canRemove(person) {
      if (this.canRemoveFromOtherUnity) return true
      else {
        return this.unities.includes(person.unity)
      }
    }
  }
}
</script>

<style>
.close-tag {
  color: inherit;
  font-size: 125%;
  line-height: 1;
  float: none;
  margin-left: 0.25rem;
}
</style>
