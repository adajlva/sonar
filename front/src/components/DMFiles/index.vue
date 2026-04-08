<template>
  <div>
    <b-modal id="modalFiles" ref="modalFiles" size="lg" hide-footer :title="$t('arquivo')">
      <ul v-if="filesToView.length" class="list-unstyled mb-0">
        <li v-for="(f, i) in filesToView" :key="i" class="py-1 border-bottom">
          {{ f.originalName || f.name || f.fileName || '—' }}
        </li>
      </ul>
      <p v-else class="text-muted mb-0">{{ $t('na') }}</p>
    </b-modal>

    <b-form-group v-if="showInput" label-for="files">
      <template v-slot:label>
        <DMLabelRequired v-if="required" :label="label" />
        <DMLabel v-if="!required" :label="$t(label)" />
      </template>

      <b-form-file
        v-model="localFiles"
        class="dm-files--input"
        :state="Boolean(localFiles)"
        :multiple="multiple"
        :disabled="disabled"
        :accept="accept"
        enctype="multipart/form-data"
        :placeholder="$t('escolhaarquivos')"
        :drop-placeholder="$t('arquivo') + '...'"
        :required="required"
        @input="$emit('input', localFiles)"
      />
    </b-form-group>
    <div v-if="validFiles" class="mt-2 dm-files__lista-files">
      <b-col v-for="(file, i) in validFiles" :key="i" md="12" sm="12" class="px-0">
        <b-form-group>
          <DMLabel v-if="hideAfterInput" :label="$t(hidePlaceholder)" />
          <b-input-group>
            <b-form-input :value="file.originalName" type="text" readonly />
            <b-input-group-append v-if="canShowFile">
              <b-button variant="outline-primary" style="z-index: 0;" @click="viewFile(file)"><b-icon
                icon="eye-fill"
                variant="primary"
              /></b-button>
            </b-input-group-append>
            <b-input-group-append>
              <b-button variant="outline-danger" style="z-index: 0;" @click="remove(i)"><b-icon
                icon="trash"
                variant="danger"
              /></b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </div>
  </div>
</template>

<script>
import { hideLoader, showLoader } from '@/utils/loading'
import * as storageService from '../../services/storage-service'
import DMLabel from '../DMLabel'
import DMLabelRequired from '../DMLabelRequired'
export default {
  name: 'DMArquivos',
  components: {
    DMLabel,
    DMLabelRequired
  },
  props: {
    reference: { type: String, default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    files: { type: Array, default: () => [] },
    multiple: { type: Boolean, default: true },
    label: { type: String, default: '' },
    accept: { type: String, default: null },
    showLoader: { type: Boolean, default: true },
    canShowFile: { type: Boolean, default: false },
    hideAfterInput: { type: Boolean, default: false },
    hidePlaceholder: { type: String, default: '' }
  },
  data() {
    return {
      localFiles: [],
      filesToView: []
    }
  },
  computed: {
    validFiles() {
      return this.files.filter(({ _id }) => _id)
    },
    showInput() {
      return this.hideAfterInput ? this.validFiles.length === 0 : true
    }
  },
  mounted() {
    this.$root.$on('savefiles', this.save)
  },
  methods: {
    async save({ path, files }) {
      if (this.showLoader) showLoader()
      try {
        for (const file of files) {
          if (!file.id) {
            const formData = new FormData()
            formData.append('file', file)
            await storageService.upload(formData, path)
          }
        }
      } catch (error) {
        console.error('[ERRO AO SALVAR ARQUIVOS]', error)
      } finally {
        if (this.showLoader) hideLoader()
      }
    },
    async viewFile(file) {
      try {
        showLoader()
        this.filesToView = [file]
        this.$root.$emit('bv::show::modal', 'modalFiles')
      } finally {
        hideLoader()
      }
    },
    clear() {
      this.localFiles = []
    },
    remove(index) {
      this.$emit('remove', index)
    }
  }
}
</script>

<style lang="scss">
.dm-files {
  display: flex;
  flex-direction: column;
}
</style>
