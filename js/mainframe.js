/*
*
* 订货宝系统主框架JS
* add by muyi 2018-04-27
*
*/

/*
* 菜单多页面tab切换效果
*/

$(function(){
    /*
    * 左侧菜单点击和主页的标签页的交互效果
    */

    //给左侧菜单所有的a标签按位置设置相应的id值
    $('.aside-wrap .navi-item .secend-item a').each(function(index,element){
        var y = index+1;
        $(this).attr("id","menu_"+y+"");
    });

    //左侧菜单a标签的点击事件
    $(document).on('click','.aside-wrap .navi-item .secend-item a',function(event){
        var tab_id = $(this).attr("id");
        //如果该元素data-tab属性为true（即已经在右侧打开了相关的页面），则只是控制右侧tab和页面的显示隐藏切换
        if($(this).attr("data-tab")){
            iframeTapShow(tab_id);
        }else{   //否则还没有打开右侧相关页面，则在右侧创建相关的tab选项和页面并选中显示
            var tab_text = $(this).text(),
                tab_href = $(this).attr("href");
            
            // 如果已有tab选项超过8个，则移除最后一个
            if ($('#main_menu ul li').length >= 8) {
                console.log("no more");
                var tabHide_id = $('#main_menu ul li:last').data("id");
                iframeTapHide(tabHide_id);
            }

            $('#main_menu ul li').removeClass("active");
            $('#main_menu ul').append('<li class="active" data-id='+tab_id+'>'+tab_text+'<i class="el-icon-close"></i></li>');
            $('#main_iframe .tab-pane').removeClass("active");
            $('#main_iframe').append('<div class="tab-pane active" data-id='+tab_id+'><iframe frameborder=0 width="100%" height="100%" src='+tab_href+'></iframe></div>');
            $(this).attr("data-tab",true);  // 设置点击元素data-tab属性为true，下次点击时则会执行上一个判断直接TAB切换

            // 检查tab显示数量是否超出
            // check_menusize();
        };
        event.preventDefault();
    })

    //主页的标签页点击和对应的页面、左侧菜单的交互效果
    $("#main_menu").on("click","ul li",function(){
        var tab_id = $(this).data("id");
        iframeTapShow(tab_id);
    });

    //主页标签页的关闭按钮点击事件
    $("#main_menu").on("click","ul li i",function(event){
        // 阻止事件冒泡
        event.stopPropagation();

        var $target_li = $(this).parent();
        var tab_id = $target_li.data("id");
        var $menu_li = $('.aside-wrap .navi-item .secend-item');

        if($target_li.is(".active")){  //点击删除时如果该标签为选中状态
            var tabHhow_id = "";
            if ($target_li.prev().length > 0) {
                tabHhow_id = $target_li.prev().data("id");
            }else if($target_li.next().length > 0){
                tabHhow_id = $target_li.next().data("id");
            }else{
                tabHhow_id = $("#main_iframe #defaultFrame").data("id");
            }
            iframeTapShow(tabHhow_id);
        };

        iframeTapHide(tab_id);
        
        // 检查tab显示数量是否超出
        // check_menusize();
    });

}); 

/*
* 切换打开的tab页面 js
* parme: tabHhow_id [string] 要切换为显示的iframe对应的id
*/
function iframeTapShow(tabHhow_id){
    $("#main_menu ul li[data-id="+tabHhow_id+"]").addClass("active").siblings().removeClass("active");  // tab页签添加选中、同级其他移除选中
    $("#main_iframe .tab-pane[data-id="+tabHhow_id+"]").addClass("active").siblings().removeClass("active");  //对应的iframe页面显示，其他页面隐藏
}

/*
* 移除制定的tab页面 js
* parme: tabHide_id [string] 要移除的iframe对应的id
*/
function iframeTapHide(tabHide_id){
    $("#main_menu ul li[data-id="+tabHide_id+"]").remove();  //移除该tab标签
    $("#main_iframe .tab-pane[data-id="+tabHide_id+"]").remove();   //移除对应iframe页面
    $(".aside-wrap .navi-item .secend-item").find("a[id="+tabHide_id+"]").removeAttr("data-tab");  //左侧菜单对应的a标签移除data-tab属性
}


// 检查头部tab页签显示数量是否超出，如超出则在最后一个tab显示下拉展示更多
function check_menusize(){
    var box_width = $("#main_menu").width(),
        other_width = $(".wrap-header-right-menu").outerWidth(),
        content_width = box_width - other_width - 100,
        item_width = $("#main_menu > ul > li").outerWidth(),
        item_lengrh = $("#main_menu > ul > li").length,
        item_max = Math.floor(content_width/item_width);
        console.log(item_max)
    if (item_lengrh > item_max) {

        var more_down = '<li class="dropdown_box">'
                            +'<span class="text">订单数据</span>'
                            +'<i class="el-icon-arrow-down"></i>'
                            +'<ul class="menu_dropdown">'
                            +
                            +'</ul>'
                        +'</li>'
        
    }
};

//页面大小变化调用的事件
$(window).resize(function(e) {
    // 检查tab显示数量是否超出
    // check_menusize();
});