const { save } = require('../../src/service/routeService')

describe('route service', () => {
  describe('save', () => {
    test('Should save route from A to B with weight is 1', () => {
      const route = save('AB1')

      expect(route.adjacent("A")).toHaveLength(1)
      expect(route.adjacent("A")[0]).toMatchObject({ node: 'B', weight: 1 })
    })
  })
})