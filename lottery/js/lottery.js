var Lottery=function(t){this.wrap=t.wrap||null,this.items=t.items,this.button=t.button||null,this.index=0,this.count=16,this.timer=0,this.speed=200,this.times=0,this.cycle=50,this.prize=0,this.data=null,this.status=!1,this.init()};Lottery.prototype={constructor:Lottery,init:function(){this.events()},getData:function(t){var i=this;$.ajax({url:"../test.json",dataType:"jsonp",success:function(s){i.data=s,i.isRoll(t)}})},isRoll:function(t){var i=this.data,s=i.status;return-1==s?(alert("不可抽奖的情况"),void(t&&t())):(0==s&&this.prizeSet(i.id,t),void(-2==s&&this.prizeSet(Math.random()>.5?6:14,t)))},prizeSet:function(t,i){this.prize=t,this.stop(i)},actRoll:function(){var t=this.index;$("lottery-unit-"+t)[0]&&$("lottery-unit-"+t)[0].removeClass("cur"),t++,t>this.count&&(t=1),$("lottery-unit-"+t)[0].addClass("cur"),this.index=t},stop:function(t){var i=this,s=this.data,e=this.prize;this.times++,this.actRoll(),this.times>this.cycle+10&&e==this.index?(clearTimeout(this.timer),this.data&&(-2==s.status?setTimeout(function(){alert("谢谢参与")},500):setTimeout(function(){alert("中奖提示")},500)),t&&t()):(this.times<=this.cycle?this.speed-=10:this.times>this.cycle+10&&(0==this.prize&&16==this.index||this.prize==this.index+1)?this.speed+=110:this.speed+=20,this.speed<40&&(this.speed=40),this.timer=setTimeout(function(){i.stop(t)},i.speed))},events:function(){var t=this;this.button.on("click",function(){t.status||(t.status=!0,t.getData(function(){t.status=!1,t.prize=-1,t.times=0,t.speed=200}))})}},new Lottery({wrap:$("#lottery_box"),items:$("lottery-unit"),button:$("#lottery_start")});