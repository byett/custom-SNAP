/* This file defines the physics engine extending Snap */

"use strict";

modules.physics = "2018-June-16";

// ------- PhysicsMorph -------

function PhysicsMorph(physicsBody) {
  this.init(physicsBody);
}

PhysicsMorph.prototype = new Morph();
PhysicsMorph.prototype.constructor = PhysicsMorph;
PhysicsMorph.uber = Morph.prototype;

PhysicsMorph.prototype.init = function (physicsBody) {
  this.physicsBody = physicsBody;
  PhysicsMorph.uber.init.call(this);
};


// ------- TestMorph -------

function TestMorph() {
    this.init();
}

TestMorph.prototype = new Morph();
TestMorph.prototype.constructor = TestMorph;
TestMorph.uber = Morph.prototype;

TestMorph.prototype.init = function () {
    TestMorph.uber.init.call(this);
};


// ------- SpriteMorph -------

SpriteMorph.prototype.initPhysicsBlocks = function () {
  var physicsBlocks = {
    simulationTime: {
      type: "reporter",
      category: "simulation",
      spec: "time in s",
      concepts: ["simulation_time"]
    },
    deltaTime: {
      type: "reporter",
      category: "simulation",
      spec: "\u2206t in s",
      concepts: ["delta_time"]
    },
    setDeltaTime: {
      type: "command",
      category: "simulation",
      spec: "set \u2206t to %n in s",
      defaults: [0],
      concepts: ["delta_time"]
    },
    doSimulationStep: {
      type: "hat",
      category: "simulation",
      spec: "simulation_step"
    },
    startSimulation: {
      type: "command",
      category: "simulation",
      spec: "start simulation"
    },
    stopSimulation: {
      type: "command",
      category: "simulation",
      spec: "stop simulation"
    },
    runSimulationSteps: {
      type: "command",
      category: "simulation",
      spec: "run simulation step"
    },
    getPhysicsAttrOf: {
      type: "reporter",
      category: "simulation",
      spec: "%phy of %spr",
      defaults: [
        ["x position"]
      ]
    },
    setPhysicsAttrOf: {
      type: "command",
      category: "simulation",
      spec: "set %phy of %spr to %n",
      defaults: [
        ["x position"], null, [0]
      ]
    }
  };

  var spriteBlocks = SpriteMorph.prototype.blocks,
    watcherLabels = SnapSerializer.prototype.watcherLabels;

  for (var key in physicsBlocks) {
    spriteBlocks[key] = physicsBlocks[key];
    if (physicsBlocks[key].type === "reporter") {
      watcherLabels[key] = physicsBlocks[key].spec;
    }
  }
};

SpriteMorph.prototype.categories.push('simulation');
SpriteMorph.prototype.blockColor.simulation = new Color(100, 140, 250);

SpriteMorph.prototype.initPhysicsBlocks();

SpriteMorph.prototype.phyInitBlocks = SpriteMorph.prototype.initBlocks;
SpriteMorph.prototype.initBlocks = function () {
  SpriteMorph.prototype.phyInitBlocks();
  SpriteMorph.prototype.initPhysicsBlocks();
};

SpriteMorph.prototype.phyInit = SpriteMorph.prototype.init;
SpriteMorph.prototype.init = function (globals) {
  this.phyInit(globals);
  this.physicsMode = "";
  this.physicsBody = null;
  this.physicsMass = 100;
  this.customConceptValues = {};
};

// -------- test block setup---------------
SpriteMorph.prototype.initTestBlocks = function () {
    var testBlocks = {
        testBlock: {
            type: "reporter",
            category: "test",
            spec: "test_value",
            concepts: ["if any"]
        },
        setTest: {
            type: "command",
            category: "test",
            spec: "set test to %n",
            defaults: [0],
            concepts: ["if any"]
        }
    };

    var spriteBlocks = SpriteMorph.prototype.blocks,
        watcherLabels = SnapSerializer.prototype.watcherLabels;

    for (var key in testBlocks) {
        spriteBlocks[key] = testBlocks[key];
        if (testBlocks[key].type === "reporter") {
            watcherLabels[key] = testBlocks[key].spec;
        }
    }
};

SpriteMorph.prototype.categories.push('test');
SpriteMorph.prototype.blockColor.test = new Color(100, 160, 250);

SpriteMorph.prototype.initTestBlocks();

SpriteMorph.prototype.testInitBlocks = SpriteMorph.prototype.initBlocks;
SpriteMorph.prototype.initBlocks = function () {
    SpriteMorph.prototype.testInitBlocks();
    SpriteMorph.prototype.initTestBlocks();
};
//---testblock setup end-----------

