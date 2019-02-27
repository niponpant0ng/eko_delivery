const Route = require('../model/route')
const NodeCache = require( "node-cache" );
const routeStorage = new NodeCache();

module.exports.save = (paths) => {
  const route = new Route()

  const nodeFrom = paths.substring(0, 1)
  const nodeTo = paths.substring(1, 2)
  const weight = parseInt(paths.substring(2, 3))

  route.addNode(nodeFrom)
  route.addNode(nodeTo)
  route.addEdge(nodeFrom, nodeTo, weight)

  routeStorage.set('route', route)

  return route
}

module.exports.calcCost = (from, to) => {
}