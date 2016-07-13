Q.Sprite.extend("Bullet",{
    init:function (p) {
        this._super(p, { 
            sheet: "bullet",        // Spritesheet
            sprite: "bullet",
            x: 900, 
            y: 2340,
            vx: -200,
            vy:-200,
            w: 5,
            h: 5,
            scale: 0.5,
        });
        this.ability = 1;
        this.add("2d, animation, commonBullet");
    },
    step: function (dt) {
        this.p.x += this.p.vx*dt;
        this.p.y += this.p.vy*dt;
    }
});
//bullet的animation
Q.animations("bullet",{
    boom: { frames: [0,1,2,3,4,5], rate: 1/15, loop:false},
});
Q.component("commonBullet",{
    added: function () {
        var entity = this.entity;
        entity.on("bump.left, bump.right, bump.bottom, bump.top",function(collision){
            if (collision.obj.isA("wanderEnemy")||collision.obj.isA("blackEnemy")) {
                collision.obj.destroy();

                if (entity.isA("Bullet")) {
                	this.play("boom");
                	entity.ability--;
                window.setTimeout(function(){
                	if (entity.ability == 0) {
                		 entity.destroy();
                	};
                   
                },333);
                }
                else{
                	entity.damage();
                }
            }
            else if(collision.obj.isA("Player")){
                
            }
            else{
               if (entity.isA("Bullet")) {
                    this.play("boom");
                    window.setTimeout(function(){
                        //entity.play("boom");
                        entity.destroy();
                    },333);
                }
            }
        })
    }
});
//doge
Q.Sprite.extend("Doge",{
    init: function(p){
        this._super(p,{
            sheet:"doge",
            sprite:"Doge",
            //vx:0,
            //vy:0,
            direction:"right"
        });
        this.ability = 10;
        this.lifeBar = new Q.lifeBar({scale:0.3,x:this.p.x, y:this.p.y-40});
        this.add("3d,commonBullet");
        this.add("animation");
    },
    step:function(dt){
        if(this.p.timeInvincible > 0) {
          this.p.timeInvincible = Math.max(this.p.timeInvincible - dt, 0);
          //console.log(this.p.timeInvincible);
        }
        if(this.p.direction=="right"){
            this.p.vx=40;
            this.play("run_right");
        }
        else if(this.p.direction=="left"){
            this.p.vx=-40;
            this.play("run_left");
        }
        else if(this.p.direction=="up"){
            this.p.vy=-40;
            this.play("run_left");
        }
        else{
            this.p.vy=40;
            this.play("run_right");
        }
    },
    damage: function() {
        //only damage if not in "invincible" mode, otherwise beign next to an enemy takes all the lives inmediatly
        if(!this.p.timeInvincible) {
            this.ability--;
    
            //will be invincible for 2 second
            this.p.timeInvincible = 1;
            this.lifeBar.p.frame = 10-this.ability;
            console.log(this.lifeBar.p.frame);
            if (this.ability == 0) {
                this.lifeBar.destroy();
                this.distory();
            };
        }
    }
});
Q.animations("Doge",{
    run_right:{frames:[8,9,10,11,12,13,14,15,16,17],rate:1/8,loop:true},
    run_left:{frames:[0,1,2,3,4,5,6,7],rate:1/8,loop:true}
});
