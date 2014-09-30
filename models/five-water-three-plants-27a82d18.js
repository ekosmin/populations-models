// Generated by CoffeeScript 1.7.1
(function() {
  var Agent, Environment, Events, Interactive, Rule, Species, ToolButton, Trait, env, helpers, plantSpecies;

  helpers = require('helpers');

  Environment = require('models/environment');

  Species = require('models/species');

  Agent = require('models/agent');

  Rule = require('models/rule');

  Trait = require('models/trait');

  Interactive = require('interactive/interactive');

  ToolButton = require('interactive/tool-button');

  Events = require('events');

  plantSpecies = require('species/varied-plants');

  env = require('environments/water-flowerboxes');

  window.model = {
    run: function() {
      plantSpecies.defs.CAN_SEED = false;
      this.interactive = new Interactive({
        environment: env,
        addOrganismButtons: [
          {
            species: plantSpecies,
            imagePath: "images/agents/varied-plants/buttons/seedpack_x.png",
            traits: [
              new Trait({
                name: "root size",
                "default": 1
              }), new Trait({
                name: "size",
                "default": 5
              })
            ]
          }, {
            species: plantSpecies,
            imagePath: "images/agents/varied-plants/buttons/seedpack_y.png",
            traits: [
              new Trait({
                name: "root size",
                "default": 5
              }), new Trait({
                name: "size",
                "default": 5
              })
            ]
          }, {
            species: plantSpecies,
            imagePath: "images/agents/varied-plants/buttons/seedpack_z.png",
            traits: [
              new Trait({
                name: "root size",
                "default": 10
              }), new Trait({
                name: "size",
                "default": 5
              })
            ]
          }
        ],
        toolButtons: [
          {
            type: ToolButton.INFO_TOOL
          }, {
            type: ToolButton.CARRY_TOOL
          }
        ]
      });
      document.getElementById('environment').appendChild(this.interactive.getEnvironmentPane());
      this.env = env;
      return this.plantSpecies = plantSpecies;
    },
    setupDialogs: function() {
      var messageShown, showMessage;
      messageShown = false;
      showMessage = (function(_this) {
        return function(message) {
          if (!messageShown) {
            helpers.showMessage(message, _this.env.getView().view.parentElement);
            return messageShown = true;
          }
        };
      })(this);
      Events.addEventListener(Environment.EVENTS.RESET, (function(_this) {
        return function() {
          return messageShown = false;
        };
      })(this));
      Events.addEventListener(Environment.EVENTS.AGENT_ADDED, (function(_this) {
        return function(evt) {
          if (evt.detail.agent.get('age') === 0) {
            return messageShown = false;
          }
        };
      })(this));
      return Events.addEventListener(Environment.EVENTS.STEP, (function(_this) {
        return function() {
          var agent, numWilted, numXFlowers, numYFlowers, numZFlowers, roots, _i, _len, _ref;
          numWilted = 0;
          numXFlowers = 0;
          numYFlowers = 0;
          numZFlowers = 0;
          _ref = _this.env.agents;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            agent = _ref[_i];
            if (agent.get('age') <= agent.species.defs.MATURITY_AGE) {
              return;
            }
            if (agent.get("health") < 0.99) {
              numWilted++;
            }
            if (agent.get("has flowers")) {
              roots = agent.get("root size");
              if (roots === 5) {
                numXFlowers++;
              } else if (roots === 10) {
                numYFlowers++;
              } else {
                numZFlowers++;
              }
            }
          }
          if (numXFlowers >= 3 && numYFlowers >= 3 && numZFlowers >= 3) {
            if (numWilted === 0) {
              return showMessage("Good job! All your plants are in the right boxes.<br/>Take a picture of your model and continue on.");
            } else {
              if (numWilted > 1) {
                return showMessage("You've got lots of healthy plants, but still a few wilted ones! Can you work out where they should go?");
              } else {
                return showMessage("You've got lots of healthy plants, but still one wilted one! Can you work out where it should go?");
              }
            }
          } else if (numWilted > 0) {
            if (numWilted > 1) {
              return showMessage("Uh oh, " + numWilted + " of your plants are wilted! Try to find the right environment for them using the Carry button.");
            } else {
              return showMessage("Uh oh, one of your plants is wilted! Try to find the right environment for it using the Carry button.");
            }
          }
        };
      })(this));
    },
    preload: ["images/agents/varied-plants/buttons/seedpack_x.png", "images/agents/varied-plants/buttons/seedpack_y.png", "images/agents/varied-plants/buttons/seedpack_z.png"]
  };

  window.onload = function() {
    return helpers.preload([model, env, plantSpecies], function() {
      model.run();
      return model.setupDialogs();
    });
  };

}).call(this);
