// TODO
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "128",
                spriteheight: "128",
                width: 128,
                height: 128,
                getShape: function() {
                    return (new me.Rect(0, 0, 30, 128)).toPolygon();
                }
            }]);
        //my player entities

        this.renderable.addAnimation("idle", [3]);
        this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
        //the animation using the different images 8-13
        //the number 80 means we switch through the images every 80 miliseconds

        this.renderable.setCurrentAnimation("idle");
        //sets the speed we go on the x-axis first number and y-axis second number
        this.body.setVelocity(5, 20);

    },
    update: function(delta) {
        //checks if the right key is pressed
        if (me.input.isKeyPressed("right")) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        }
        //makes character move right
        else if (me.input.isKeyPressed("left")) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            //makes chararcter move left
        } else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("up")) {
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }
          //makes character jump
          
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
           //sets animation smallwalk
        if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }




        this._super(me.Entity, "update", [delta]);
        return true;
    },
        collideHandler: function(response) {
            var ydif = this.pos.y - response.b.pos.y;

            if (response.b.type === 'badguy') {
                if (ydif <= -115) {
                response.b.alive = false;
                } else {
                    me.state.change(me.state.MENU);
                }

                }

             });
//makes it so you  can kill the badguys

game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        //if something collides with this object them we we call the on collision function
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    onCollision: function() {
        //makes it so you can only get through the door once
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }

});

game.BadGuy = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spriteheight: "28",
                width: 60,
                height: 28,
                getShape: function() {
                    return (new me.Rect(0, 0, 60, 28)).toPolygon();
                }
            }]);
//the badguys entities
        this.spritewidth = 60;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width - this.spritewidth;
        this.updateBounds();

        this.alwaysUpdate = true;

        this.walkLeft = false;
        this.alive = true;
        this.type = "badguy";

        //this.renderable.addAnimation("run", [0, 1, 2], 80);
        //this.setCurrentAnimation("run");

        this.body.setVelocity(2, 6);
    },
    //sets velocity of the badguys
    update: function(delta) {
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            //how badguy moves
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;

        } else {
            me.game.world.removeChild(this);
        }


        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function() {

    }

});

