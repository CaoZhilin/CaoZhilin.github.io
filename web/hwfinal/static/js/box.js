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