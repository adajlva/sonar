export const newTrainingTypeToi18nKey = (type) => {
  switch (type) {
    case 'schedules':
      return 'agendamentos'

    case 'days_after_the_start_service':
      return 'diasaposiniciodaprestacaodeservicos'
  }
}

export const newTrainingTypes = Object.freeze({
  schedules: 'schedules',
  daysAfterTheStartService: 'days_after_the_start_service'
})
