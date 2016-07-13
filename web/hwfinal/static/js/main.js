var modal=document.createElement("div");

window.addEventListener("load",function(){
	var Q = Quintus();
  Q.include("Sprites, Scenes, Input, 2D, Touch, UI,Anim")
  Q.setup("map",{
    width: 960,
    height: 640,
    maximize:true,
    development:true
   })
  Q.controls()
  Q.touch(Q.SPRITE_ALL);  
                 
  var Q_little=Quintus()
  Q_little.include("Sprites, Scenes, Input, 2D, Touch, UI,Anim")
  Q_little.setup("little-map",{
    maximize:true,
    development:true
  })
  Q_little.controls()
  Q_little.touch(Q.SPRITE_ALL);         
  $("#little-map_container").attr("style","");
  $("#map_container").attr("style","");
  $("#little-map").attr("style","");
  $("#map").attr("style","");

  Q.Sprite.extend("Player",{
    init: function(p,thestage) {
      this._super(p, {
        gravity: 0,
        collisionMask: Q.SPRITE_DEFAULT, 
        sheet:role,
        sprite:"Player",
        w:0,
        h:0,
        x: 56*30, 
        y: 60*30,
        vx:0,
        vy:0,
        stage:thestage, 
      });
      this.add('platformerControls, 3d, swiftPlayer');
      this.add("animation");
      this.on("step",this,"step"); 
      this.on("hitTop");
      this.life = 10; 
      this.points = 0;
      this.p.timeInvincible = 0;
      this.doge = new Q.Doge({x:this.p.x, y:this.p.y, w:20,h:20,scale:0.4});
      this.lifeBar = new Q.lifeBar({x:this.p.x, y:this.p.y-100});  
      this.stage = thestage;
      this.on("bump.top",this,"hitTop");    
      this.on('hit',this,'collision');
      this.on('touch');
      this.on('input');
      this.skill0=new Q.Skill({frame:[0],effect_class:"junior",state:"isunlock", name:"doge",scale:0.4,x:this.p.x-100,y:this.p.y+350,vx:0,vy:0});
      this.skill1=new Q.Skill({frame:[1],effect_class:"primary",state:"islock", name:"flower",scale:0.4,x:this.p.x,y:this.p.y+350,vx:0,vy:0});
      this.skill2=new Q.Skill({frame:[2],effect_class:"senior",state:"islock",name:"round",scale:0.4,x:this.p.x+100,y:this.p.y+350,vx:0,vy:0});
    },
    step:function(dt) {
      if(this.p.timeInvincible > 0) {
        this.p.timeInvincible = Math.max(this.p.timeInvincible - dt, 0);
        //console.log(this.p.timeInvincible);
      }
      if(Q.inputs['up']) {
        this.play("jump"); 
      } 
      else if(Q.inputs['right']) {
        this.p.vx=60;
          this.play("run");
      }
      else if(Q.inputs['left']) {
        this.p.vx=-60;
        this.play("op_run");
      } 
      else if(Q.inputs['up']) {
        this.p.vy=-30;
        this.play("jump");
      } 
      else if(Q.inputs['down']) {
        this.p.vy=30;
        this.play("drop");
      } 
      else {
        this.play("stand_" + this.p.direction);
        this.p.vx=0;
        this.p.vy=0;
      }
      var p = this.p;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    
      this.lifeBar.p.x = this.p.x;
      this.lifeBar.p.y = this.p.y - 100;
      if (this.doge != undefined) {
        if (this.p.vx > 0) {
          this.doge.p.x = this.p.x + 80;
          if (this.p.vy >= 0) {
           this.doge.p.y = this.p.y + 60;
          }
          else{
            this.doge.p.y = this.p.y - 60;
          }
          this.doge.p.direction = "right";
          this.doge.lifeBar.p.x = this.doge.p.x;
          this.doge.lifeBar.p.y = this.doge.p.y - 60;
        }
        else {
          this.doge.p.x = this.p.x - 80;
            if (this.p.vy >= 0) {
              this.doge.p.y = this.p.y + 60;
            }
            else{
              this.doge.p.y = this.p.y - 60;
            }
            this.doge.p.direction = "left";
            this.doge.lifeBar.p.x = this.doge.p.x;
            this.doge.lifeBar.p.y = this.doge.p.y - 60;
        }
      }          

      if(this.p.timeInvincible > 0) {
        this.p.timeInvincible = Math.max(this.p.timeInvincible - dt, 0);
      }
      this.skill0.p.x=this.p.x-100;
      this.skill0.p.y=this.p.y+350;

      this.skill1.p.x=this.p.x;
      this.skill1.p.y=this.p.y+350;

      this.skill2.p.x=this.p.x+100;
      this.skill2.p.y=this.p.y+350;

      this.skill0.box.p.x=this.p.x-100;
      this.skill0.box.p.y=this.p.y+350;

      this.skill1.box.p.x=this.p.x;
      this.skill1.box.p.y=this.p.y+350;

      this.skill2.box.p.x=this.p.x+100;
      this.skill2.box.p.y=this.p.y+350;

      if(this.points>15){
        this.skill1.p.state="isunlock";
        this.skill1.box.play("unlock");
      }
      if(this.points>30){
        this.skill0.p.state="isunlock";
        this.skill0.box.play("unlock");

      }
      if(this.points>45){
        this.skill2.p.state="isunlock";
        this.skill2.box.play("unlock");
      }
      if(Q.inputs['one']){
        this.skill0.add("tween");
        this.skill0.animate({state:"unlock"},{delay:5});
        if(this.skill0.p.state=="islock"){
            modal.init({content:"你还不会这项技能"});
        }
        else if(this.skill0.p.state=="isdelay"){
          modal.init({content:"技能正在冷却"});
         }
        else{
          this.skill0.box.play("delay_junior");
          console.log(this.p.direction);

          if (this.doge!=undefined) {
            this.doge.lifeBar.destroy();
            this.life += this.doge.ability;
            if (this.life >10) {
              this.life = 10;
            } 
              this.lifeBar.p.frame = 10 - this.life;
          }
          this.doge = new Q.Doge({x:this.p.x, y:this.p.y, w:20,h:20,scale:0.4});

          //this.stage.insert(new Q.Doge({scale:0.5,x:this.p.x,y:this.p.y,direction:this.p.direction}));
          this.doge.p.x = this.p.x;
          this.doge.p.y = this.p.y-100;
          this.stage.insert(this.doge);
          this.stage.insert(this.doge.lifeBar);
          this.skill0.p.state="isdelay";
        }
      }
      else if(Q.inputs['two']){
          this.skill1.add("tween");
          this.skill1.animate({state:"unlock"},{delay:10});
          if(this.skill1.p.state=="islock"){
             modal.init({content:"你还不会这项技能"});
          }
          else if(this.skill1.p.state=="isdelay"){
              modal.init({content:"技能正在冷却"});
           }
          else{
              if(this.skill1.p.effect_class=="primary"){
                  this.skill1.p.state="isdelay";
                  this.skill1.box.play("delay_primary");
                  //this.weapon=new Q.Weapon({});
              }
              else if(this.skill1.p.effect_class=="junior"){
                  this.skill1.p.state="isdelay";
                  this.skill1.box.play("delay_junior");
              }
              else if(this.skill1.p.effect_class=="senior"){
                  this.skill1.p.state="isdelay";
                  this.skill1.box.play("delay_senior");
              }
          }
      }
      else if(Q.inputs['three']){
          this.skill2.add("tween");
          this.skill2.animate({state:"unlock"},{delay:20});
          if(this.skill2.p.state=="islock"){
              modal.init({content:"你还不会这项技能"});
          }
          else if(this.skill2.p.state=="isdelay"){
             modal.init({content:"技能正在冷却"});
           }
          else{
              if(this.skill2.p.effect_class=="primary"){
                  this.skill2.p.state="isdelay";
                  this.skill2.box.play("delay_primary");
                  //this.weapon=new Q.Weapon({});
              }
              else if(this.skill2.p.effect_class=="junior"){
                  this.skill2.p.state="isdelay";
                  this.skill2.box.play("delay_junior");
                  //this.weapon=new Q.Weapon({});
              }
              else if(this.skill2.p.effect_class=="senior"){
                  this.skill2.p.state="isdelay";
                  this.skill2.box.play("delay_senior");
                  //this.weapon=new Q.Weapon({});
              }
          }
      }
    },
    collision: function(col,last) {
      var p = this.p,
      magnitude = 0;

      if(col.obj.p && col.obj.p.sensor) {
        col.obj.trigger("sensor",entity);
        return;
      }

      col.impact = 0;
      var impactX = Math.abs(p.vx);
      var impactY = Math.abs(p.vy);
      p.x -= col.separate[0];
      p.y -= col.separate[1];

      // Top collision
      if(col.normalY < -0.3) { 
        if(p.vy > 0) { p.vy = 0; }
        col.impact = impactY;
        this.trigger("bump.bottom",col);
      }
      if(col.normalY > 0.3) {
        if(p.vy < 0) { p.vy = 0; }
        col.impact = impactY;
        this.trigger("bump.top",col);
      }

      if(col.normalX < -0.3) { 
        if(p.vx > 0) { p.vx = 0;  }
        col.impact = impactX;
        this.trigger("bump.right",col);
      }
      if(col.normalX > 0.3) { 
        if(p.vx < 0) { p.vx = 0; }
        col.impact = impactX;
        
        this.trigger("bump.left",col);
      }
    },
    hitTop: function(collision) {
        if (collision.obj.isA("TileLayer") && collision.obj.y > this.p.y) {
            this.p.vy = 0;
        }
    },
    damage: function() {
    //only damage if not in "invincible" mode, otherwise beign next to an enemy takes all the lives inmediatly
    if(!this.p.timeInvincible) {
      this.life--;
    
      //will be invincible for 1 second
      this.p.timeInvincible = 2;
      this.lifeBar.p.frame = 10-this.life;
                  //var lifeLabel = Q("UI.Text",999).items[0];
                  //lifeLabel.p.label = 'Lives x '+ this.player.life;
    
      if(this.life<0) {
        this.destroy();
        Q.stageScene("endGame",1, { label: "Game Over" }); 
      }
      else {
        var livesLabel = Q("UI.Text",999).first();
        livesLabel.p.label = "Lives x "+this.life;
      }
    }
  }
});
Q.Sprite.extend("lifeBar",{
  init:function(p){
    this._super(p,{sheet:"life"});
  },
});
Q.component("swiftPlayer", {
  added: function () {
    var entity = this.entity;
    entity.on("bump.left, bump.right, bump.bottom, bump.top",function(collision){
      if (collision.obj.isA("wanderEnemy")) {
      //交由怪物碰撞处理
       entity.p.vx = 0;
       entity.p.vy = 0;
      }
    });
  }
});
//animations
Q.animations('Player',{
    run:{frames:[0,1,2,3,4],next:'stand_right',rate:1/5,loop:true},
    op_run:{frames:[9,8,7,6,5],next: 'stand_left',rate:1/5,loop:true},
    stand_left: {frames: [9]},
    stand_right: {frames: [0]},
    jump: {frames: [10], next:"stand_up",rate: 1},
    drop:{frames: [10], next:"stand_down",rate: 1},
    stand_up:{frames:[10]},
    stand_down:{frames:[10]},
    die:{frames:[],rate:1/4},hurt:{frames:[],rate:1/2}
  }
);
Q.Sprite.extend("Player",{
    init: function(p,thestage) {
      this._super(p, {
        gravity: 0,
        collisionMask: Q.SPRITE_DEFAULT, 
        sheet:role,
        sprite:"Player",
        w:0,
        h:0,
        x: 56*30, 
        y: 60*30,
        vx:0,
        vy:0,
        stage:thestage, 
      });
      this.add('platformerControls, 3d, swiftPlayer');
      this.add("animation");
      this.on("step",this,"step"); 
      this.on("hitTop");
      this.life = 10; 
      this.points = 0;
      this.p.timeInvincible = 0;
      this.doge = new Q.Doge({x:this.p.x, y:this.p.y, w:20,h:20,scale:0.4});
      this.lifeBar = new Q.lifeBar({x:this.p.x, y:this.p.y-100});  
      this.stage = thestage;
      this.on("bump.top",this,"hitTop");    
      this.on('hit',this,'collision');
      this.on('touch');
      this.on('input');
      this.skill0=new Q.Skill({frame:[0],effect_class:"junior",state:"isunlock", name:"doge",scale:0.4,x:this.p.x-100,y:this.p.y+350,vx:0,vy:0});
      this.skill1=new Q.Skill({frame:[1],effect_class:"primary",state:"islock", name:"flower",scale:0.4,x:this.p.x,y:this.p.y+350,vx:0,vy:0});
      this.skill2=new Q.Skill({frame:[2],effect_class:"senior",state:"islock",name:"round",scale:0.4,x:this.p.x+100,y:this.p.y+350,vx:0,vy:0});
    },
    step:function(dt) {
      if(this.p.timeInvincible > 0) {
        this.p.timeInvincible = Math.max(this.p.timeInvincible - dt, 0);
        //console.log(this.p.timeInvincible);
      }
      if(Q.inputs['up']) {
        this.play("jump"); 
      } 
      else if(Q.inputs['right']) {
        this.p.vx=60;
          this.play("run");
      }
      else if(Q.inputs['left']) {
        this.p.vx=-60;
        this.play("op_run");
      } 
      else if(Q.inputs['up']) {
        this.p.vy=-30;
        this.play("jump");
      } 
      else if(Q.inputs['down']) {
        this.p.vy=30;
        this.play("drop");
      } 
      else {
        this.play("stand_" + this.p.direction);
        this.p.vx=0;
        this.p.vy=0;
      }
      var p = this.p;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    
      this.lifeBar.p.x = this.p.x;
      this.lifeBar.p.y = this.p.y - 100;
      if (this.doge != undefined) {
        if (this.p.vx > 0) {
          this.doge.p.x = this.p.x + 80;
          if (this.p.vy >= 0) {
           this.doge.p.y = this.p.y + 60;
          }
          else{
            this.doge.p.y = this.p.y - 60;
          }
          this.doge.p.direction = "right";
          this.doge.lifeBar.p.x = this.doge.p.x;
          this.doge.lifeBar.p.y = this.doge.p.y - 60;
        }
        else {
          this.doge.p.x = this.p.x - 80;
            if (this.p.vy >= 0) {
              this.doge.p.y = this.p.y + 60;
            }
            else{
              this.doge.p.y = this.p.y - 60;
            }
            this.doge.p.direction = "left";
            this.doge.lifeBar.p.x = this.doge.p.x;
            this.doge.lifeBar.p.y = this.doge.p.y - 60;
        }
      }          

      if(this.p.timeInvincible > 0) {
        this.p.timeInvincible = Math.max(this.p.timeInvincible - dt, 0);
      }
      this.skill0.p.x=this.p.x-100;
      this.skill0.p.y=this.p.y+350;

      this.skill1.p.x=this.p.x;
      this.skill1.p.y=this.p.y+350;

      this.skill2.p.x=this.p.x+100;
      this.skill2.p.y=this.p.y+350;

      this.skill0.box.p.x=this.p.x-100;
      this.skill0.box.p.y=this.p.y+350;

      this.skill1.box.p.x=this.p.x;
      this.skill1.box.p.y=this.p.y+350;

      this.skill2.box.p.x=this.p.x+100;
      this.skill2.box.p.y=this.p.y+350;

      if(this.points>15){
        this.skill1.p.state="isunlock";
        this.skill1.box.play("unlock");
      }
      if(this.points>30){
        this.skill0.p.state="isunlock";
        this.skill0.box.play("unlock");

      }
      if(this.points>45){
        this.skill2.p.state="isunlock";
        this.skill2.box.play("unlock");
      }
      if(Q.inputs['one']){
        this.skill0.add("tween");
        this.skill0.animate({state:"unlock"},{delay:5});
        if(this.skill0.p.state=="islock"){
            modal.init({content:"你还不会这项技能"});
        }
        else if(this.skill0.p.state=="isdelay"){
          modal.init({content:"技能正在冷却"});
         }
        else{
          this.skill0.box.play("delay_junior");
          console.log(this.p.direction);

          if (this.doge!=undefined) {
            this.doge.lifeBar.destroy();
            this.life += this.doge.ability;
            if (this.life >10) {
              this.life = 10;
            } 
              this.lifeBar.p.frame = 10 - this.life;
          }
          this.doge = new Q.Doge({x:this.p.x, y:this.p.y, w:20,h:20,scale:0.4});

          //this.stage.insert(new Q.Doge({scale:0.5,x:this.p.x,y:this.p.y,direction:this.p.direction}));
          this.doge.p.x = this.p.x;
          this.doge.p.y = this.p.y-100;
          this.stage.insert(this.doge);
          this.stage.insert(this.doge.lifeBar);
          this.skill0.p.state="isdelay";
        }
      }
      else if(Q.inputs['two']){
          this.skill1.add("tween");
          this.skill1.animate({state:"unlock"},{delay:10});
          if(this.skill1.p.state=="islock"){
             modal.init({content:"你还不会这项技能"});
          }
          else if(this.skill1.p.state=="isdelay"){
              modal.init({content:"技能正在冷却"});
           }
          else{
              if(this.skill1.p.effect_class=="primary"){
                  this.skill1.p.state="isdelay";
                  this.skill1.box.play("delay_primary");
                  //this.weapon=new Q.Weapon({});
              }
              else if(this.skill1.p.effect_class=="junior"){
                  this.skill1.p.state="isdelay";
                  this.skill1.box.play("delay_junior");
              }
              else if(this.skill1.p.effect_class=="senior"){
                  this.skill1.p.state="isdelay";
                  this.skill1.box.play("delay_senior");
              }
          }
      }
      else if(Q.inputs['three']){
          this.skill2.add("tween");
          this.skill2.animate({state:"unlock"},{delay:20});
          if(this.skill2.p.state=="islock"){
              modal.init({content:"你还不会这项技能"});
          }
          else if(this.skill2.p.state=="isdelay"){
             modal.init({content:"技能正在冷却"});
           }
          else{
              if(this.skill2.p.effect_class=="primary"){
                  this.skill2.p.state="isdelay";
                  this.skill2.box.play("delay_primary");
                  //this.weapon=new Q.Weapon({});
              }
              else if(this.skill2.p.effect_class=="junior"){
                  this.skill2.p.state="isdelay";
                  this.skill2.box.play("delay_junior");
                  //this.weapon=new Q.Weapon({});
              }
              else if(this.skill2.p.effect_class=="senior"){
                  this.skill2.p.state="isdelay";
                  this.skill2.box.play("delay_senior");
                  //this.weapon=new Q.Weapon({});
              }
          }
      }
    },
    collision: function(col,last) {
      var p = this.p,
      magnitude = 0;

      if(col.obj.p && col.obj.p.sensor) {
        col.obj.trigger("sensor",entity);
        return;
      }

      col.impact = 0;
      var impactX = Math.abs(p.vx);
      var impactY = Math.abs(p.vy);
      p.x -= col.separate[0];
      p.y -= col.separate[1];

      // Top collision
      if(col.normalY < -0.3) { 
        if(p.vy > 0) { p.vy = 0; }
        col.impact = impactY;
        this.trigger("bump.bottom",col);
      }
      if(col.normalY > 0.3) {
        if(p.vy < 0) { p.vy = 0; }
        col.impact = impactY;
        this.trigger("bump.top",col);
      }

      if(col.normalX < -0.3) { 
        if(p.vx > 0) { p.vx = 0;  }
        col.impact = impactX;
        this.trigger("bump.right",col);
      }
      if(col.normalX > 0.3) { 
        if(p.vx < 0) { p.vx = 0; }
        col.impact = impactX;
        
        this.trigger("bump.left",col);
      }
    },
    hitTop: function(collision) {
        if (collision.obj.isA("TileLayer") && collision.obj.y > this.p.y) {
            this.p.vy = 0;
        }
    },
    damage: function() {
    //only damage if not in "invincible" mode, otherwise beign next to an enemy takes all the lives inmediatly
    if(!this.p.timeInvincible) {
      this.life--;
    
      //will be invincible for 1 second
      this.p.timeInvincible = 2;
      this.lifeBar.p.frame = 10-this.life;
                  //var lifeLabel = Q("UI.Text",999).items[0];
                  //lifeLabel.p.label = 'Lives x '+ this.player.life;
    
      if(this.life<0) {
        this.destroy();
        Q.stageScene("endGame",1, { label: "Game Over" }); 
      }
      else {
        var livesLabel = Q("UI.Text",999).first();
        livesLabel.p.label = "Lives x "+this.life;
      }
    }
  }
});
Q.Sprite.extend("lifeBar",{
  init:function(p){
    this._super(p,{sheet:"life"});
  },
});
Q.component("swiftPlayer", {
  added: function () {
    var entity = this.entity;
    entity.on("bump.left, bump.right, bump.bottom, bump.top",function(collision){
      if (collision.obj.isA("wanderEnemy")) {
      //交由怪物碰撞处理
       entity.p.vx = 0;
       entity.p.vy = 0;
      }
    });
  }
});
//animations
Q.animations('Player',{
    run:{frames:[0,1,2,3,4],next:'stand_right',rate:1/5,loop:true},
    op_run:{frames:[9,8,7,6,5],next: 'stand_left',rate:1/5,loop:true},
    stand_left: {frames: [9]},
    stand_right: {frames: [0]},
    jump: {frames: [10], next:"stand_up",rate: 1},
    drop:{frames: [10], next:"stand_down",rate: 1},
    stand_up:{frames:[10]},
    stand_down:{frames:[10]},
    die:{frames:[],rate:1/4},hurt:{frames:[],rate:1/2}
  }
);
//enemy
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
//3d
Q.component('3d',{
  added: function() {
    var entity = this.entity;
    Q._defaults(entity.p,{
      vx: 0,
      vy: 0,
      ax: 0,
      ay: 0,
      gravity: 0,
      collisionMask: Q.SPRITE_DEFAULT
    });
    entity.on('step',this,"step");
    entity.on('hit',this,'collision');
  },

  collision: function(col,last) {
    if (!col.obj.isA("lifeBar")) {
      var entity = this.entity,
      p = entity.p,
      magnitude = 0;

      if(col.obj.p && col.obj.p.sensor) {
        col.obj.trigger("sensor",entity);
        return;
      }

      col.impact = 0;
      var impactX = Math.abs(p.vx);
      var impactY = Math.abs(p.vy);

      p.x -= col.separate[0];
      p.y -= col.separate[1];

      // Top collision
      if(col.normalY < -0.3) { 
        if(p.vy > 0) { p.vy = 0; }
        col.impact = impactY;
        entity.trigger("bump.bottom",col);
      }
      if(col.normalY > 0.3) {
        if(p.vy < 0) { p.vy = 0; }
        col.impact = impactY;

        entity.trigger("bump.top",col);
      }

      if(col.normalX < -0.3) { 
        if(p.vx > 0) { p.vx = 0;  }
        col.impact = impactX;
        entity.trigger("bump.right",col);
      }
      if(col.normalX > 0.3) { 
        if(p.vx < 0) { p.vx = 0; }
        col.impact = impactX;

        entity.trigger("bump.left",col);
      }
    }
  },

  step: function(dt) {
    var p = this.entity.p,
        dtStep = dt;
    // TODO: check the entity's magnitude of vx and vy,
    // reduce the max dtStep if necessary to prevent 
    // skipping through objects.
    while(dtStep > 0) {
      dt = Math.min(1/30,dtStep);
      // Updated based on the velocity and acceleration
      p.vx += p.ax * dt + (p.gravityX == void 0 ? Q.gravityX : p.gravityX) * dt * p.gravity;
      p.vy += p.ay * dt + (p.gravityY == void 0 ? Q.gravityY : p.gravityY) * dt * p.gravity;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      this.entity.stage.collide(this.entity);
      dtStep -= dt;
    }
  }
});
//bullet(include doge)
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
//Box
Q.Sprite.extend("Box",{
    init: function(p){
      this._super(p,{sheet:"box",sprite:"Box",vx:0,vy:0});
        this.add("platformerControls");
        this.add("animation");
        this.off("collision");
        this.off("bump"); 
          //this.off("step");
    },
    step:function(){
        this.p.x=this.p.x;
        this.p.y=this.p.y;
    }
});
//Box animation
Q.animations("Box",{
  unlock:{frames:[20],rate:1,loop:true},
  delay_primary:{frames:[0,1,2,3,4],rate:1,loop:false,next:"unlock"},
  delay_junior:{frames:[0,1,2,3,4,5,6,7,8,9],rate:1,loop:false,next:"unlock"},
  delay_senior:{frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],rate:1,loop:false,next:"unlock"}
});

Q.Sprite.extend("Skill",{
    init: function(p){
        this._super(p,{
            sheet:"skill",
            sprite:"Skill",
            vx:0,
            vy:0,
            effect_class:"primary",
            state:"unlock",
    });
        //this.add("2d,platformerControls");
        this.add("animation");
        this.on("input");
        this.off("collision");
        this.off("bump"); 
        this.off("step"); 
        this.box=new Q.Box({frame:[21],scale:0.4,x:this.p.x,y:this.p.y,vx:0,vy:0})
    },
});

  Q.scene("level1",function(stage) {
    
      var background = new Q.TileLayer({ dataAsset: 'level1.tmx', layerIndex: 0, sheet: 'tiles', tileW: 30, tileH: 30, type: Q.SPRITE_NONE });
      stage.insert(background);
      
      stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level1.tmx', layerIndex:1,  sheet: 'blank', tileW: 30, tileH: 30 }));
    
      var player = stage.insert(new Q.Player({sheet:"zhilin",scale:1.5}));
       
      stage.insert(player.lifeBar);
      stage.insert(player.skill0);
      stage.insert(player.skill1);
      stage.insert(player.skill2);
      stage.insert(player.skill0.box);
      stage.insert(player.skill1.box);
      stage.insert(player.skill2.box);
      var levelAssets = [
          ["wanderEnemy", {x: 37*30, y: 69*30, asset: "slime.png"},stage,player],
          ["wanderEnemy", {x: 37*30, y: 80*30, asset: "slime.png"},stage,player],
          
          ["blackEnemy", {x: 102*30, y: 60*30},stage,player],
          ["blackEnemy", {x: 94*30, y: 71*30},stage,player],
          ["wanderEnemy", {x: 28*30, y: 79*30, asset: "slime.png"},stage,player],
          ["wanderEnemy", {x: 31*30, y: 77*30, asset: "slime.png"},stage,player],
          
          ["wanderEnemy", {x: 14*30, y: 59*30, asset: "slime.png"},stage,player],
          ["wanderEnemy", {x: 51*30, y: 11*30, asset: "slime.png"},stage,player],
          ["wanderEnemy", {x: 53*30, y: 10*30, asset: "slime.png"},stage,player],
          ["wanderEnemy", {x: 51*30, y: 12*30, asset: "slime.png"},stage,player]
      ];
      //stage.insert(new Q.wanderEnemy({x: 37*30, y: 69*30, asset: "slime.png"},stage,player));
      stage.loadAssets(levelAssets);
      
      
      window.setTimeout(function(){
        stage.loadAssets(levelAssets);
      } ,900000);
      window.setTimeout(function(){
        stage.loadAssets(levelAssets);
      }, 1800000);
      window.setTimeout(function(){
        stage.loadAssets(levelAssets);
      }, 2400000);
      window.setTimeout(function(){
        stage.loadAssets(levelAssets);
      } ,2800000);
      window.setTimeout(function(){
        stage.loadAssets(levelAssets);
      } ,3300000);
      window.setTimeout(function(){
        stage.loadAssets(levelAssets);
      } ,3900000);
      window.setTimeout(function(){
        stage.loadAssets(levelAssets);
      } ,4400000);
      window.setTimeout(function(){
        stage.loadAssets(levelAssets);
      } ,5000000);
      window.setTimeout(function(){
        stage.loadAssets(levelAssets);
      } ,6000000);
  
      stage.add("viewport").follow(player,{x: true, y: true},{minX: 0, maxX: background.p.w, minY: 0, maxY: background.p.h});
  });
  Q_little.scene("level1",function(stage) { 
      var background = new Q.TileLayer({ dataAsset: 'level1.tmx', layerIndex: 0, sheet: 'tiles', tileW: 30, tileH: 30, type: Q.SPRITE_NONE });
      stage.insert(background);
      stage.collisionLayer(new Q.TileLayer({ dataAsset: 'level1.tmx', layerIndex:1,  sheet: 'blank', tileW: 30, tileH: 30 }));
      
      var player = stage.insert(new Q.Player({sheet:"zhilin",scale:1.5},stage));
            
      stage.add("viewport");
      stage.viewport.scale=0.23;
      stage.centerOn(1900,1600);
  });
        
  Q.scene("gameStats", function(stage) {
      var statsContainer = stage.insert(new Q.UI.Container({
          fill: "gray",
          x:  960/2,
          y: 20,
          border: 1,
          shadow: 3,
          shadowColor: "rgba(0,0,0,0.5)",
          w: 960,
          h: 40
          })
      );
      var lives = stage.insert(new Q.UI.Text({ 
              label: "Lives x 10",
              color: "white",
              x: -300,
              y: 0
          }),statsContainer);
      
      var coins = stage.insert(new Q.UI.Text({ 
              label: "Points x 0",
              color: "white",
              x: 300,
              y: 0
          }),statsContainer);
          
       
  });
  Q.scene("endGame",function(stage) {
      var pointsLabel = Q("UI.Text",999).items[1];
      modal.init({content:"game over,your mark is " + pointsLabel.p.label});
      window.setTimeout(function(){window.location = "";},4000);
  });
  Q.scene("winGame",function(stage) {
      //var pointsLabel = Q("UI.Text",999).items[1];
      modal.init({content:"win the game by kill 100 enemys"});
      window.setTimeout(function(){window.location = "";},4000);
  });
        
  //load assets
  Q.load("skill.png,doge.png,hurt1.png,hurt2.png,smallmap.png,life.png,box.png, bullet.png, ba.png, liuli.png,zhilin.png,eval.png, level1.tmx,slime.png", function() {
    Q.sheet("tiles","smallmap.png", { tilew: 30, tileh: 30});
    Q.sheet("life","life.png", { tilew: 23*5, tileh: 23});  
    Q.sheet("blank","ba.png",{tilew:30,tileh:30});
    Q.sheet("bullet","bullet.png",{tilew:60, tileh:65, sx:0, sy:0});
    Q.sheet("liuli","liuli.png",{tilew: 58,tileh: 100,sx: 0,sy: 0,w:2000,h: 100}); 
    Q.sheet("zhilin","zhilin.png",{tilew: 58,tileh: 100,sx: 0,sy: 0,w: 2000,h: 100});
    Q.sheet("eval","eval.png",{tilew: 70,tileh: 100,sx: 0,sy: 0,w: 2000,h: 100});
    Q.sheet("box","box.png",{tilew:200,tileh:200,sx:0,sy:0,w:4400,h:200});
    Q.sheet("skill","skill.png",{tilew:200,tileh:200,sx:0,sy:0,w:600,h:200});
    Q.sheet("hurt1","hurt1.png",{tilew:100,tileh:100,sx:0,sy:0});
    Q.sheet("hurt2","hurt2.png",{tilew:300,tileh:291,sx:0,sy:0});
    //Q.sheet("explode","explode.png",{tilew:150,tileh:128,sx:0,sy:0});
    Q.sheet("doge","doge.png",{tilew:110.5,tileh:100,sx:0,sx:0});
    Q.stageScene("level1");
    Q.stageScene("gameStats",999);
    Q_little.stageScene("level1");
  });
  modal["init"]=function(b){
    this.id="modal";
    this.style.width="300px";
    this.style.height="200px";
    this.style["font-size"]="18px";
    this.style.background="rgba(201,86,209,0.5)";
    this.style.color="white";
    this.style["z-index"]="3000";
    this.style.position="fixed";
    this.style.top="50px";
    this.style["text-align"]="center";
    this.style["font-size"]="50px";
    this.style["border-radius"]="20px";
    this.style["padding-top"]="50px";
    this.style.cursor="move";
    this.style.left="500px";
    this.style.top="300px";
    var mouseX, mouseY; 
    var moveX, moveY;
    var isDown=false; 
    this.onmousedown=function(e){
      mouseX=e.clientX;
      mouseY = e.clientY; 
      isDown=true;
    }
    if(b.closeKey){
      window.onkeydown=function(event){
        var e= event|| window.event||arguments.callee.caller.arguments[0];
        var key=e.which;
        if(key==b.closeKey){
          document.getElementById("container").removeChild(document.getElementById("modal"));
        }
      }
    }
    else{
      window.onkeydown=function(event){
        var e= event|| window.event||arguments.callee.caller.arguments[0];
        var key=e.which;
        if(key===27){
          document.getElementById("container").removeChild(document.getElementById("modal"));
        }
      }
    }
    
    if(b.draggable==false){
      this.style.cursor="";
    }
    else{
      this.onmousemove=function(e){
        if(isDown==true){
          var x=e.clientX;
          var y = e.clientY; 
          this.style.left=parseInt(this.style.left)+parseInt(x)-parseInt(mouseX)+"px";
          this.style.top=parseInt(this.style.top)+parseInt(y)-parseInt(mouseY)+"px";
          mouseX = x;
          mouseY = y;

        }
      }
      this.onmouseup=function(e){
        if(isDown==true){
          var x=e.clientX;
          var y = e.clientY; 
          this.style.left=parseInt(this.style.left)+parseInt(x)-parseInt(mouseX)+"px";
          this.style.top=parseInt(this.style.top)+parseInt(y)-parseInt(mouseY)+"px";
          mouseX = x;
          mouseY = y;
        }
        isDown=false;
      }
    }
    
    if(b.content){
      this.innerHTML=String(b.content);
    }    
    document.getElementById("container").appendChild(modal);
    var a=$("#modal");
    if(typeof a!="undefined"){
  	  setTimeout(function(){
  		document.getElementById("container").removeChild(document.getElementById("modal"));
  	  },1500);
    }
  }        
});