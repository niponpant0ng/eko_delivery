const { save } = require('../../src/service/routeService')

describe('route service', () => {
  describe('save', () => {
    test('Should save route from A to B with weight is 1', () => {
      const route = save('AB1')

      expect(route.getNodes()).toEqual(
        expect.arrayContaining(['A', 'B'])
      )
      expect(route.adjacent("A")).toHaveLength(1)
      expect(route.adjacent("A")[0]).toMatchObject({ node: 'B', weight: 1 })
    })

    test('Should save route from A to B with weight is 1 and from C to D with weight is 3', () => {
      const route = save('AB1, CD3')

      expect(route.getNodes()).toEqual(
        expect.arrayContaining(['A', 'B', 'C', 'D'])
      )
      expect(route.adjacent("A")).toHaveLength(1)
      expect(route.adjacent("A")[0]).toMatchObject({ node: 'B', weight: 1 })
      expect(route.adjacent("C")).toHaveLength(1)
      expect(route.adjacent("C")[0]).toMatchObject({ node: 'D', weight: 3 })
    })

    test('Should save route from A to B with weight is 1 and from A to D with weight is 3', () => {
      const route = save('AB1, AD3')

      expect(route.getNodes()).toEqual(
        expect.arrayContaining(['A', 'B', 'D'])
      )
      expect(route.adjacent("A")).toHaveLength(2)
      expect(route.adjacent("A")[0]).toMatchObject({ node: 'B', weight: 1 })
      expect(route.adjacent("A")[1]).toMatchObject({ node: 'D', weight: 3 })
    })
  })
})