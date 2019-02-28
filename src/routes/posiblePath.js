const { calcPosibleDirection } = require('../service/routeService')

module.exports = (req, res) => {
  res.json({ data: calcPosibleDirection(req.params.path) })
}