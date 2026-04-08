import moment from 'moment'

export const generateYearOptions = () => {
  const years = []
  const currentYearMoreFive = moment().add(5, 'years').year()

  for (let year = 2023; year <= currentYearMoreFive; year++) {
    years.unshift({
      value: year,
      text: year.toString()
    })
  }

  return years
}
