<template>
  <div style="width: 100%; text-align: left" class="poppins">
    <autocomplete
      v-if="canBeChange"
      ref="autocompletePerson"
      auto-select
      :search="(term) => filterPeople(term)"
      :debounce-time="500"
      :placeholder="
        $t('cliqueparaselecionar') +
          ' ' +
          $t('umoumais') +
          ' ' +
          $t('colaboradoresmin')
      "
      @submit="submit"
    >
      <template
        #default="{
          rootProps,
          inputProps,
          inputListeners,
          resultListProps,
          resultListListeners,
          results,
          resultProps,
        }"
      >
        <div v-bind="rootProps">
          <input ref="input" v-bind="inputProps" v-on="inputListeners">

          <ul
            ref="resultList"
            v-bind="resultListProps"
            v-on="resultListListeners"
          >
            <li class="px-3 py-3">
              <b-form-checkbox
                v-model="toggleSelectAll"
                @change="onToggleSelectAll"
              >
                {{ $t("marcartodos") }}
              </b-form-checkbox>
            </li>

            <template v-for="(result, index) in results">
              <slot
                v-if="!result.hide && !result.disabled"
                name="result"
                :result="result"
                :props="resultProps[index]"
              >
                <li :key="resultProps[index].id" v-bind="resultProps[index]">
                  {{ getResultValue(result) }}
                </li>
              </slot>
              <slot
                v-if="result.disabled"
                name="result"
                :result="result"
                :props="resultProps[index]"
              >
                <p :key="1" style="text-align: center">
                  {{ result.text }}
                </p>
              </slot>
            </template>
          </ul>
        </div>
      </template></autocomplete>

    <div
      style="
        border: 0.5px solid rgb(189 189 189);
        border-radius: 5px;
        margin: 20px 0;
        height: 375px;
        overflow: scroll;
        z-index: 1000;
      "
    >
      <b-table
        thead-class="d-none"
        :items="personsToShow"
        show-empty
        striped
        :fields="fields"
        details-td-class="x"
      >
        <template v-slot:empty>
          {{ $t("semregistros") }}
        </template>

        <template v-if="canBeChange" v-slot:cell(actions)="row">
          <div :id="String('button-' + row.index)">
            <b-button
              size="sm"
              class="mr-1"
              variant="outline-danger"
              :disabled="!canRemove(row.item)"
              @click="peopleRemoved(row.item)"
            >
              <b-icon icon="trash" variant="danger" />
            </b-button>
          </div>

          <b-tooltip
            v-if="!canRemove(row.item)"
            :target="String('button-' + row.index)"
            triggers="hover"
          >
            {{ $t("estecolaboradornaopodeserremovido") }}
          </b-tooltip>
        </template>
      </b-table>
    </div>

    <p class="number-employees">
      {{ $t("totaldecolaboradores") + ": " + schedule.addedPersonBonds.length }}
    </p>
  </div>
</template>
<script>
/* Planejamento muta o mesmo objeto de agenda que o pai (schedules[i]); alinhar com emit exigiria refatorar TrainingPlanning. */
/* eslint-disable vue/no-mutating-props */
import { getByFilterAndName } from '@/services/person-bond-service'
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'
import { hideLoader, showLoader } from '@/utils/loading'

