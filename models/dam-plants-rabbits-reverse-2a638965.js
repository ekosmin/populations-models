// Generated by CoffeeScript 1.7.1
(function() {
  var Agent, BasicAnimal, Environment, Events, Interactive, Rule, Species, ToolButton, Trait, env, helpers, plantSpecies, rabbitSpecies;

  helpers = require('helpers');

  Environment = require('models/environment');

  Species = require('models/species');

  Agent = require('models/agent');

  Rule = require('models/rule');

  Trait = require('models/trait');

  Interactive = require('interactive/interactive');

  Events = require('events');

  ToolButton = require('interactive/tool-button');

  BasicAnimal = require('models/basic-animal');

  plantSpecies = require('species/fast-plants-roots');

  rabbitSpecies = require('species/varied-rabbits');

  env = require('environments/dam');

  window.model = {
    showMessage: function(message, callback) {
      return helpers.showMessage(message, this.env.getView().view.parentElement, callback);
    },
    run: function() {
      this.interactive = new Interactive({
        environment: env,
        speedSlider: false,
        addOrganismButtons: [],
        toolButtons: [
          {
            type: ToolButton.INFO_TOOL
          }
        ]
      });
      document.getElementById('environment').appendChild(this.interactive.getEnvironmentPane());
      this.env = env;
      this.plantSpecies = plantSpecies;
      this.rabbitSpecies = rabbitSpecies;
      this._reset();
      return Events.addEventListener(Environment.EVENTS.RESET, (function(_this) {
        return function() {
          return _this._reset();
        };
      })(this));
    },
    _reset: function() {
      this.env.setBackground("images/environments/dam-rv-year0.png");
      this.damRemoved = false;
      this.env.setBarriers([[0, 240, 500, 50]]);
      this._setEnvironmentProperty('water', 10, true);
      this._setEnvironmentProperty('water', 0, false);
      this._addPlants();
      return this._addRabbits();
    },
    _addPlants: function() {
      var i, _i, _j, _results;
      for (i = _i = 0; _i < 105; i = ++_i) {
        this._createPlant((i % 3) + 1, true);
      }
      _results = [];
      for (i = _j = 0; _j < 35; i = ++_j) {
        _results.push(this._createPlant(3, false));
      }
      return _results;
    },
    _addRabbits: function() {
      var i, _i, _j, _results;
      for (i = _i = 0; _i < 60; i = ++_i) {
        this._createRabbit((i % 3) + 1, true);
      }
      _results = [];
      for (i = _j = 0; _j < 20; i = ++_j) {
        _results.push(this._createRabbit(3, false));
      }
      return _results;
    },
    _createPlant: function(size, north) {
      var loc, newPlant;
      newPlant = this.plantSpecies.createAgent();
      newPlant.set("growth rate", 0.04);
      newPlant.set("age of maturity", 10);
      newPlant.set("population size modifier", 0);
      newPlant.set("roots", size);
      loc = north ? this.env.randomLocationWithin(0, 0, 500, 250, true) : this.env.randomLocationWithin(0, 250, 500, 250, true);
      newPlant.setLocation(loc);
      return this.env.addAgent(newPlant);
    },
    _createRabbit: function(size, north) {
      var loc, newRabbit;
      newRabbit = this.rabbitSpecies.createAgent();
      newRabbit.set('age', 100);
      newRabbit.set("size", size);
      loc = north ? this.env.randomLocationWithin(0, 0, 500, 250, true) : this.env.randomLocationWithin(0, 250, 500, 250, true);
      newRabbit.setLocation(loc);
      return this.env.addAgent(newRabbit);
    },
    chartData1: null,
    chartData2: null,
    chart1: null,
    chart2: null,
    setupCharts: function() {
      var options1, options2, updateCounts;
      this.chartData1 = new google.visualization.DataTable();
      this.chartData2 = new google.visualization.DataTable();
      this._setupChartData(this.chartData1);
      this._setupChartData(this.chartData2);
      options1 = this._getChartOptions("top");
      options2 = this._getChartOptions("bottom");
      this.chart1 = new google.visualization.ColumnChart(document.getElementById('chart1'));
      this.chart2 = new google.visualization.ColumnChart(document.getElementById('chart2'));
      this.chart1.draw(this.chartData1, options1);
      this.chart2.draw(this.chartData2, options2);
      updateCounts = (function(_this) {
        return function() {
          var agent, counts, i, _i, _j, _len, _ref;
          counts = {
            top: [0, 0, 0, 0],
            bottom: [0, 0, 0, 0]
          };
          _ref = _this.env.agents;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            agent = _ref[_i];
            if (agent.species === _this.rabbitSpecies) {
              if (agent.getLocation().y < (_this.env.rows * _this.env._rowHeight) / 2) {
                counts.top[agent.get('size')] += 1;
              } else {
                counts.bottom[agent.get('size')] += 1;
              }
            }
          }
          for (i = _j = 0; _j <= 2; i = ++_j) {
            _this.chartData1.setValue(i, 1, counts.top[i + 1]);
            _this.chartData2.setValue(i, 1, counts.bottom[i + 1]);
          }
          _this.chart1.draw(_this.chartData1, options1);
          return _this.chart2.draw(_this.chartData2, options2);
        };
      })(this);
      updateCounts();
      return Events.addEventListener(Environment.EVENTS.STEP, updateCounts);
    },
    _setupChartData: function(chartData) {
      chartData.addColumn('string', 'Rabbit types');
      chartData.addColumn('number', 'Number of rabbits');
      chartData.addColumn({
        type: 'string',
        role: 'style'
      });
      return chartData.addRows([["Small", 0, "color: #FF0000"], ["Medium", 0, "color: #FF0000"], ["Big", 0, "color: #FF0000"]]);
    },
    _getChartOptions: function(titleMod) {
      var options;
      return options = {
        title: 'Rabbits in ' + titleMod + ' half of the field',
        hAxis: {
          title: 'Rabbit types'
        },
        vAxis: {
          title: 'Number of rabbits',
          minValue: 0,
          maxValue: 50,
          gridlines: {
            count: 6
          }
        },
        legend: {
          position: 'none'
        },
        width: 300,
        height: 250
      };
    },
    _agentsOfSpecies: function(species) {
      var a, set, _i, _len, _ref;
      set = [];
      _ref = this.env.agents;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        a = _ref[_i];
        if (a.species === species) {
          set.push(a);
        }
      }
      return set;
    },
    damRemoved: false,
    setupControls: function() {
      var bigHighlightRadio, mediumHighlightRadio, noneHighlightRadio, removeDamButton, smallHighlightRadio;
      removeDamButton = document.getElementById('remove-button');
      removeDamButton.onclick = (function(_this) {
        return function() {
          if (!_this.damRemoved) {
            _this.damRemoved = true;
            _this.env.date = Math.floor(10000 / Environment.DEFAULT_RUN_LOOP_DELAY) - 1;
            return _this.env.setBarriers([]);
          }
        };
      })(this);
      noneHighlightRadio = document.getElementById('highlight-none');
      smallHighlightRadio = document.getElementById('highlight-small');
      mediumHighlightRadio = document.getElementById('highlight-medium');
      bigHighlightRadio = document.getElementById('highlight-big');
      noneHighlightRadio.onclick = (function(_this) {
        return function() {
          return _this._highlight(-1);
        };
      })(this);
      smallHighlightRadio.onclick = (function(_this) {
        return function() {
          return _this._highlight(1);
        };
      })(this);
      mediumHighlightRadio.onclick = (function(_this) {
        return function() {
          return _this._highlight(2);
        };
      })(this);
      bigHighlightRadio.onclick = (function(_this) {
        return function() {
          return _this._highlight(3);
        };
      })(this);
      return Events.addEventListener(Environment.EVENTS.RESET, (function(_this) {
        return function() {
          return noneHighlightRadio.click();
        };
      })(this));
    },
    _highlight: function(size) {
      var agent, _i, _len, _ref, _results;
      _ref = this.env.agents;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        agent = _ref[_i];
        if (agent.species === this.rabbitSpecies) {
          _results.push(agent.set('glow', agent.get('size') === size));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    setupTimer: function() {
      var backgroundChangeable, changeInterval, waterLevel, waterLevelIndicator, yearSpan;
      backgroundChangeable = false;
      changeInterval = 10;
      waterLevel = 0;
      yearSpan = document.getElementById('year');
      waterLevelIndicator = document.getElementById('water-level-indicator');
      Events.addEventListener(Environment.EVENTS.STEP, (function(_this) {
        return function() {
          var t, waterLevelPct, year;
          if (!_this.damRemoved) {
            _this.env.date = 0;
            return;
          }
          t = Math.floor(_this.env.date * Environment.DEFAULT_RUN_LOOP_DELAY / 1000);
          year = t / changeInterval;
          waterLevel = Math.min(10, year);
          waterLevelPct = waterLevel * 10;
          _this._setEnvironmentProperty('water', waterLevel);
          waterLevelIndicator.style.height = "" + waterLevelPct + "%";
          if (t % changeInterval === 0 && backgroundChangeable) {
            _this._changeBackground(year);
            yearSpan.innerHTML = "" + year;
            return backgroundChangeable = false;
          } else if (t % changeInterval !== 0) {
            return backgroundChangeable = true;
          }
        };
      })(this));
      return Events.addEventListener(Environment.EVENTS.RESET, (function(_this) {
        return function() {
          yearSpan.innerHTML = "1";
          return waterLevelIndicator.style.height = "0%";
        };
      })(this));
    },
    _changeBackground: function(n) {
      if (!((0 < n && n < 11))) {
        return;
      }
      return this.env.setBackground("images/environments/dam-rv-year" + n + ".png");
    },
    _setAgentProperty: function(agents, prop, val) {
      var a, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = agents.length; _i < _len; _i++) {
        a = agents[_i];
        _results.push(a.set(prop, val));
      }
      return _results;
    },
    _setAgentProperty: function(agents, prop, val) {
      var a, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = agents.length; _i < _len; _i++) {
        a = agents[_i];
        _results.push(a.set(prop, val));
      }
      return _results;
    },
    _setEnvironmentProperty: function(prop, val, all) {
      var col, row, _i, _ref, _results;
      if (all == null) {
        all = false;
      }
      _results = [];
      for (row = _i = 0, _ref = this.env.rows; 0 <= _ref ? _i <= _ref : _i >= _ref; row = 0 <= _ref ? ++_i : --_i) {
        if (all || row > this.env.rows / 2) {
          _results.push((function() {
            var _j, _ref1, _results1;
            _results1 = [];
            for (col = _j = 0, _ref1 = this.env.columns; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; col = 0 <= _ref1 ? ++_j : --_j) {
              _results1.push(this.env.set(col, row, prop, val));
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    _addAgent: function(species, properties) {
      var agent, prop, _i, _len;
      if (properties == null) {
        properties = [];
      }
      agent = species.createAgent();
      agent.setLocation(this.env.randomLocation());
      for (_i = 0, _len = properties.length; _i < _len; _i++) {
        prop = properties[_i];
        agent.set(prop[0], prop[1]);
      }
      return this.env.addAgent(agent);
    },
    setupPopulationMonitoring: function() {
      return Events.addEventListener(Environment.EVENTS.STEP, (function(_this) {
        return function() {
          _this._setPlantGrowthRate();
          _this._setRabbitGrowthRate();
          if (Math.random() < 0.1) {
            return _this._makeLandFertile();
          }
        };
      })(this));
    },
    _plantsExist: false,
    _setPlantGrowthRate: function() {
      var adder, allPlants, plant, rootSize, varieties, variety, _i, _j, _len, _len1, _results;
      allPlants = this._agentsOfSpecies(this.plantSpecies);
      if (allPlants.length < 1) {
        this._plantsExist = false;
        return;
      } else {
        this._plantsExist = true;
      }
      varieties = [[], [], [], [], [], []];
      for (_i = 0, _len = allPlants.length; _i < _len; _i++) {
        plant = allPlants[_i];
        rootSize = plant.get("roots");
        adder = plant.getLocation().y > 250 ? 3 : 0;
        varieties[(rootSize - 1) + adder].push(plant);
      }
      _results = [];
      for (_j = 0, _len1 = varieties.length; _j < _len1; _j++) {
        variety = varieties[_j];
        _results.push(this._setGrowthRateForVariety(variety));
      }
      return _results;
    },
    _setRabbitGrowthRate: function() {
      var adder, allRabbits, rabbit, rabbitSize, varieties, variety, _i, _j, _len, _len1, _results;
      allRabbits = this._agentsOfSpecies(this.rabbitSpecies);
      varieties = [[], [], [], [], [], []];
      for (_i = 0, _len = allRabbits.length; _i < _len; _i++) {
        rabbit = allRabbits[_i];
        rabbitSize = rabbit.get("size");
        adder = rabbit.getLocation().y > 250 ? 3 : 0;
        varieties[(rabbitSize - 1) + adder].push(rabbit);
      }
      _results = [];
      for (_j = 0, _len1 = varieties.length; _j < _len1; _j++) {
        variety = varieties[_j];
        _results.push(this._dontLetRabbitsDie(variety));
      }
      return _results;
    },
    _setGrowthRateForVariety: function(plants) {
      var i, plant, plantSize, populationSizeModifier, _i, _len, _results;
      plantSize = plants.length;
      populationSizeModifier = 0.0;
      if (plantSize < 10) {
        populationSizeModifier = 0.7;
      } else if (plantSize < 15) {
        populationSizeModifier = 0.4;
      } else if (plantSize < 40) {
        populationSizeModifier = 0.1;
      } else if (plantSize < 60) {
        populationSizeModifier = 0.0;
      } else if (plantSize < 160) {
        populationSizeModifier = -0.02;
      } else if (plantSize < 190) {
        populationSizeModifier = -0.03;
      } else if (plantSize < 230) {
        populationSizeModifier = -0.05;
      } else {
        i = plantSize - 1;
        while (i > 0) {
          plants[i].die();
          i -= 5;
        }
      }
      _results = [];
      for (_i = 0, _len = plants.length; _i < _len; _i++) {
        plant = plants[_i];
        _results.push(plant.set("population size modifier", populationSizeModifier));
      }
      return _results;
    },
    _dontLetRabbitsDie: function(rabbits) {
      var age, isImmortal, matingDistance, maxOffspring, metabolism, rabbit, rabbitsSize, resourceConsumptionRate, _i, _len, _results;
      rabbitsSize = rabbits.length;
      maxOffspring = 6;
      matingDistance = 90;
      resourceConsumptionRate = 15;
      metabolism = 2;
      isImmortal = false;
      if (rabbitsSize < 3 && rabbitsSize > 0 && rabbits[0].get("size") === 3 && this._plantsExist) {
        maxOffspring = 12;
        matingDistance = 250;
        resourceConsumptionRate = 0;
        metabolism = 1;
        age = 30;
        isImmortal = true;
      } else if (rabbitsSize < 4 && rabbitsSize > 0 && rabbits[0].get("size") === 3 && this._plantsExist) {
        maxOffspring = 10;
        matingDistance = 170;
        resourceConsumptionRate = 1;
        metabolism = 1;
      } else if (rabbitsSize < 5 && rabbitsSize > 0 && rabbits[0].get("size") === 3) {
        maxOffspring = 9;
        matingDistance = 160;
        resourceConsumptionRate = 4;
        metabolism = 1;
      } else if (rabbitsSize < 6) {
        maxOffspring = 8;
        matingDistance = 140;
        resourceConsumptionRate = 5;
        metabolism = 1;
      } else if (rabbitsSize < 7) {
        maxOffspring = 7;
        matingDistance = 130;
        resourceConsumptionRate = 8;
        metabolism = 2;
      } else if (rabbitsSize < 20) {

      } else if (rabbitsSize < 25) {
        maxOffspring = 5;
        matingDistance = 80;
        resourceConsumptionRate = 16;
        metabolism = 3;
      } else if (rabbitsSize < 35) {
        maxOffspring = 2;
        matingDistance = 80;
        resourceConsumptionRate = 18;
        metabolism = 5;
      } else {
        maxOffspring = 0;
        resourceConsumptionRate = 18;
        metabolism = 9;
      }
      _results = [];
      for (_i = 0, _len = rabbits.length; _i < _len; _i++) {
        rabbit = rabbits[_i];
        rabbit.set("max offspring", maxOffspring);
        rabbit.set("mating distance", matingDistance);
        rabbit.set("resource consumption rate", resourceConsumptionRate);
        rabbit.set("metabolism", metabolism);
        _results.push(rabbit.set("is immortal", isImmortal));
      }
      return _results;
    },
    _makeLandFertile: function() {},
    preload: ["images/environments/dam-rv-year0.png", "images/environments/dam-rv-year1.png", "images/environments/dam-rv-year2.png", "images/environments/dam-rv-year3.png", "images/environments/dam-rv-year4.png", "images/environments/dam-rv-year5.png", "images/environments/dam-rv-year6.png", "images/environments/dam-rv-year7.png", "images/environments/dam-rv-year8.png", "images/environments/dam-rv-year9.png", "images/environments/dam-rv-year10.png"]
  };

  window.onload = function() {
    return helpers.preload([model, env, rabbitSpecies, plantSpecies], function() {
      model.run();
      model.setupControls();
      model.setupCharts();
      model.setupTimer();
      return model.setupPopulationMonitoring();
    });
  };

}).call(this);
