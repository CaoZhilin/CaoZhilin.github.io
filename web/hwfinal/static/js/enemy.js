//component for common enemy behaviors
Q.component("commonEnemy", {
    added: function() {
        var entity = this.entity;
        entity.on("bump.left,bump.right,bump.bottom,bump.top",function(collision) {
            if(collision.obj.isA("Player")) {  
              collision.obj.damage();                      
            }
            else if (collision.obj.isA("Bullet") || collision.obj.isA("Doge")) {
                this.destroy();
                this.player.points++;
                var pointsLabel = Q("UI.Text",999).items[1];
                pointsLabel.p.label = 'Points x '+ this.player.points;
                if (this.player.points == 100) {
                  Q.stageScene("winGame",1, { label: "You win!" });
                }
            }

        });
    },
});        
        
//enemy that walks around          
Q.Sprite.extend("wanderEnemy", {
    init: function(p,stage,player) {
        this._super(p, {vx: -10, vy: -10, rangeY: 1000,  defaultDirection: "left"});
        this.add("3d, aiBounce, commonEnemy"); 
        this.on("touch");  
        this.stage = stage;
        this.player = player;
        this.p.initialY = this.p.y;             
    },
    step: function(dt) {        
        var dirX = this.p.vx/Math.abs(this.p.vx);
        var ground = Q.stage().locate(this.p.x, this.p.y + this.p.h/2 + 1, Q.SPRITE_DEFAULT);
        var nextTile = Q.stage().locate(this.p.x + dirX * this.p.w/2 + dirX, this.p.y + this.p.h/2 + 1, Q.SPRITE_DEFAULT);
        
        //if we are on ground and there is a cliff
        if(!nextTile && ground) {
            if(this.p.vx > 0) {
                if(this.p.defaultDirection == "right") {
                    this.p.flip = "x";
                }
                else {
                    this.p.flip = false;
                }
            }
            else {
                if(this.p.defaultDirection == "left") {
                    this.p.flip = "x";
                }
                else {
                    this.p.flip = false;
                }
            }
            this.p.vx = -this.p.vx;
        }

        if(this.p.y - this.p.initialY >= this.p.rangeY && this.p.vy > 0) {
            this.p.vy = -this.p.vy;
        } 
        else if(-this.p.y + this.p.initialY >= this.p.rangeY && this.p.vy < 0) {
            this.p.vy = -this.p.vy;
        } 
    },
    touch: function (touch) {
        var c = Math.sqrt(Math.pow(Math.abs(touch.origX - this.player.p.x),2)+Math.pow(Math.abs(touch.origY - this.player.p.y),2));
        var ax = 500 * (touch.origX - this.player.p.x)/c;
        var by = 500 * (touch.origY - this.player.p.y)/c;
        this.stage.insert(new Q.Bullet({
            x:this.player.p.x + ax * 0.05, 
            y:this.player.p.y + by * 0.05,
            vx:ax,
            vy:by,
            }));
    }
});
Q.animations("blackEnemy",{
    run_left:{frames:[5,6,7,8,9],rate:1/5,loop:true},
    run_right:{frames:[0,1,2,3,4],rate:1/5,loop:true},
});
Q.Sprite.extend("blackEnemy",{
    init: function(p,stage,player) {
        this._super(p, { sheet: 'eval',sprite:'blackEnemy', vx: -20, vy: -20, rangeY: 1000,  defaultDirection: "left"});
        this.add("3d, aiBounce, commonEnemy, animation"); 
        this.on("touch");  
        this.stage = stage;
        this.player = player;
        this.p.initialY = this.p.y;             
    },
    step: function(dt) {        
        var dirX = this.p.vx/Math.abs(this.p.vx);
        var ground = Q.stage().locate(this.p.x, this.p.y + this.p.h/2 + 1, Q.SPRITE_DEFAULT);
        var nextTile = Q.stage().locate(this.p.x + dirX * this.p.w/2 + dirX, this.p.y + this.p.h/2 + 1, Q.SPRITE_DEFAULT);
        if (dirX > 0) {
          this.play("run_right");
        }
        else{
          this.play("run_left");
        }
    },
    touch: function (touch) {
        var c = Math.sqrt(Math.pow(Math.abs(touch.origX - this.player.p.x),2)+Math.pow(Math.abs(touch.origY - this.player.p.y),2));
        var ax = 500 * (touch.origX - this.player.p.x)/c;
        var by = 500 * (touch.origY - this.player.p.y)/c;
        this.stage.insert(new Q.Bullet({
            x:this.player.p.x + ax * 0.05, 
            y:this.player.p.y + by * 0.05,
            vx:ax,
            vy:by,
            }));
    }   
});