const { save } = require('../service/routeService')

module.exports = (req, res) => {
  res.json(save(req.body))
}