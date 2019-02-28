const Route = require('../model/route')
const NodeCache = require( "node-cache" );
const routeStorage = new NodeCache();

const isWrongRouteDirections = (routeDirections) => routeDirections.length === 2 && routeDirections[0] === routeDirections[1]

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

  if(isWrongRouteDirections(routeDirections)) throw new Error('Wrong direction')

  return calcCostEachDirection(route, routeDirections)
}

const calcCostEachDirection = (route, routeDirections) => {
  if(routeDirections.length === 1) return 0

  const direction = routeDirections.shift()
  const nextRoute = route.edges[direction].filter(edge => edge.node === routeDirections[0])[0]

  if(!nextRoute) throw new Error(`Not found direction from ${direction} to ${routeDirections[0]}`)

  return nextRoute.weight + calcCostEachDirection(route, routeDirections)
}

module.exports.calcPosibleDirection = (routeExpect) => {
  const route = routeStorage.get('route')
  const [ from, to ] = routeExpect.split('-')

  return calcPosible(to, route, from, {})
}

const calcPosible = (to, route, currentNode, passedNodes) => {
  let counting = 0

  if(!passedNodes[currentNode]) passedNodes[currentNode] = []

  route.edges[currentNode]
    .map(direction => direction.node)
    .forEach(node => {
      passedNodes[currentNode].push(node)

      if(node === to) {
        counting += 1
      } else {
        const isNotDuplicateEdgeNode = !passedNodes[node] || passedNodes[node].every(passedNode => passedNode !== currentNode)
        if(isNotDuplicateEdgeNode)
          counting += calcPosible(to, route, node, passedNodes)
      }
    })

  return counting
}