SpriteMorph.prototype.getStage = function () {
  var stage = this.parentThatIsA(StageMorph);
  if (!stage) {
    var hand = this.parentThatIsA(HandMorph);
    if (hand.world instanceof WorldMorph &&
      hand.world.children[0] instanceof IDE_Morph &&
      hand.world.children[0].stage instanceof StageMorph) {
      stage = hand.world.children[0].stage;
    }
  }
  return stage;
};

SpriteMorph.prototype.startSimulation = function () {
  var stage = this.getStage();
  if (stage) {
    stage.startSimulation();
  }
};

SpriteMorph.prototype.stopSimulation = function () {
  var stage = this.getStage();
  if (stage) {
    stage.stopSimulation();
  }
};

SpriteMorph.prototype.deltaTime = function () {
  var stage = this.getStage();
  return (stage && stage.deltaTime()) || 0;
};

SpriteMorph.prototype.setDeltaTime = function (dt) {
  var stage = this.getStage();
  if (stage) {
    stage.setDeltaTime(dt);
  }
};

SpriteMorph.prototype.simulationTime = function () {
  var stage = this.getStage();
  return (stage && stage.simulationTime()) || 0;
};

SpriteMorph.prototype.allHatBlocksForSimulation = function () {
    return this.scripts.children.filter(function (morph) {
        return morph.selector === "doSimulationStep";
    });
};

//------------Testblock implementation----------

SpriteMorph.prototype.testBlock = function () {
    var stage = this.getStage();
    return (stage && stage.testBlock()) || 0;
};

SpriteMorph.prototype.setTest = function (dt) {
    var stage = this.getStage();
    if (stage) {
        stage.setTest(dt);
    }
};


// ------- StageMorph -------

StageMorph.prototype.phyInit = StageMorph.prototype.init;
StageMorph.prototype.init = function (globals) {
    this.phyInit(globals);

    this.physicsRunning = false;
    this.physicsSimulationTime = 0;
    this.physicsLastUpdated = null;
    this.physicsDeltaTime = 0;
    this.targetDeltaTime = 0;
    this.physicsFloor = null;
    this.physicsScale = 10;
    this.physicsOrigin = new Point(0, 0);
    this.physicsAxisAngle = 0;

    this.testBlockvalue = 0;
};

StageMorph.prototype.updateScaleMorph = function () {
    if (this.scaleMorph) {
        this.scaleMorph.destroy();
    }

    var height = this.physicsScale * this.scale * 2.0; // two meters
    this.scaleMorph = new SymbolMorph("robot", height, new Color(120, 120, 120, 0.1));
    this.add(this.scaleMorph);
    this.scaleMorph.setPosition(this.bottomRight().subtract(new Point(5 + height * 0.96, 5 + height)));
};

StageMorph.prototype.setPhysicsScale = function (scale) {
    var rel = this.physicsScale / scale;

    this.physicsWorld.bodies.forEach(function (body) {
        body.position[0] = body.position[0] * rel;
        body.position[1] = body.position[1] * rel;
        body.aabbNeedsUpdate = true;

        body.velocity[0] = body.velocity[0] * rel;
        body.velocity[1] = body.velocity[1] * rel;

        body.shapes.forEach(function (shape) {
            shape.position[0] = shape.position[0] * rel;
            shape.position[1] = shape.position[1] * rel;

            if (shape.vertices) {
                shape.vertices.forEach(function (vertex) {
                    vertex[0] = vertex[0] * rel;
                    vertex[1] = vertex[1] * rel;
                });
            }
        });
    });

    this.physicsScale = scale;
    this.updateScaleMorph();

    var ide = this.parentThatIsA(IDE_Morph);
    if (ide && ide.currentTab === 'simulation' && ide.currentSprite === this) {
        ide.spriteEditor.physicsScale.refresh();
    }
};

StageMorph.prototype.phyStep = StageMorph.prototype.step;
StageMorph.prototype.step = function () {
    this.phyStep();
    if (this.isSimulationRunning()) {
        this.simulationStep();
    }
};

StageMorph.prototype.isSimulationRunning = function () {
    return this.physicsRunning;
};

StageMorph.prototype.startSimulation = function (norefresh) {
    this.physicsSimulationTime = 0;
    this.physicsRunning = true;
    this.physicsLastUpdated = Date.now();
    //this.clearGraphData();

    if (!norefresh) {
        var ide = this.parentThatIsA(IDE_Morph);
        if (ide && ide.controlBar.physicsButton) {
            ide.controlBar.physicsButton.refresh();
        }
    }
};

