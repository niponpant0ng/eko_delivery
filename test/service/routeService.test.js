const { save, calcCost, calcPosibleDirection, calcPosibleDirectionWithLimit, calcCheapestCost, clear } = require('../../src/service/routeService')

describe('route service', () => {
  afterEach(() => {
    clear()    
  })

  describe('save', () => {
    test('Should save route from A to B with weight is 1', () => {
      const route = save('AB10')

      expect(route.getNodes()).toEqual(
        expect.arrayContaining(['A', 'B'])
      )
      expect(route.adjacent("A")).toHaveLength(1)
      expect(route.adjacent("A")[0]).toMatchObject({ node: 'B', weight: 10 })
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

    test('Should error routes are empty', () => {
      expect(() => calcCost('A-B')).toThrowError()
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

    test('Should error when from or to direction are empty', () => {
      expect(() => calcPosibleDirection()).toThrowError()
      expect(() => calcPosibleDirection('A')).toThrowError()
      expect(() => calcPosibleDirection('A-')).toThrowError()
    })

    test('Should error routes are empty', () => {
      expect(() => calcCost('A-B')).toThrowError()
    })
  })

  describe('calcPosibleDirectionWithLimit', () => {
    test('Should calc posible is 1 when direction from A to B not out of limit', () => {
      save('AB1, BC2, CD3')

      const posibleAmount = calcPosibleDirectionWithLimit('A-D', 4)

      expect(posibleAmount).toEqual(1)
    })

    test('Should calc posible is 0 when direction from A to I out of limit', () => {
      save('AB1, BC2, CD3, DE1, EF4, FG3, GH0, HI4')

      const posibleAmount = calcPosibleDirectionWithLimit('A-I', 2)

      expect(posibleAmount).toEqual(0)
    })

    test('Should error routes are empty', () => {
      expect(() => calcCost('A-B')).toThrowError()
    })
  })

  describe('calcCheapestCost', () => {
    test('Should calc cost is 6 when direction from A to D', () => {
      save('AB1, BC2, CD3')

      const posibleAmount = calcCheapestCost('A-D')

      expect(posibleAmount).toEqual(6)
    })

    test('Should calc cost is 2 when there are direction from A to D', () => {
      save('AD2, AB1, BC2, CD3')

      const posibleAmount = calcCheapestCost('A-D')

      expect(posibleAmount).toEqual(2)
    })

    test('Should calc cost is 2 when there are direction from A to D and some direction is cyclic direction', () => {
      save('AD2, AB1, BC2, CD3, DA1')

      const posibleAmount = calcCheapestCost('A-D')

      expect(posibleAmount).toEqual(2)
    })

    test('Should error wrong direction', () => {
      expect(() => calcCheapestCost('A')).toThrowError()
      expect(() => calcCheapestCost('')).toThrowError()
      expect(() => calcCheapestCost('A-')).toThrowError()
    })

    test('Should error when there is not direction to reach to to node', () => {
      save('AD2, AB1, BC2, CD3, DA1')

      expect(() => calcCheapestCost('A-G')).toThrowError()
    })

    test('Should error routes are empty', () => {
      expect(() => calcCost('A-B')).toThrowError()
    })
  })
})