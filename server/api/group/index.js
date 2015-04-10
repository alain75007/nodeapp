'use strict';

var express = require('express');
var controller = require('./group.controller');
var auth = require('../../auth/auth.service')

var router = express.Router();

router.get('/user/:userId', auth.isAuthenticated(), controller.index);
router.get('/:id', controller.show);
router.post('/user/:userId', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
