/*
 * ==========================================
// 夕空 | www.flashme.cn
 * ==========================================
*/
function filteroption($root,$id) {  //初始化列表，(对象,ID)
    $root.attr("thisid",$id);
    var tempul;
    tempul = $root.clone(true);
    tempul.children().each(function() {
        var htmword = $(this).html();
        var pyword = $(this).toPinyin();
        var supperword = "";
        pyword.replace(/[A-Z]/g, function(word) { supperword += word });
        $(this).attr("mka", (htmword).toLowerCase());
        $(this).attr("mkb", (pyword).toLowerCase());
        $(this).attr("mkc", (supperword).toLowerCase());
    });
    window[$id] = tempul;
}

//筛选符合的列表项
function resetOption(keys, $root) {
    if(!window[$root.attr("thisid")]){
        return;
    }
    keys = keys.toLowerCase();
    $root.children().remove();
    var duplul = window[$root.attr("thisid")];
    if (duplul==undefined){
        return false;
    }
    if (keys.length <= 0) {
        duplul.children().each(function() {
            $root.append($(this).clone(true).removeAttr("mka").removeAttr("mkb").removeAttr("mkc"));  
        });
        return;
    }
    duplul.children('[mka*="' + keys + '"],[mkb*="' + keys + '"],[mkc*="' + keys + '"]').each(function() {
        $root.append($(this).clone(true).removeAttr("mka").removeAttr("mkb").removeAttr("mkc"));
    });
}


