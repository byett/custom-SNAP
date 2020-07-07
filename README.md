# custom-SNAP

## Installation and running the server.

Install:

```
npm install
```

Running the server:

```
node ./node_modules/bin/lite-server/bin/lite-server
```

If the above command does not work then please use

```
node ./node_modules/.bin/lite-server
```

## Testing Documentation

To make it simpler for testing I created this standalone Snapversion running on a lite-server that will replicate our scenario.
Please setting up the lite server based on the above instructions.
The folder structure of the snap specific implementation is:
 - SnapClient (Snap code)
 - index html file which generates an iframe and loads up the local SNap implementation. 
 - Javascript files to load the template and run the lite-server.

We will be focusing on SnapClient folder for this testing. Specifically the physics.js and Objects.js files in SnapClient folder.
I have made additions to the physics.js file in the form of testBlocks to show how a block or a reporter or a Hat block can be created and tested. To create new categories or blocks we will be focusing on 2 files physics.js and objects.js in the SnapClient folder as mentioned above. Objects.js contains information on what to do when a new category is encountered (So the fuunction declaration part of this process goes in Objects.js). Physics.js contains the information on what kind of category is to be created, what kind of blocks or reporters or hat blocks does the category have and their respective funtionality (So the function definition part of the process goes in Physics.js). 

Below is the description of the template and how to use and create new blocks:
#### Setup Morph:
We can build of an existing Morph category like physics or genereate a new Morph category by using below lines Physics.js:line 23 - 35

```
TestMorph.prototype = new Morph();
TestMorph.prototype.constructor = TestMorph;
TestMorph.uber = Morph.prototype;
TestMorph.prototype.init = function () {
    TestMorph.uber.init.call(this);
};
function TestMorph() {
    this.init();
}
```
This will generate a new Morph category and enable us to use all morphic features of SNAP.

We will utilizing the SpriteMorph to declare our blocks and thier respective functions and StageMorph to define the function for the blocks.

#### SpriteMorph, Setting up Blocks:
Blocks can be setup with an existing json template i.e.
Physics.js: line 131 - 168
```
blockfunction:{
    type: 'reporter'/ 'command'/ 'hat',
    category: 'category_name',
    spec: 'the name of the block' 
}
```
Then we can create a new category, assign a new color for the category and initialize the blocks under the category using SpiteMorph.

```
SpriteMorph.prototype.categories.push('test');
SpriteMorph.prototype.blockColor.test = new Color(100, 160, 250);
SpriteMorph.prototype.inittestBlocks();
```

We then declare the getters and setters associated with the blocks in SpriteMorph.

```
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
```
#### StageMorph, defining block usage:
We define the functions declared in the SpriteMorph portion of the setup in StageMorph. 
Physics.js: line 420 - 428

```
StageMorph.prototype.testBlock = function () {
    return this.testBlockvalue;
};
StageMorph.prototype.setTest = function (value) {
    this.targetTestValue = Math.max(value || 0, 0);
    this.testBlockvalue = this.targetTestValue;
};
```
Using the blocks defined in the Physics.js, We will generate the block UI by dedclaring the new category and the blocks in the Blocks.js under SpriteMorph and StageMorph:
Objects.js
SpriteMorph line 2312 - 2318
StageMorph line 6708 - 6714
```
else if (cat === 'test' ) {
        blocks.push(watcherToggle('testBlock'));
        blocks.push(block('testBlock'));
        blocks.push('-');
        blocks.push(block('setTest'));
    }
```