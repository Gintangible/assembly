var ServerList=function(){var i=function(i,n){$.getJSON("//gamebox.2144.cn/v1/server/list/gid/"+i+"?callback=?",function(i){"function"==typeof n&&i&&i.data&&$.isArray(i.data.items)&&i.data.items.length&&(console.time("renderAll"),n(i.data.items))})},n=function(i){for(var n,e=i.slice(),s=[],t=30;i.length>t;)n=i.splice(i.length-t,t),s.unshift({items:n,end:n[0].sid,begin:n[n.length-1].sid});return i.length&&(n=e.slice(0,t),s.unshift({items:n,end:n[0].sid,begin:n[n.length-1].sid})),s},e=function(i,n){var e=n.reduce(function(i,n,e){return[i,"<ul",e?' class="hidden"':"",">",n.items.reduce(function(i,n){return[i,'<li><a href="',n.api.replace(/"/g,"&quot;"),'">',n.s_name,"</a></li>"].join("")},""),"</ul>"].join("")},"");i.find(".sl_bd").html(e)},s=function(i,n){if(!(n.length<=1)){var e=['<div class="sl_ft">','	<div class="sl_view">','		<div class="sl_sport">',function(){var i,e=4,s=[];for(i=0;i<n.length;i+=e)s.push(n.slice(i,i+e));return s.reduce(function(i,n,s){return[i,"<ul>",n.reduce(function(i,n,t){var l=s*e+t,d=[n.begin,"-",n.end].join("");return[i,'<li><span data-index="',l,'">',d,"</span></li>"].join("")},""),"</ul>"].join("")},"")}(),"		</div>","	</div>","</div>"].join("");i.find(".sl_bd").after(e),i.on("click","span[data-index]",function(){var n=$(this),e=n.attr("data-index");i.find(".sl_bd ul").addClass("hidden").eq(e).removeClass("hidden")})}},t=function(t,d){l();var a=$(['<div class="server_list">','	<div class="sl_line"></div>','	<div class="sl_cont">','		<div class="sl_hd">',"			<h2>选择服务器</h2>",'			<span class="sl_close"></span>',"		</div>",'		<div class="sl_bd">','			<div class="sl_loading"><i></i>加载中，请稍后...</div>',"		</div>","	</div>","</div>"].join("")).appendTo(document.body).on("click",".sl_close",function(){l()});i(t,function(i){var t=n(i);e(a,t),s(a,t),console.timeEnd("renderAll")})},l=function(){$(".server_list").remove()},d=function(){t.apply(this,arguments)},a=function(){l.apply(this,arguments)};return{show:d,hide:a}}();ServerList.show(92);