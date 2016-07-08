var lastAdminTime = new Date();
var isThereAdmin = false;
var msgListener = io.connect('https://wall.cgcgbcbc.com');
$.get('https://wall.cgcgbcbc.com/api/messages?num=4',function(data){
	console.log(data);
	for (var i = data.length - 1; i >= 0; i--) {
		var newMsg = document.createElement('div');
		var msgName = document.createElement('h3');
		var msgPic = document.createElement('img');
		newMsg.setAttribute('class','slice');
		msgName.innerText = data[i].nickname;
		var len = data[i].content.length;
		if (len >= 20) {
			var msgCon = document.createElement('marquee');
			msgCon.innerText = data[i].content;
		}
		else{
			var msgCon = document.createElement('p');
			msgCon.innerText = data[i].content;
		}
		msgPic.src = data[i].headimgurl;
		newMsg.appendChild(msgName);
		newMsg.appendChild(msgCon);
		newMsg.appendChild(msgPic);
		switch(i){
			case 0:
				newMsg.setAttribute('id','one');
				break;
			case 1:
				newMsg.setAttribute('id','two');
				break;
			case 2:
				newMsg.setAttribute('id','three');
				break;
			default:
				newMsg.setAttribute('id','four');
				break;
		}
		$('#board')[0].appendChild(newMsg);
	}
});
msgListener.on('new message',function(data){
	console.log(data);
	var board = $('#board');
	//创建新的msg
	var newMsg = document.createElement('div');
	var msgName = document.createElement('h3');
	var msgPic = document.createElement('img');
	newMsg.setAttribute('class','slice');
	msgName.innerText = data.nickname;
	var len = data.content.length;
	if (len >= 20) {
		var msgCon = document.createElement('marquee');
		msgCon.innerText = data.content;
	}
	else{
		var msgCon = document.createElement('p');
		msgCon.innerText = data.content;
	}
	msgPic.src = data.headimgurl;
	newMsg.appendChild(msgName);
	newMsg.appendChild(msgCon);
	newMsg.appendChild(msgPic);
	
	//board[0].appendChild(newMsg);
	//移动版面
	newMsg.setAttribute('id','new');
	newMsg.setAttribute('class','slice');
	board[0].appendChild(newMsg);
	if (isThereAdmin == false) {
		var one = $('#one');
		one.addClass('animated slideOutLeft');
		setTimeout('clearOne()', 1000);
	}
	else{
		var two = $('#two');
		two.addClass('animated slideOutLeft');
		setTimeout('clearTwo()', 1000);
	}
	//newMsg.setAttribute('id','four');
	//newMsg.setAttribute('class','slice animated flipInX');
	
	
	//one[0].parentNode.removeChild(one[0]);
});
function clearOne(){
	var target = $('#one');
	target[0].parentNode.removeChild(target[0]);
	$('#two').animate({top:'100px'},"slow");
	$('#three').animate({top:'250px'},"slow");
	$('#four').animate({top:'400px'},"slow");
	$('#two')[0].setAttribute('id','one');
	$('#three')[0].setAttribute('id','two');
	$('#four')[0].setAttribute('id','three');
	var getNew = $('#new');
	getNew[0].setAttribute('class','slice animated flipInX');
	getNew[0].setAttribute('id','four');
};
function clearTwo(){
	var target = $('#two');
	target[0].parentNode.removeChild(target[0]);
	$('#three').animate({top:'250px'},"slow");
	$('#four').animate({top:'400px'},"slow");
	$('#three')[0].setAttribute('id','two');
	$('#four')[0].setAttribute('id','three');
	var getNew = $('#new');
	getNew[0].setAttribute('class','slice animated flipInX');
	getNew[0].setAttribute('id','four');
};
function replaceOne(){
	var target = $('#one');
	target[0].parentNode.removeChild(target[0]);
	var getNew = $('#newAd');
	getNew[0].setAttribute('class','slice admin animated flipInX');
	getNew[0].setAttribute('id','one');
}
msgListener.on('admin',function (data) {
	isThereAdmin = true;
	console.log(data);
	//初始化adminMsg
	var adminMsg = document.createElement('div');
	var adminNam = document.createElement('h3');
	var adminPic = document.createElement('img');
	adminMsg.setAttribute('class','slice admin');
	adminNam.innerText = data.nickname;
	adminPic.src = 'img/admin.png';
	var len = data.content.length;
	if (len >= 20) {
		var adminCon = document.createElement('marquee');
		adminCon.innerText = data.content;
	}
	else{
		var adminCon = document.createElement('p');
		adminCon.innerText = data.content;
	}
	adminMsg.appendChild(adminNam);
	adminMsg.appendChild(adminCon);
	adminMsg.appendChild(adminPic);
	adminMsg.setAttribute('id','newAd');
	var previousOne = $('#one');
	previousOne[0].setAttribute('class','animated flipOutX'); 
	var theboard = $('#board');
	theboard[0].appendChild(adminMsg);
	setTimeout('replaceOne()', 1000);
	lastAdminTime = new Date();
	//every 1000 second check admin status
	setTimeout('setAdminFalse()',10000);
});
function setAdminFalse(){
	var nowDate = new Date();
	var space = nowDate.getTime() - lastAdminTime.getTime();
	if (space >= 10000) {
		isThereAdmin = false;
	}
};
	
	