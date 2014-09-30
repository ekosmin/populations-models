// Generated by CoffeeScript 1.7.1
(function() {
  var Environment, Rule, col, env, row, _i, _j;

  Environment = require('models/environment');

  Rule = require('models/rule');

  env = new Environment({
    columns: 60,
    rows: 52,
    imgPath: "images/environments/mountains1.jpg",
    seasonLengths: [30, 30, 20, 5],
    barriers: [[0, 0, 39, 520], [561, 0, 39, 520]],
    wrapEastWest: false,
    wrapNorthSouth: false
  });

  for (col = _i = 0; _i <= 60; col = ++_i) {
    for (row = _j = 0; _j <= 52; row = ++_j) {
      env.set(col, row, "sunlight", 6);
    }
  }

  env.addRule(new Rule({
    action: function(agent) {
      var diff, health, size, sunlight;
      size = agent.get('size');
      sunlight = agent.get('sunlight');
      diff = Math.abs((11 - size) - sunlight);
      health = 1 - (diff / 20.0);
      return agent.set('health', health);
    }
  }));

  env.addRule(new Rule({
    action: function(agent) {
      var health;
      health = agent.get('health');
      return agent.set('chance of flowering', (health > 0.99 ? 1 : 0));
    }
  }));

  env.addRule(new Rule({
    test: function(agent) {
      var season;
      season = agent.get('season');
      return agent.get('health') > 0.9 && (season === "spring" || season === "summer");
    },
    action: function(agent) {
      return agent.set('is immortal', true);
    }
  }));

  env.addRule(new Rule({
    test: function(agent) {
      return agent.get('season') === "fall";
    },
    action: function(agent) {
      return agent.set('is immortal', false);
    }
  }));

  require.register("environments/sunlight-mountain", function(exports, require, module) {
    return module.exports = env;
  });

}).call(this);