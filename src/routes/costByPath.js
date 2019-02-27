const { calcCost } = require('../service/routeService')

module.exports = (req, res) => {
  res.json({ 'cost': calcCost(req.params.path) })
}