const { calcCost } = require('../service/routeService')

module.exports = (req, res) => {
  res.json({ data: calcCost(req.params.path) })
}