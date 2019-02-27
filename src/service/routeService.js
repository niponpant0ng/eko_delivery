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

  return calcCostEachDirection(route, routeDirections)
}

const calcCostEachDirection = (route, routeDirections) => {
  if(routeDirections.length === 1) return 0

  const direction = routeDirections.shift()
  const nextRoute = route.edges[direction].filter(edge => edge.node === routeDirections[0])[0]

  if(!nextRoute) throw new Error(`Not found direction from ${direction} to ${routeDirections[0]}`)

  return nextRoute.weight + calcCostEachDirection(route, routeDirections)
}