import * as _ from 'lodash'

export const unitsMonitoredFilter = (units, unitsHierarchy) => {
  const savedUnits = units || []

  const filter = (u) =>
    savedUnits.includes(u.referenceId) || !_.get(u, 'monitoringEndDate')

  const filterUnitsNotMonitored = (unity) => {
    unity.children = unity.children
      .filter(filter)
      .map(filterUnitsNotMonitored)
    return unity
  }

  return _.cloneDeep(unitsHierarchy)
    .filter(filter)
    .map(filterUnitsNotMonitored)
}
