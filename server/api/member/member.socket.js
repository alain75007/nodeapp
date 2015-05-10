/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Member = require('./member.model');

exports.register = function(socket) {
  Member.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Member.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('member:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('member:remove', doc);
}