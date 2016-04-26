'use strict';
var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var myQ          = require('myqnode').myQ;
var debug        = require('debug')('meshblu-myq')

var MESSAGE_SCHEMA = {
  type: 'object',
  properties: {
    open: {
      type: 'boolean',
      required: true
    }
  }
};

var OPTIONS_SCHEMA = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    deviceId: {
      type: 'string',
      required: true
    }
  }
};

function Plugin(){
  this.options = {};
  this.messageSchema = MESSAGE_SCHEMA;
  this.optionsSchema = OPTIONS_SCHEMA;
  return this;
}

util.inherits(Plugin, EventEmitter);

Plugin.prototype.onMessage = function(message){
  var payload = message.payload;
  this.updateMyQ(payload);
};

Plugin.prototype.onConfig = function(device){
  this.setOptions(device.options || {});
};

Plugin.prototype.setOptions = function(options){
  debug('setting options', options);
  this.options = options;
};

Plugin.prototype.updateMyQ = function(payload) {
  var self = this;
  var func = myQ.closeDoor;

  if(payload.open){
    func = myQ.openDoor;
  }

  debug('Updating ' + self.options.deviceId);
  func(self.options.userId, self.options.password, self.options.deviceId);
};

module.exports = {
  messageSchema: MESSAGE_SCHEMA,
  optionsSchema: OPTIONS_SCHEMA,
  Plugin: Plugin
};
