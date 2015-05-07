'use strict';

var express = require('express');
var controller = require('./group.controller');
var messageController = require('../message/message.controller');
var auth = require('../../auth/auth.service')

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', controller.show);
router.get('/:groupId/messages', auth.isAuthenticated(), messageController.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', controller.update);
//router.post('/:id/users/:user_id', auth.isAuthenticated(), controller.addUsers);
router.post('/:id/emails', auth.isAuthenticated(), controller.addEmails);
router.patch('/:id', controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
