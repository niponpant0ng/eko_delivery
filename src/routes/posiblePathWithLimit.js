const { calcPosibleDirectionWithLimit } = require('../service/routeService')

module.exports = (req, res) => {
  res.json({ data: calcPosibleDirectionWithLimit(req.params.path, req.params.limit) })
}