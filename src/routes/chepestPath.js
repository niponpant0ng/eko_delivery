const { calcCheapestCost } = require('../service/routeService')

module.exports = (req, res) => {
  res.json({ data: calcCheapestCost(req.params.path) })
}