/*没有数据库 用localStorage存储*/
var access={
	save:function(key,value){
        localStorage.setItem(key,JSON.stringify(value));
	},
	fetch:function(key){
       return JSON.parse(localStorage.getItem(key)) || [];//一开始没有所以返回空对象
	}
}

var lists=access.fetch("key");
/*数据*/
/*var lists=[
	{
		 title:"打你妹",
		 now_checked:false  //未选中 任务未完成
	},
	{
		 title:"打你gege",
		 now_checked:false
	}
]*/
/*过滤不同状态all unfinished finished 对应的lists数据的方法*/
         var filtered={
                    all:function(lists){
                           return lists;
                    },
                    finished:function(lists){
                           return lists.filter(function(item){
                                return item.now_checked;
                           })
                    },
                    unfinished:function(lists){
                           return lists.filter(function(item){
                                return !item.now_checked;
                           })
                      }
            }
/*vm实例*/
  var vm=new Vue({
		      el:".main",
		 data:{
			  All_lists:lists,
			  todo:"",//用v-model监控这个todo
			  edits:"",//记录是否双击
        beforetitle:"" ,//编辑之前的名字
			  visibility:"all"//目前全部显示
	},
	watch:{
        // All_lists:function(){//监控All_lists这个属性，当这个属性对应的值发生变化就会执行
        //         access.save("abc",this.All_lists);
        // }
        //上面是浅的监控只能监控到lists第一层的对象，对lists对象里面的对象如：now_checked
        //不能监控到它的状态所以就要改用 深监控如下
         All_lists:{handler:function(){
                    access.save("key",this.All_lists);
			        },
			        deep:true //深度监控
        }
	},
	computed:{//计算属性(模板是为了描述视图结构，不应该放太多的逻辑，所以就有了计算属性)
            noChecked:function(){
             return	this.All_lists.filter(function(item){ //原生数组的filter()方法返回匹配的新数组
                        return !item.now_checked
                     }).length
            },
            filteredlist:function(){//过滤的时候有三种情况 all finished unfinished 
                  /* switch(this.visibility){
                       case "all":
                       return filtered.all(lists);
                       break;

                       case "finished":
                       return filtered.finished(lists);
                       break;

                       case "unfinished":
                       return filtered.unfinished(lists);
                       break;
                       default:
                       return lists;//如果三种都不是默认显示全部
                   } */
                   /*直接像下面这样调用就不用像上面一样来判断了*/
                   return filtered[this.visibility]?filtered[this.visibility](lists):lists;
            }
	},
	methods:{
		     addTodo(){ /*es6 简写addTodo(){} 不用写成addTodo:function(){}这种形式*/
		                 //向lists中添加一个任务
		                 //事件处理函数中的this指向vue这个根实例
				             this.All_lists.push({
				                  title:this.todo,
				                  now_checked:false
				             });
				             this.todo="";//添加完后清空input里面的内容
		        },
		 
		     deleteTodo(oitem){//删除任务
		            var index=this.All_lists.indexOf(oitem);
		            this.All_lists.splice(index,1);//splice删除index位置的数组元素返回一个新数组
		        },
             editTodo(oitem){//双击编辑名字的方法
                    this.edits=oitem;
                    this.beforetitle=oitem.title;//记录编辑时的名字在esc撤销编辑时用
             },
             editTodoed(){//ipt编辑名字完成
                  this.edits="";
             },
             cancelTodo(oitem){//esc退出编辑
                  oitem.title=this.beforetitle;
                  this.edits="";
             }
      
            },
    directives:{//自定义指令focus
         "focus":{
         	update(el,binding){//el当前元素，binging元素上绑定的所有东西
              /* console.log(el);
               console.log(binding);*/
               //binding里的value之前是false现在反回true
               if(binding.value){
                	el.focus();
               }
         	}
         }
    }        
            
	
})

 /*用hash值完成 已完成任务 未完成任务 所有任务的切换*/
 /*通过不同的hash值显示不同的lists*/
 /*首先监控一下hash值*/
 function watch_change_hash(){
	var hash=window.location.hash.slice(1);
	/*console.log(hash);*/
	vm.visibility=hash;
}
watch_change_hash();

window.addEventListener("hashchange",watch_change_hash);









