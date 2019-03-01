const Route = require('../model/route')
const NodeCache = require( "node-cache" );
const routeStorage = new NodeCache();

module.exports.save = (paths) => {
  const route = new Route()

  paths.split(', ').forEach(path => {
    const nodeFrom = path.substring(0, 1)
    const nodeTo = path.substring(1, 2)
    const weight = parseInt(path.substring(2, 3))

    route.addNode(nodeFrom)
    route.addNode(nodeTo)
    route.addEdge(nodeFrom, nodeTo, weight)
  })

  routeStorage.set('route', route)

  return route
}

module.exports.calcCost = (routeExpect) => {
  const route = routeStorage.get('route')
  const routeDirections = routeExpect.split('-')

  if(isWrongCostRouteDirections(routeDirections)) throw new Error('Wrong direction')

  return calcCostEachDirection(route, routeDirections)
}

module.exports.calcPosibleDirection = (routeExpect) => calcPosible(routeExpect)
module.exports.calcPosibleDirectionWithLimit = (routeExpect, limit) => calcPosible(routeExpect, limit)

const calcPosible = (routeExpect, limit = 0) => {
  const route = routeStorage.get('route')
  const [ from, to ] = routeExpect.split('-')

  if(!from || !to) throw new Error('Wrong direction')

  return calcEachPosible(to, route, limit)(from, 0)
}

const isWrongCostRouteDirections = (routeDirections) => (routeDirections.length === 1) || (routeDirections.length === 2 && routeDirections[0] === routeDirections[1])

const calcCostEachDirection = (route, routeDirections) => {
  if(routeDirections.length === 1) return 0

  const direction = routeDirections.shift()
  const nextRoute = route.edges[direction].filter(edge => edge.node === routeDirections[0])[0]

  if(!nextRoute) throw new Error(`Not found direction from ${direction} to ${routeDirections[0]}`)

  return nextRoute.weight + calcCostEachDirection(route, routeDirections)
}

const calcEachPosible = (to, route, limit) => {
  let passedNodes = {}

  const _calcPosible = (currentNode, directionLength) => {
    let counting = 0
    passedNodes[currentNode] = passedNodes[currentNode] || []

    route.edges[currentNode]
      .map(direction => direction.node)
      .forEach(node => {
        if(node === to) {
          passedNodes[currentNode].push(node)
          if(limit === 0 || directionLength < limit) {
            counting += 1
          }
        } else {
          const isNotDuplicateEdgeNode = (passedNodes[currentNode].every(passedNode => passedNode !== node))
            && (!passedNodes[node] || passedNodes[node].every(passedNode => passedNode !== currentNode))

          if(isNotDuplicateEdgeNode) {
            passedNodes[currentNode].push(node)
            counting += _calcPosible(node, directionLength + 1)
          }
        }
      })

    return counting
  }

  return _calcPosible
}

module.exports.calcCheapestCost = (routeExpect) => {
  const route = routeStorage.get('route')
  const [ from, to ] = routeExpect.split('-')

  if(!from || !to) {
    throw new Error('Wrong direction')
  }

  const costings = calcEachCheapestCost(from, to, route)
  if(!costings.length) {
    throw new Error("Can't found cost to to node")
  }

  return Math.min(...costings)
}

const calcEachCheapestCost = (from, to, route) => {
  let passedNodes = {}
  let costings = []

  const calcCosting = (currentNode, cost) => {
    passedNodes[currentNode] = passedNodes[currentNode] || []

    route.edges[currentNode].forEach(({ node, weight }) => {
      if(node === to) {
        costings.push(cost + weight)
      } else {
        const isNotDuplicateEdgeNode = (passedNodes[currentNode].every(passedNode => passedNode !== node))
          && (!passedNodes[node] || passedNodes[node].every(passedNode => passedNode !== currentNode))

        if(isNotDuplicateEdgeNode) {
          passedNodes[currentNode].push(node)
          calcCosting(node, cost + weight)
        }
      }
    })

    return costings
  }

  return calcCosting(from, 0)
}