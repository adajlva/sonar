<template>
  <div>
    <b-form-input
      v-model="searchText"
      :placeholder="$t('informenome')"
      type="text"
      autocomplete="nope"
      @input="debounceSearch"
    />
    <b-list-group v-if="suggestions.length > 0" class="autocomplete-suggestions">
      <b-list-group-item
        v-for="person in suggestions"
        :key="person._id"
        button
        @click="selectPerson(person)"
      >
        {{ person.name }} — {{ person.document }}
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: 'AsyncPersonAutocomplete',
  props: {
    id: {
      type: String,
      default: 'person-autocomplete'
    }
  },
  data() {
    return {
      searchText: '',
      suggestions: [],
      timer: null
    }
  },
  methods: {
    debounceSearch() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // Stub: emit null when empty
        if (!this.searchText) {
          this.$emit('onSelected', null)
        }
      }, 500)
    },
    selectPerson(person) {
      this.searchText = person.name
      this.suggestions = []
      this.$emit('onSelected', person)
    }
  }
}
</script>

<style scoped>
.autocomplete-suggestions {
  position: absolute;
  z-index: 1000;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
