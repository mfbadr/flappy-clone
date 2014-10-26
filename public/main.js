//init phaser, and create a 400x490px game

var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

//main state

var mainState = {
  preload: function(){
    // bg color
    game.stage.backgroundColor = '#71c5cf';

    //load bird sprite
    game.load.image('bird', '/assets/bird.png');

    //load pipe
    game.load.image('pipe', '/assets/pipe.png');

  },

  create: function(){
    //set physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //display bird
    this.bird = this.game.add.sprite(100, 245, 'bird');

    //add gravity to the bird
    game.physics.arcade.enable(this.bird);
    //this.game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;

    //space key to jump
    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    //pipes
    this.pipes = game.add.group(); //create group
    this.pipes.enableBody = true; //add physics to the group;
    this.pipes.createMultiple(20, 'pipe'); //make 20 pipes

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#ffffff"});

  },

  addOnePipe: function(x, y) {
    //get first dead piep
    var pipe = this.pipes.getFirstDead();

    //set its position
    pipe.reset(x, y);

    //give it velocity
    pipe.body.velocity.x = -200;

    //kill pipe when it's no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function () {
    //pick the hole
    var hole = Math.floor(Math.random() * 5) + 1;

    //ad the 6 pipes
    for (var i = 0; i < 8; i++)
      if (i != hole && i != hole + 1)
        this.addOnePipe(400, i * 60 + 10);

    this.score += 1;
    this.labelScore.text = this.score;
  },

  update: function(){
    if (this.bird.inWorld == false){
      this.restartGame();
    }

    game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);
  },

  jump: function(){
    this.bird.body.velocity.y = -350;
  },

  restartGame: function(){
    game.state.start('main');
  }
};

game.state.add('main', mainState);
game.state.start('main');
