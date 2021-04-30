const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;
const _ = require('underscore');

let RuleModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const RuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  ruleOld: {
    type: String,
    trim: true,
    required: true,
  },

  ruleNew: {
    type: String,
    trim: true,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

RuleSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  ruleOld: doc.ruleOld,
  ruleNew: doc.ruleNew,
});

RuleSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return RuleModel.find(search).select('name ruleOld ruleNew').lean().exec(callback);
};

RuleModel = mongoose.model('Rule', RuleSchema);

module.exports.RuleModel = RuleModel;
module.exports.RuleSchema = RuleSchema;
