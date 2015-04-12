/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');

exports.register = function(socket) {
  Message.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Message.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  doc
  .populate('_creator', '_id name', function(err, doc) { 
    var tag = '/groups/' + doc.group + '/messages:save';
    socket.emit(tag, doc);
    console.log('emit to ' + tag);
    console.log(doc);
  });
  //socket.emit('message:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('message:remove', doc);
}
