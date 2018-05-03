/*
*
* 订货宝系统主框架JS
* add by muyi 2018-04-27
*
*/

/*
* 菜单多页面tab切换效果
*/

var dropdownActiceId = ""; // 定义全局变量：下拉菜单选中项ID
var menuTabShowTargetbox = ".leftBar .secend-item",   // 触发菜单显示的a标签容器
    menuTabShowTarget = ".leftBar .secend-item a";    // 触发菜单显示的a标签

$(function(){
    /*
    * 左侧菜单点击和主页的标签页的交互效果
    */

    //给左侧菜单所有的a标签按位置设置相应的id值
    $(menuTabShowTarget).each(function(index,element){
        var y = index+1;
        $(this).attr("id","menu_"+y+"");
    });

    //左侧菜单a标签的点击事件
    $(document).on('click',menuTabShowTarget,function(event){
        var tab_id = $(this).attr("id");
        //如果该元素data-tab属性为true（即已经在右侧打开了相关的页面），则只是控制右侧tab和页面的显示隐藏切换
        if($(this).attr("data-tab")){
            iframeTapShow(tab_id,true);
        }else{   //否则还没有打开右侧相关页面，则在右侧创建相关的tab选项和页面并选中显示
            var tab_text = $(this).text(),
                tab_href = $(this).attr("href");

            // 如果当前页无tab下拉页签
            if ($("#main_menu ul > .dropdown_box").length == 0) {
                var $menu_box = $('#main_menu ul');
            }else{  // 如果当前已有tab页签超出下拉
                var $menu_box = $('#main_menu ul .dropdown_box .menu_dropdown');
            }

            $menu_box.append('<li data-id='+tab_id+'>'+tab_text+'<i class="el-icon-close"></i></li>');

            if ($("#main_menu ul > .dropdown_box").length == 0) {
                // 检查tab显示数量是否超出
                reset_menudrop();
            }
            $('#main_iframe').append('<div class="tab-pane" data-id='+tab_id+'><iframe frameborder=0 width="100%" height="100%" src='+tab_href+'></iframe></div>');
            iframeTapShow(tab_id);
            $(this).attr("data-tab",true);  // 设置点击元素data-tab属性为true，下次点击时则会执行上一个判断直接TAB切换

        };
        event.preventDefault();
    })

    //主页的标签页点击和对应的页面、左侧菜单的交互效果
    $("#main_menu").on("click","ul li:not(.dropdown_box)",function(e){
        var tab_id = $(this).data("id");
        iframeTapShow(tab_id);
        e.stopPropagation();
    });

    //主页标签页的关闭按钮点击事件
    $("#main_menu").on("click","ul li i.el-icon-close",function(event){
        // 阻止事件冒泡
        event.stopPropagation();

        var $target_li = $(this).parent();
        var tab_id = $target_li.data("id");
        var $menu_li = $(menuTabShowTargetbox);

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

        // 如果点击的是下拉操作中的tab页签并且下拉页只有2项
        if ($(this).parents(".dropdown_box").length > 0 && $target_li.siblings().length == 1) {
            $target_li.siblings().appendTo($("#main_menu ul"));
            $(this).parents(".dropdown_box").remove();
        }

        iframeTapHide(tab_id);

        // 检查tab显示数量是否超出
        reset_menudrop();
    });

    // 下拉页签点击切换选中效果
    $(document).on("click","#main_menu .dropdown_box #menu_name",function(){
        if ($(this).parent().is(".active")) return;
        iframeTapShow(dropdownActiceId);
    })

    //页面大小变化调用的事件
    $(window).resize(function() {
        // 检查tab显示数量是否超出
        reset_menudrop();
    });
}); 

