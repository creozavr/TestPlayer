/**
 * Created with IntelliJ IDEA.
 * User: Yurchik
 * Date: 14.06.15
 * Time: 13:53
 * To change this template use File | Settings | File Templates.
 */
InteractiveTask.Health = function(options){
  	this.xml = options.xml;
	this.controller = options.controller;

	this.totalHealth = 0;
	this.currentHealth = 0;

	this.isMnimoe = (this.xml.MNIMOE == "true");
	this.isTest = this.controller.isTest();
	this.isFirstLevel = (this.xml["-level"] == "1");

	this.layer = new Kinetic.Layer();
	this.healthes = new Array();
};
InteractiveTask.Health.prototype.isInitHealth = function(){
	if(this.xml.MISSTAKE_COUNTER==undefined){
		this.xml.MISSTAKE_COUNTER = 2;
	};
	if(this.xml.CURRENT_HEALTH==undefined){
		this.updateCurrentHealth();
	};

	if(this.xml.CURRENT_HEALTH == 0){
		if(this.isTest){
			this.controller.misstake();
			return false;
		}else{
			this.updateCurrentHealth();
		};
	};
	this.totalHealth = parseInt(this.xml.HEALTH);
	this.currentHealth = this.xml.CURRENT_HEALTH;
	if(this.currentHealth>this.totalHealth || this.currentHealth<=0){
		this.controller.misstake();
		return false;
	};
	return true;
};
InteractiveTask.Health.prototype.setTimer = function(timer){
  	this.timer = timer;
};

InteractiveTask.Health.prototype.start = function(){
	var i,
		x, y, image, position;
	image = InteractiveTask.LIBRARY.getButton(InteractiveTask.CONST.HEALTH);
	position = InteractiveTask.CONST.HEALTH_POSITION;
	for(i=0;i<this.totalHealth;i++){
		x = InteractiveTask.CONST.HEALTH_START_X + i*(InteractiveTask.CONST.HEALTH_WIDTH+InteractiveTask.CONST.HEALTH_DELTA_X);
		y = InteractiveTask.CONST.HEALTH_START_Y;
		this.healthes[i] = new Kinetic.Sprite({
			x : x,
			y : y,
			image : image,
			animation : 'standing',
			animations : {
				standing: position
			},
			frameRate :10,
			frameIndex : 0
		});
		this.layer.add(this.healthes[i]);
	};
	for(i=0;i<(this.totalHealth - this.currentHealth);i++){
		this.healthes[this.totalHealth - (i+1)].frameIndex(1);
	};
	InteractiveTask.STAGE.add(this.layer);
	this.layer.draw();
};

InteractiveTask.Health.prototype.makeMisstake = function(){
	--this.currentHealth;
	this.xml.CURRENT_HEALTH = this.currentHealth;
	var i;
	for(i=0;i<(this.totalHealth - this.currentHealth);i++){
		this.healthes[this.totalHealth - (i+1)].frameIndex(1);
	};
	this.layer.draw();
	if(this.currentHealth == 0){
		if(this.isTest){
			this.controller.misstake();
		}else{
			if(this.isFirstLevel){
				--this.xml.MISSTAKE_COUNTER;
				if(this.timer != undefined){
					this.timer.updateBackTimer();
				};
				if(this.xml.MISSTAKE_COUNTER<=0){
					this.controller.doubleMisstake();
				}else{
					this.controller.misstake();
				};
			}else{
				this.controller.misstake();
			};
		};
	};
};

InteractiveTask.Health.prototype.getCurrentHealth = function(){
	return this.currentHealth;
};
InteractiveTask.Health.prototype.clear = function(){
	if(!this.layer) return;
	for(i=0;i<this.totalHealth;i++){
		this.healthes[i].remove();
		this.healthes[i] = null;
	};
	this.layer.remove();
	this.layer = null;
};

InteractiveTask.Health.prototype.updateCurrentHealth = function(){
	var h = parseInt(this.xml.HEALTH);
	this.xml.CURRENT_HEALTH = h;
};