export default {
  name: 'FilterPeopleModal',
  props: {
    schedule: { required: true, type: Object },
    unities: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      toggleSelectAll: false
    }
  },
  computed: {
    ...mapGetters(['userClient']),
    ...mapState({
      newTrainingRegister: (state) => state.newTrainingRegister.newTraining
    }),
    fields() {
      return [
        { key: 'person.name', tdClass: 'full-width' },
        { key: 'actions' }
      ]
    },
    canBeChange() {
      const schedule = this.newTrainingRegister.schedules.find(
        (scdl) => scdl._id === this.schedule._id
      )

      return (
        !schedule.startDate ||
        moment(new Date()).isBefore(moment(new Date(schedule.startDate)))
      )
    },
    personsToShow() {
      return this.schedule.addedPersonBonds.filter((person) => {
        const scheduleStatusIsScheduled = this.schedule.status === 'scheduled'
        const newTrainingEligibleDeleted = person.newTrainingEligible.deleted

        return !scheduleStatusIsScheduled || !newTrainingEligibleDeleted
      })
    }
  },
  methods: {
    getResultValue(result) {
      return result.person.name + ' - ' + result.person.document
    },
    async filterPeople(term) {
      if (!this.canBeChange) return

      const bonds = this.newTrainingRegister.bonds || []
      const positions = this.newTrainingRegister.positions || []
      const roles = this.newTrainingRegister.positionRoles || []
      const unityIds =
        this.unities && this.unities.length
          ? [...this.unities]
          : [...(this.newTrainingRegister.unities || [])]

      if (term) {
        term = term.trim()
      } else term = ''

      const { data } = await getByFilterAndName(
        this.userClient,
        20,
        1,
        term,
        {
          bonds,
          positions: positions.map((p) =>
            typeof p === 'object' && p ? p._id : p
          ),
          roles: roles.map((r) => (typeof r === 'object' && r ? r._id : r)),
          unities: unityIds
        },
        'person._id person.name person.document admissionDate dismissalDate bond position unity role',
        this.schedule.addedPersonBonds.map((participant) => participant._id)
      )

      if (data.docs.length) {
        this.toggleSelectAll = false
        return data.docs
      }

      this.toggleSelectAll = true
      return [
        { disabled: true, text: this.$t('nenhumcolaboradorencontrado') }
      ]
    },
    submit(person) {
      const selection = person ? person._id : null
      if (this.lastSelection !== selection) {
        this.lastSelection = selection
        this.onSelectPerson(person)
      }
    },

    onSelectPerson(bondSelected) {
      if (bondSelected) {
        if (
          !this.schedule.addedPersonBonds.find(
            (bond) => bond._id === bondSelected._id
          )
        ) {
          this.schedule.addedPersonBonds.push({
            _id: bondSelected._id,
            person: bondSelected.person,
            unity: bondSelected.unity,
            newTrainingEligible: {
              deleted: false
            }
          })

          this.schedule.removedPersonBonds =
            this.schedule.removedPersonBonds.filter(
              (removedId) => removedId !== bondSelected._id
            )
        }
        this.$refs.autocompletePerson.handleInput({
          target: { value: '' }
        })
      }
    },

    peopleRemoved(people) {
      this.schedule.addedPersonBonds = this.schedule.addedPersonBonds.filter(
        (person) => person._id !== people._id
      )
      this.schedule.removedPersonBonds.push(people._id)
    },

    canRemove(person) {
      return this.unities.includes(person ? person.unity : '')
    },

    unselectAll() {
      this.schedule.addedPersonBonds = []
      this.$refs.autocompletePerson.handleInput({
        target: { value: '' }
      })
    },

    async selectAll() {
      showLoader()
      try {
        if (!this.canBeChange) return

        const bonds = this.newTrainingRegister.bonds || []
        const positions = this.newTrainingRegister.positions || []
        const roles = this.newTrainingRegister.positionRoles || []
        const unityIds =
          this.unities && this.unities.length
            ? [...this.unities]
            : [...(this.newTrainingRegister.unities || [])]

        const { data } = await getByFilterAndName(
          this.userClient,
          null,
          null,
          '',
          {
            bonds,
            positions: positions.map((p) =>
              typeof p === 'object' && p ? p._id : p
            ),
            roles: roles.map((r) => (typeof r === 'object' && r ? r._id : r)),
            unities: unityIds
          },
          'person._id person.name person.document admissionDate dismissalDate bond position unity role',
          this.schedule.addedPersonBonds.map((participant) => participant._id)
        )

        const docs = data.docs != null ? data.docs : data
        for (const doc of docs) {
          this.submit(doc)
        }
      } catch (e) {
        this.$emit('alert', {
          message: this.$t('errocarregarelegiveis'),
          type: 'danger'
        })
      } finally {
        hideLoader()
      }
    },

    async onToggleSelectAll(toggle) {
      if (toggle) {
        await this.selectAll()
      } else {
        this.unselectAll()
      }

      this.$refs.autocompletePerson.handleInput({
        target: { value: this.lastKeyword }
      })
    }
  }
}
</script>
<style>
.full-width {
  width: 100%;
}

.number-employees {
  color: #53933a;
  font-size: 14px;
  font-weight: bold;
}
</style>
