const { save, calcCost, calcPosibleDirection } = require('../../src/service/routeService')

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

  describe('calcCost', () => {
    test('Should calc cost from A to B', () => {
      save('AB1')

      const cost = calcCost('A-B')

      expect(cost).toEqual(1)
    })

    test('Should calc cost from A to B to E', () => {
      save('AB1, BE3')

      const cost = calcCost('A-B-E')

      expect(cost).toEqual(4)
    })

    test('Should calc cost from A to B to E to C to B', () => {
      save('AB1, BE3, EC2, CB1')

      const cost = calcCost('A-B-E-C-B')

      expect(cost).toEqual(7)
    })

    test('Should calc cost is error when route not found', () => {
      save('AB1, BE3')

      expect(() => calcCost('A-B-C')).toThrow('Not found direction from B to C')
    })

    test('Should calc cost is error when from to to route is same', () => {
      save('AB1, BE3')

      expect(() => calcCost('A-A')).toThrow('Wrong direction')
    })

    test('Should error wrong direction', () => {
      expect(() => calcCost('A')).toThrowError()
      expect(() => calcCost('')).toThrowError()
      expect(() => calcCost('A-')).toThrowError()
    })
  })

  describe('calcPosibleDirection', () => {
    test('Should calc posible is 1 when direction from A to B', () => {
      save('AB1')

      const posibleAmount = calcPosibleDirection('A-B')

      expect(posibleAmount).toEqual(1)
    })

    test('Should calc posible is 1 when direction from A to E', () => {
      save('AB1, BE3')

      const posibleAmount = calcPosibleDirection('A-E')

      expect(posibleAmount).toEqual(1)
    })

    test('Should calc posible is 1 when direction from A to E', () => {
      save('AB1, BC3, CE3')

      const posibleAmount = calcPosibleDirection('A-E')

      expect(posibleAmount).toEqual(1)
    })

    test('Should calc posible is 2 when direction from A to C', () => {
      save('AB1, BC3, BD2, DC1')

      const posibleAmount = calcPosibleDirection('A-C')

      expect(posibleAmount).toEqual(2)
    })

    test('Should calc posible is 2 when direction from A to C but some direction is cyclic direction', () => {
      save('AB1, BC3, BD2, DB6, DC1')

      const posibleAmount = calcPosibleDirection('A-C')

      expect(posibleAmount).toEqual(2)
    })

    test('Should calc posible is 2 when direction from E to D but some node is a via direction from many node to another node', () => {
      save('AB1, BE3, EF2, AC6, CD1, DE1')

      const posibleAmount = calcPosibleDirection('A-F')

      expect(posibleAmount).toEqual(2)
    })

    test('Should calc posible is 2 when direction from A to C but some direction is not adjacent cyclic direction', () => {
      save('EA2, AB1, AD1, AB2, BE1')

      const posibleAmount = calcPosibleDirection('E-D')

      expect(posibleAmount).toEqual(1)
    })
  })
})