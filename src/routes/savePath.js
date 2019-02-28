const { save } = require('../service/routeService')

module.exports = (req, res) => {
  res.json({ data: save(req.body) })
}