/*
* 切换打开的tab页面 js
* parme: tabHhow_id [string] 要切换为显示的iframe对应的id
*/
function iframeTapShow(tabHhow_id,reload){
    var $chooseMenu = $("#main_menu ul li[data-id="+tabHhow_id+"]");
    // tab页签添加选中、同级其他移除选中
    $("#main_menu li").removeClass("active");
    $chooseMenu.addClass("active");
    $("#main_iframe .tab-pane[data-id="+tabHhow_id+"]").addClass("active").siblings().removeClass("active");  //对应的iframe页面显示，其他页面隐藏
    // 当前选中项为更多下拉项
    set_dropattr();
    // if (reload == true) {
    //     $("#main_iframe .tab-pane[data-id="+tabHhow_id+"]").find("iframe").location.reload();
    // }
}

/*
* 移除制定的tab页面 js
* parme: tabHide_id [string] 要移除的iframe对应的id
*/
function iframeTapHide(tabHide_id){
    $("#main_menu ul li[data-id="+tabHide_id+"]").remove();  //移除该tab标签
    $("#main_iframe .tab-pane[data-id="+tabHide_id+"]").remove();   //移除对应iframe页面
    $(menuTabShowTargetbox).find("a[id="+tabHide_id+"]").removeAttr("data-tab");  //左侧菜单对应的a标签移除data-tab属性
}


// 根据页面分辨率检查当前最多可显示tab页签数量
function check_menumax(){
    var box_width = $("#main_menu").width(),
        other_width = $(".wrap-header-right-menu").outerWidth(),
        content_width = box_width - other_width - 100,
        item_width = $("#main_menu > ul > li").outerWidth(),
        item_max = Math.floor(content_width/item_width);

    return item_max;
}

// 检查头部tab页签显示数量是否超出，如超出则在最后一个tab显示下拉展示更多
function reset_menudrop(){
    var item_length = $("#main_menu > ul > li:not(.dropdown_box)").length,
        item_max = check_menumax();
        console.log(item_max,item_length);
    if (item_length > item_max) {
        if ($("#main_menu ul > .dropdown_box").length == 0) {
            var more_down = '<li class="dropdown_box">'
                    +'<span id="menu_name"></span>'
                    +'<i class="el-icon-arrow-down"></i>'
                    +'<ul class="menu_dropdown">'
                    +'</ul>'
                +'</li>';
            $("#main_menu ul").append(more_down);
        }
        var appendToDrop = $("#main_menu > ul > li:not(.dropdown_box):gt("+(item_max-2)+")");
        var $menu_box = $('#main_menu ul .dropdown_box .menu_dropdown');
        $menu_box.prepend(appendToDrop);
        set_dropattr("first");
    }else if (item_length < item_max-1 && $("#main_menu ul > .dropdown_box").length > 0) {
        var canshow_length = item_max - item_length;
        var drop_length = $("#main_menu ul > .dropdown_box li").length;
        if (canshow_length >= drop_length) {
            $("#main_menu ul > .dropdown_box li").appendTo($("#main_menu ul"));
            $("#main_menu ul > .dropdown_box").remove();
        }else{
            $("#main_menu ul > .dropdown_box").before($("#main_menu ul > .dropdown_box li:lt("+(canshow_length-1)+")"));
            set_dropattr("first");
        }
    }
};

// 判断选中项是否在下拉菜单中，设置下拉菜单标题及是否选中
function set_dropattr(first){
    // 当前选中项为更多下拉项
    var $chooseMenu = $("#main_menu ul li:not(.dropdown_box).active");
    if ($chooseMenu.parents(".dropdown_box").length > 0) {
        dropdownActiceId = $chooseMenu.data("id");
        $("#main_menu .dropdown_box").addClass("active");
        $("#menu_name").text($chooseMenu.text());
    }else if (first=="first") {
        var $chooseMenu = $("#main_menu ul > .dropdown_box li:last");
        dropdownActiceId = $chooseMenu.data("id");
        $("#main_menu .dropdown_box").removeClass("active");
        $("#menu_name").text($chooseMenu.text());
    }
}