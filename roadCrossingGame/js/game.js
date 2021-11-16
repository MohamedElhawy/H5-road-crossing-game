// active strict mode
"use strict";



// prevent the context menu --- right click menu 
document.addEventListener("contextmenu" , function (e) { e.preventDefault(); });


// starting any game (phaser)

// create scene
let gameScene = new Phaser.Scene('game');



// scene life-cycle (init() , preload() , create() , update() )

gameScene.init = function ()
{

    // player speed
    this.playerSpeed = 2;

    this.frogDied = false;


    // keyboard controllers
    this.leftKey = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.A );
    this.rightKey = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.D );
    this.upKey = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.W );
    this.downKey = this.input.keyboard.addKey( Phaser.Input.Keyboard.KeyCodes.S );






};




// preload
gameScene.preload = function ()
{

    // loading assets(resources)
    this.load.image("background" , "./resources/img/background.png");
    this.load.image("frog_male" , "./resources/img/frog_male_character.png");
    this.load.image("frog_female" , "./resources/img/frog_female_character.png");
    this.load.image("enemy1" , "./resources/img/enemy1.png");
    this.load.image("enemy2" , "./resources/img/enemy2.png");
    this.load.image("enemy4" , "./resources/img/enemy4.png");
    this.load.image("wood_trunk1" , "./resources/img/wood_trunk.png");


};


// create
gameScene.create = function ()
{

    // background (street)
    let bg = this.add.sprite( 0 , 0 , "background");
    bg.setOrigin(0,0);

    // male frog
    let fm = this.add.sprite(60  , this.sys.game.canvas.height/2 , "frog_male");

    // female frog
    let ff = this.add.sprite(1097 , this.sys.game.canvas.height/2 , "frog_female" );
    ff.flipX = true;

    // enemy car
    let ec1 = this.add.sprite(250 , -100 , "enemy1");
    let ec2 = this.add.sprite(600 , -100 , "enemy2");
    let ec3 = this.add.sprite(925 , -100 , "enemy4");

    // wood trunks
    let wt1 = this.add.sprite(1220 , -100 , "wood_trunk1");
    let wt2 = this.add.sprite(1350 , -350 , "wood_trunk1"); // right
    let wt3 = this.add.sprite(1220 , -400 , "wood_trunk1");
    let wt4 = this.add.sprite(1350 , -600 , "wood_trunk1"); // right
    let wt5 = this.add.sprite(1220 , -900 , "wood_trunk1");
    let wt6 = this.add.sprite(1350 , -950 , "wood_trunk1"); // right






    // add variables to object scene to be able to be used by object functions 
    this.ec1 = ec1;
    this.ec2 = ec2;
    this.ec3 = ec3;

    this.wt1 = wt1;
    this.wt2 = wt2;
    this.wt3 = wt3;
    this.wt4 = wt4;
    this.wt5 = wt5;
    this.wt6 = wt6;

    this.fm = fm;
    this.ff = ff;



    // counter for implementing infinite loop in update()
    this.counterC = 0;
    this.counterWTF = 0;
    this.counterWTL = 0;



    // create cars group 
    this.cars = this.add.group();

    this.cars.add(ec1);
    this.cars.add(ec2);
    this.cars.add(ec3);







};


// update
gameScene.update = function ()
{
    this.counterC += 1;
    this.counterWTF += 1;
    this.counterWTL += 1;



    // moving the cars
    this.ec1.y += 1;
    this.ec2.y += 2;
    this.ec3.y += 3;

    // moving the wood trucks
    this.wt1.y += 1;
    this.wt2.y += 1;
    this.wt3.y += 1;
    this.wt4.y += 1;
    this.wt5.y += 1;
    this.wt6.y += 1;




    // creating infinite loop

    // cars
    if ( this.counterC === 1000)
    {
        this.ec1.y = -100;
        this.ec2.y = -100;
        this.ec3.y = -100;
        this.counterC = 0;

    }



    // wood trucks : first 4
    if ( this.counterWTF === 1450)
    {
        this.wt1.y = -100;
        this.wt2.y = -350;
        this.wt3.y = -400;
        this.wt4.y = -600;
        this.counterWTF = 0;

    }

    // wood trucks : last 2
    if ( this.counterWTL === 1800)
    {
        this.wt5.y = -500;
        this.wt6.y = -550;
        this.counterWTL = 0;

    }



    // mouse controls : right(right-click) / left(left-click)
    // if ( this.input.activePointer.isDown )
    // {

    //     // input.activePointer.button : returns 0 for left click / 1 for middle wheel / 2 for right click 
    //     if ( this.input.activePointer.button === 0 )
    //     {
    //         this.fm.x -= this.playerSpeed;

    //     }

    //     if ( this.input.activePointer.button === 2 )
    //     {
    //         this.fm.x += this.playerSpeed;
    //     }


    // }


    // keyboard controls : up(w) / down(s) / right(d) / left(a) 
    if ( this.leftKey.isDown )
    {
        this.fm.x -= this.playerSpeed;
    }

    if ( this.rightKey.isDown )
    {
        this.fm.x += this.playerSpeed;
    }

    if ( this.upKey.isDown )
    {
        this.fm.y -= this.playerSpeed;
    }

    if ( this.downKey.isDown )
    {
        this.fm.y += this.playerSpeed;
    }







    // checking if the player reached the goal (overlapped the female frog)
    let playerRect = this.fm.getBounds();
    let targetRect = this.ff.getBounds();
    if ( Phaser.Geom.Intersects.RectangleToRectangle(playerRect,targetRect) )
    {
        console.log("reached the frog princess👸🏻");


        // restart the scene
        this.scene.restart();
        return;

    }






    // check if the frog got hit by the cars
    for ( let i = 0 ; i < this.cars.getChildren().length ; i++ )
    {
        let carBound = this.cars.getChildren()[i].getBounds();
        
        if ( Phaser.Geom.Intersects.RectangleToRectangle( playerRect , carBound ) )
        {

            if ( this.frogDied ) return;

            this.gameOver();

        }

    }




};





// custom functions

// game over function
gameScene.gameOver = function ()
{
    this.frogDied = true;

    this.cameras.main.shake(1500);

    this.cameras.main.on("camerashakecomplete" , function () {

        this.cameras.main.fade(3000).on( "camerafadeoutcomplete" , function() {

            console.log("🐸💣 Frog got smached! Try Again🐸💣");
            this.scene.restart();
            return;

        } , this );



    } , this);



};




// game configuration
let gameConfig = {
    type: Phaser.AUTO,
    width: 1535,
    height: 753,
    scene: gameScene
};





// create game
let game = new Phaser.Game(gameConfig);






// ------------------------------------------------------


