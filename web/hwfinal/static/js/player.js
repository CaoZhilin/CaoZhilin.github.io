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