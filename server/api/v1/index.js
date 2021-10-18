const router = require('express').Router();

router.route('/usuarios').get((req, res, next) => {
    res.json({
        message: 'GET todos los usuarios',
    });
});

module.exports = router;