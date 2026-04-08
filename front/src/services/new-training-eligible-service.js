/**
 * Mock — elegíveis por agendamento (planejamento).
 * Cada item deve ter `schedules[]` com `{ newTrainingSchedule }` para não quebrar o .find do DMPeople.
 */
export const newTrainingEligibleService = {
  getByTraining(_trainingId, _withDeleted) {
    return Promise.resolve({
      data: [
        {
          _id: 'el-mock-1',
          personBond: 'pb1',
          person: { name: 'ALANNA STEFANI DOS SANTOS', document: '14131847737' },
          unity: 'u1',
          status: 'pending',
          schedules: []
        },
        {
          _id: 'el-mock-2',
          personBond: 'pb2',
          person: { name: 'ALEXANDRE FATTORI JUNIOR', document: '132312123321' },
          unity: 'u1',
          status: 'pending',
          schedules: []
        }
      ]
    })
  }
}
