const express   = require('express');
const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require('../swagger.json');

const router = express.Router();

router.use('/', swaggerUi.serve);
router.get('/', (req, res, next) => {
  const swaggerWithHost = {
    ...swaggerDocument,
    host: req.get('host'),
    schemes: [req.protocol],
  };

  return swaggerUi.setup(swaggerWithHost)(req, res, next);
});

module.exports = router;