StageMorph.prototype.stopSimulation = function (norefresh) {
    this.physicsRunning = false;

    if (!norefresh) {
        var ide = this.parentThatIsA(IDE_Morph);
        if (ide && ide.controlBar.physicsButton) {
            ide.controlBar.physicsButton.refresh();
        }
    }
};

StageMorph.prototype.phyFireGreenFlagEvent = StageMorph.prototype.fireGreenFlagEvent;
StageMorph.prototype.fireGreenFlagEvent = function () {
    var r = this.phyFireGreenFlagEvent();
    // this.physicsSimulationTime = 0;
    // this.clearGraphData();
    return r;
};

StageMorph.prototype.phyFireStopAllEvent = StageMorph.prototype.fireStopAllEvent;
StageMorph.prototype.fireStopAllEvent = function () {
    var r = this.phyFireStopAllEvent();
    this.stopSimulation();
    return r;
};

StageMorph.prototype.phyAdd = StageMorph.prototype.add;
StageMorph.prototype.add = function (morph) {
    this.phyAdd(morph);
    if (morph.updatePhysicsBody) {
        morph.updatePhysicsBody();
    }
};

StageMorph.prototype.deltaTime = function () {
    return this.physicsDeltaTime;
};

StageMorph.prototype.setDeltaTime = function (dt) {
    this.targetDeltaTime = Math.max(dt || 0, 0);
    this.physicsDeltaTime = this.targetDeltaTime;
};

StageMorph.prototype.simulationTime = function () {
    return this.physicsSimulationTime;
};

StageMorph.prototype.simulationStep = function () {
    var i, delta, time,
        hats = this.allHatBlocksForSimulation();

    this.children.forEach(function (morph) {
        if (morph.allHatBlocksForSimulation) {
            hats = hats.concat(morph.allHatBlocksForSimulation());
        }
    });

    for (i = 0; i < hats.length; i++) {
        if (this.threads.findProcess(hats[i])) {
            return false; // step is still running
        }
    }

    time = Date.now(); // in milliseconds
    if (this.physicsLastUpdated) {
        delta = (time - this.physicsLastUpdated) * 0.001;

        if (this.targetDeltaTime + 0.01 < delta) {
            if (this.targetDeltaTime > 0.0) {
                delta = this.targetDeltaTime;
            } else if (delta > 0.2) {
                delta = 0.2;
            }

            //this.recordGraphData();

            this.physicsLastUpdated = time;
            this.physicsDeltaTime = delta;
            this.physicsSimulationTime += delta;
            //this.physicsWorld.step(delta);
            //this.updateMorphicPosition();
            for (i = 0; i < hats.length; i++) {
                this.threads.startProcess(hats[i], this.isThreadSafe);
            }
        }
    } else {
        this.physicsLastUpdated = time;
    }

    return true;
};

StageMorph.prototype.allHatBlocksForSimulation = SpriteMorph.prototype.allHatBlocksForSimulation;


//------------Testblock implementation---------
StageMorph.prototype.testBlock = function () {
    return this.testBlockvalue;
};

StageMorph.prototype.setTest = function (dt) {
    this.targetTestValue = Math.max(dt || 0, 0);
    this.testBlockvalue = this.targetTestValue;
};


// ------- ProcessMorph -------

Process.prototype.runSimulationSteps = function () {
    var stage = this.homeContext.receiver.parentThatIsA(StageMorph);
    if (stage && stage.simulationStep()) {
        this.popContext();
        this.pushContext('doYield');
    } else {
        this.context.inputs = [];
        this.pushContext('doYield');
        this.pushContext();
    }
};

// ------- IDE_Morph -------

IDE_Morph.prototype.phyCreateStage = IDE_Morph.prototype.createStage;
IDE_Morph.prototype.createStage = function () {
    this.phyCreateStage();
    //this.stage.setPhysicsFloor(true);
    this.stage.updateScaleMorph();
    if (this.controlBar.physicsButton) {
        this.controlBar.physicsButton.refresh();
    }
};

IDE_Morph.prototype.phyCreateSpriteEditor = IDE_Morph.prototype.createSpriteEditor;
IDE_Morph.prototype.createSpriteEditor = function () {
    if (this.currentTab === 'simulation') {
        if (this.spriteEditor) {
            this.spriteEditor.destroy();
        }

        this.spriteEditor = new PhysicsTabMorph(this.currentSprite, this.sliderColor);
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);
    } else {
        this.phyCreateSpriteEditor();
    }
};