//==========================================
// 搜索列表功能
//==========================================
function melist(){
    var soparams={};//存储链接事件
    $.fn.sotag=function(data,clear,taghtml,onclick){
        var $target=this;
        if(onclick){
            soparams[$target.attr('id')]=onclick;
        }
        if(clear){
            $target.html('');
        }
        if(data==undefined){
            return;
        }
        for(var i in data){
            var $this=$(taghtml);
            $this.data('id',data[i].id);
            $this.data('name',data[i].name);
            $this.data('link',data[i].link);
            $this.html(data[i].title);
            $target.append($this);
        }
    }
    $.fn.oladd=function(id,name,title,link){
        var $target=this.closest('.textroot').find('ol');
        $target.children('.start').remove();
        var newli=$($target.data('li'));
        newli.find("input").prop('checked', true);
        newli.find("input").val(id);
        newli.find('input').attr('name',name);
        newli.data('link',link);
        newli.data('title',title);
        newli.append(title);
        $target.append(newli);
        if($target.attr('linkage') && !link){
            $('body .sosobg').trigger("mousedown");
            $target.find("input[type=text]").hide();
        }
    }
    $.fn.olclear=function(){
        var $target=this.closest('.textroot').find('ol li');
        $target.trigger("click");
    }
    $('.textroot').each(function(){
        var activeArr=[];
        var $target=$(this);
        var type=$target.find("ol li input").attr('type');
        var olinput=$target.find("ol li").prop('outerHTML');//备份表单项
        $target.find("ol").data('li',olinput);
        var thisid=$target.find(".soso").attr('id');
        var startlink=$target.find(".soso").data('link');//起始ajax地址
        $target.find("ol li").addClass('start');

        //输入框变动事件
        $target.find("input[type=text]").bind("propertychange input focus",function(event){
            resetOption($.trim($(this).val()), $target.find(".soso"));
            inputfocus();
            sosoState();
        })
        function inputfocus(){
            $('.textroot .soso').hide();
            $('.textroot .more').hide();
            $('.textroot input[type=text]').css('z-index','98');
            if($target.find(".soso").html()!=""){
                if($('.sosobg').length<1){$target.append('<div class="sosobg"></div>');}
                $target.find(".soso").css({"display":"block"});
                $target.find(".soso").show();
                $target.find(".more").show();
                $target.find('input[type=text]').css('z-index','100');
            }
        }
        // 更新按钮选择状态
        function sosoState(){
            $target.find('.soso li').removeClass('active');
            for(var i=0;i<activeArr.length;i++){
                var li=$target.find(".soso li:contains('"+activeArr[i]+"')");
                if(li){
                    li.addClass('active');
                }
            }
        }
        $target.on('click','ol',function(event) {
            $target.find("input[type=text]").focus();
        });
        //列表点击事件
        $target.find(".soso").on('click','li',function(){
            if($(this).hasClass('active')){
                return;
            }
            $target.find("ol .start").remove();
            var newli=$(olinput);
            newli.find("input").prop('checked', true);
            newli.find("input").val($(this).data('id'));
            newli.find('input').attr('name',$(this).data('name'));
            newli.data('link',$(this).data('link'));
            newli.data('title',$(this).html());
            newli.append($(this).html());
            if(type=='radio'){
                $target.find('ol').html(newli);
                activeArr=[];
                sosoState();
            }else if($target.attr('linkage')){
                activeArr=[];
                $target.find('ol').append(newli);
            }else if(!$target.find('ol input[value="'+$(this).data('id')+'"]').prop('outerHTML')){
                $target.find('ol').append(newli);
            }
            var valObj={id:$(this).data('id'),title:$(this).html(),link:$(this).data('link')}
            //联动结尾隐藏输入框判断
            if($target.attr('linkage') && !$(this).data('link')){
                $('body .sosobg').trigger("mousedown");
                $target.find("input[type=text]").hide();
                $target.find(".soso").trigger("selected", valObj);
            }
            if(soparams[thisid] && $(this).data('link')){
                soparams[thisid]($(this).data('link'), thisid);
            }
            $(this).addClass('active');
            activeArr.push($(this).html());
            $target.find(".soso").trigger("select", valObj);
        })
        $target.find(".more").click(function(){
            setTimeout(function () {
                $target.find(".soso").css({"display":"table"});
                $target.find(".more").hide();
            }, 20);
        })
        $('body').on('mousedown','.sosobg',function(){
            $(this).remove();
            $target.find(".soso").hide();
            $target.find(".more").hide();
            $target.find("input[type=text]").val("");
            $target.find("input[type=text]").blur();
            $target.find("input[type=text]").css('z-index','98');
        });
        //结果项点击清除事件
        $target.find('ol').on('click','li',function(){
            var index=activeArr.indexOf($(this).data('title'));
            if(index>-1){
                activeArr.splice(index, 1);
            }
            //联动显示判断
            if($target.attr('linkage')){
                $(this).nextAll().remove();
                $target.find("input[type=text]").show();
                if(soparams[thisid]){
                    if($(this).prev().prop('outerHTML')){
                        soparams[thisid]($(this).prev().data('link'), thisid);
                    }else if($target.attr('linkage')=="all"){
                        soparams[thisid]($target.find(".soso").data('dataAll'), thisid);
                    }else{
                        startlink=$target.find(".soso").data('link');
                        soparams[thisid](startlink, thisid);
                    }
                }
                $target.find("input[type=text]").focus();
            }
            //判断是否删空
            if($(this).parent().children('li').length==1){
                $(this).parent().html($(olinput).addClass('start'));
            }else{
                $(this).remove();
            }
            //更新
            sosoState();
        })
        //键盘回车事件
        $target.keyup(function(event){
            if(event.keyCode ==13){
                $target.find('.soso li:eq(0)').trigger("click");
                $target.find("input[type=text]").val('');
                if($target.attr('linkage')){
                    return;
                }
                $target.find(".soso").hide();
                $target.find(".more").hide();
                return;
            }
        });
        // $target.find(".soso").hide();
        // $target.find(".more").hide();
    })
}

//START: Ajax获取列表&多级联动型
function linkageall(){
    
    function getLinkage(url,$target,linkage){
        $.ajax({
            url:url,
            dataType:"json",
            success:function(ev){

                //----更新列表内容
                if(linkage=='url'){
                    $target.sotag(ev.infor, true, '<li></li>', function(newurl,id){
                        getLinkage(newurl,$('#'+id),linkage);
                    });
                }else if(linkage=='all'){
                    $target.data('dataAll',ev.infor);
                    $target.sotag(ev.infor, true, '<li></li>', function(subData,id){
                        getLinkageAll(subData,$('#'+id));
                    });
                }else{
                    $target.sotag(ev.infor, true, '<li></li>');
                }
                filteroption($target, $target.attr('id'));
                //----
            },
            error: function (XHR) {
                console.log($target.attr('id')+'|'+url+'|'+XHR.status);
            }
        })
    }
    function getLinkageAll(subData,$target){
        $target.sotag(subData, true, '<li></li>', function(subData,id){
            getLinkageAll(subData,$('#'+id));
            filteroption($('#'+id), id);
        });
    }

    $('.textroot').each(function(){
        if($(this).find('.soso').data('link')){
            getLinkage($(this).find('.soso').data('link'), $(this).find('.soso'), $(this).attr('linkage'));
        }
    })
    
}
//END
