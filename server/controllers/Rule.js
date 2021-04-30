
const models = require('../models');

const { Rule } = models;

const makerPage = (req, res) => {
  Rule.RuleModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), rules: docs });
  });
};

const makeRule = (req, res) => {
  if (!req.body.name || !req.body.ruleOriginal || !req.body.ruleNew) {
    return res.status(400).json({ error: 'Halt! All fields are required.' });
  }

  const ruleData = {
    name: req.body.name,
    ruleOriginal: req.body.ruleOriginal,
    ruleNew: req.body.ruleNew,
    owner: req.session.account._id,
  };

  const newRule = new Rule.RuleModel(ruleData);

  const rulePromise = newRule.save();

  rulePromise.then(() => res.json({ redirect: '/maker' }));

  rulePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Rule already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return rulePromise;
};

const getRules = (request, response) => {
  const req = request;
  const res = response;

  return Rule.RuleModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ rules: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getRules = getRules;
module.exports.make = makeRule;
