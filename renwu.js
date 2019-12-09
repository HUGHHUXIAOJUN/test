var baseUrl = "http://payment.blogweekly.cn/";
// var wxAppId = 'wxd115cbc215788fe6'
var wxAppId = "wx4796258c2420401a";
var magazineList = []; //杂志列表
var swiperData = []; //预览
var itemPrice = 0; //假设单价为2
var totalPrice = 0;
var mySwiper = null;
var readCodeList = [];
var paying = false; //是否正在支付
var payParams = { itemId: null, productId: null, count: 1 };
// 去掉移动端alert链接
window.alert = function(name) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", "data:text/plain,");
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
};

function _getURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function onreadystatechange() {
        if (this.readyState === 4) {
            if (callback) callback(this.responseText);
            else callback(null);
        }
    };
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}
// 判断是否登录
_getURL("/clientservices/info/detail", function(result) {
    var message = "";
    result = JSON.parse(result);
    if (result.message && result.message.indexOf("未登录") > -1) {
        getCover(function() {
            $(".login").removeClass("hide");
        });
    } else {
        // 已经登录
        getMagazineList();
        getMyCodeList();
        getUserInfo();
        getCover();
    }
});

// 微信登录
$(".wechatLogin").on("click", function() {
    var appid = wxAppId;
    var url = baseUrl + "sso/wxlogin.aspx";
    window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        appid +
        "&redirect_uri=" +
        url +
        "&response_type=code&scope=snsapi_userinfo&state=mini#wechat_redirect";
    $(".login").addClass("hide");
});
// 初始化swiper
function initSwiper() {
    mySwiper = new Swiper(".swiper-container", {
        autoplay: 2000, //可选选项，自动滑动
        speed: 500,
        pagination: ".swiper-pagination",
        loop: true,
        observer: true,
        initialSlide: 0,
        autoplayDisableOnInteraction: false
    });
}

// tab切换
$(".main .tab .tabItem").on("click", function() {
    $(".main .tab .tabItem").removeClass("active");
    $(this).addClass("active");
    $(".main .content .conItem").addClass("hide");
    $(".main .content .conItem")
        .eq($(this).index())
        .removeClass("hide");
});

// 关闭购买阅读码框
$(".cancle").on("click", function() {
    $(".buyBoxInner").addClass("hide");
    $(".mask").addClass("hide");
    $("body").removeClass("hidden");
    // 重置
    $(".buyUl .buyItem").each(function(index, item) {
        $(item).removeClass("active");
        // $(item).find('img').attr('src', 'img/select.png')
    });
    totalPrice = 0;
    $(".totalPrice a").text(itemPrice.toFixed(2));
    $(".other .input").val("");
});
// 选择购买本数
$(".buyUl .buyItem").on("click", function() {
    $(".buyUl .buyItem").each(function(index, item) {
        // $(item).find('img').attr('src', 'img/select.png')
        $(item).removeClass("active");
    });
    // $(this).find('img').attr('src', 'img/selected.png')
    $(this).addClass("active");
    totalPrice = $(this)
        .find(".price")
        .find("a")
        .text();
    $(".other .input").val("");
    payParams.count = 1;
    var index = $(this).index();
    if (index == 0) {
        payParams.productId = "dzk1";
    } else if (index == 1) {
        payParams.productId = "dzk10";
    } else if (index == 2) {
        payParams.productId = "custom";
        payParams.count = 50;
    } else {
        payParams.productId = "dzk100";
    }
});
// 其他本数
$(".other .input").on("input", function(e) {
    var value = $(this).val();
    if (value <= 0 || !value) {
        $(this).val("");
        totalPrice = 0;
        $(".totalPrice a").text(itemPrice.toFixed(2));
        return;
    }
    payParams.productId = "custom";
    payParams.count = value;
    $(".buyUl .buyItem").each(function(index, item) {
        // $(item).find('img').attr('src', 'img/select.png')
        $(item).removeClass("active");
    });
    totalPrice = (itemPrice * value).toFixed(2);
    $(".totalPrice a").text(totalPrice);
});
// 继续购买(购买成功页面)
$(".continueBuy").on("click", function() {
    $(".buySuc").addClass("hide");
    $("body").removeClass("hidden");
    $("body").scrollTop(0);
});
// 查看全部(购买成功页面)
$(".seeAll").on("click", function() {
    $(".buySuc").addClass("hide");
    $("body").removeClass("hidden");
    $(".tab .tabItem").removeClass("active");
    $(".tab .tabItem")
        .eq(1)
        .addClass("active");
    $(".content .conItem")
        .addClass("hide")
        .eq(1)
        .removeClass("hide");
    $("body").scrollTop(0);
});
// 回到首页(预览页面)
$(".backIndex").on("click", function() {
    $(".previeBox").addClass("hide");
    $(".swiper-wrapper").html("");
    mySwiper.destroy(false, true);
});

// 点击购买说明
$(".buyBoxInner .tips").on("click", function() {
    $(".buyExplain").removeClass("hide");
});
// 关闭购买说明
$(".buyExplain .know").on("click", function() {
    $(".buyExplain").addClass("hide");
});
// $('.buyExplain .tipsClose').on('click', function () {
//     $('.buyExplain').addClass('hide')
// })
// 获取封面
function getCover(fn) {
    $.ajax({
        type: "GET",
        url: "/clientservices/item/v2/new",
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        success: function(res) {
            if (res.isSuc) {
                var itemCover = res.result.ItemCover;
                var ItemDescription = res.result.Title;
                $(".itemCover").attr("src", itemCover);
                $(".topLogo").attr("src", itemCover);
                weixinload(itemCover, ItemDescription);
                fn && fn();
            }
        }
    });
}
// 获取个人信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/clientservices/info/info",
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        success: function(res) {
            if (res.isSuc && res.result) {
                var Avatar = res.result.Avatar;
                var NickName = res.result.NickName;
                $(".avatar").attr("src", Avatar);
                $(".nickname").html(NickName);
            }
        }
    });
}
// 获取杂志列表
function getMagazineList() {
    $.ajax({
        type: "GET",
        url: "/clientservices/item/v2/all",
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        success: function(res) {
            if (res.isSuc) {
                magazineList = res.result.Items;
                var str = "";
                magazineList.forEach(function(item, index) {
                    if (index == 0) {
                        str +=
                            "<div class='magazineFirst'><img class='poster' src = " +
                            item.ItemCover +
                            "><img class='icon' src='https://xyyitemssl.blogweekly.cn/20181113/sign2.png'><div class='mContent'><p class='title'>" +
                            item.Title +
                            "</p><div class='pm'><span class='salecount'>销量: <a>" +
                            item.ReadCount +
                            "</a></span><span class='price'>￥<a>" +
                            item.Price.toFixed(2) +
                            "</a></span></div><div class='btns'><button class='preview' index=" +
                            index +
                            ">高清预览</button><button class='buyCode' index=" +
                            index +
                            ">购买阅读码</button></div></div></div>";
                        // str += "<div class='magazineFirst'><img class='poster' src = " + item.ItemCover + "><img class='icon' src='img/sign.png'><div class='mContent'><div class='contentRight'><p class='title'>" + item.Title + "</p><div class='pm'><span class='price'>￥<a>" + item.Price.toFixed(2) + "</a></span><span class='salecount'>销量: <a>" + item.ReadCount + "</a></span></div><div class='btns'><button class='preview' index=" + index + ">预览</button><button class='buyCode' index=" + index + ">购买阅读码</button></div></div></div></div>"
                    } else {
                        str +=
                            " <div class='magazineOther'><img class='otherLeft' src = " +
                            item.ItemCover +
                            "><div class='otherRight'><h3 class='otherTitle'>" +
                            item.Title +
                            "</h3><p class='otherPrice'>￥" +
                            item.Price.toFixed(2) +
                            "</p><p class='saleCount'>销量：" +
                            item.ReadCount +
                            "</p></div><div class='preview' index=" +
                            index +
                            ">高清预览</div><div class='buyCode' index=" +
                            index +
                            ">购买阅读码</div></div >";
                    }
                });
                $(".magazine").html(str);
            }
        }
    });
}
// 获取我的券码列表
function getMyCodeList(fn) {
    $.ajax({
        type: "POST",
        url: "/clientservices/coupon/my",
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ query: { pageIndex: 1, pageSize: 1000 } }),
        success: function(res) {
            if (res.isSuc) {
                readCodeList = res.result.Items;
                var str = "";
                readCodeList.forEach(function(item, index) {
                    str +=
                        "<div class='codeItem'><img class='cover' src =" +
                        item.ItemCover +
                        "><div class='rightCon'><p class='title'>" +
                        item.Title +
                        "</p><div class='readcode'>阅读码: <span>" +
                        item.CouponNum +
                        "</span></div><div class='codeBtns'><button class='useTips'>使用说明</button>" +
                        (item.State == 0
                            ? "<button class='notUse'>复制</button>"
                            : "<button class='used'>已使用</button>") +
                        "</div></div></div>";
                    // str += "<div class='codeItem'><img class='cover' src = " + item.ItemCover + "><div class='rightCon'><p class='title'>" + item.Title + "</p><div class='readcode'>阅读码: <span>" + item.CouponNum + "</span>" + (item.State == 0 ? "<img class='copy' src='img/copy.png' >" : "") + "</div>" + (item.State == 0 ? "<button class='notUse'>未使用</button>" : "<button class='used'>已使用</button>") + "</div></div>"
                });
                $(".readCode").html(str);
                fn && fn();
            }
        }
    });
}

// 点击杂志(预览或在购买阅读码)
$(".magazine").on("click", function(e) {
    if (!e.target.attributes.index) {
        return;
    }
    var className = e.target.className;
    var index = e.target.attributes.index.nodeValue;
    var Price = magazineList[index].Price; //一本的价格
    itemPrice = magazineList[index].Price;
    var Price10 = magazineList[index].Price10; //10本的价格
    var Price50 = magazineList[index].Price50; //50本的价格
    var Price100 = magazineList[index].Price100; //100本的价格
    var Title = magazineList[index].Title;
    $(".buyUl .buyItem")
        .eq(0)
        .find(".price")
        .find("a")
        .html(Price);
    $(".totalPrice a").html(Price);
    $(".buyUl .buyItem")
        .eq(1)
        .find(".price")
        .find("a")
        .html(Price10);
    $(".buyUl .buyItem")
        .eq(2)
        .find(".price")
        .find("a")
        .html((itemPrice * 50).toFixed(2));
    $(".buyUl .buyItem")
        .eq(3)
        .find(".price")
        .find("a")
        .html(Price100);
    $(".buyBoxInner .title").html(Title);
    // $('.preTitle').html(Title)
    swiperData = magazineList[index].ItemPreviewPic;
    payParams.itemId = magazineList[index].ItemId;
    // 默认第一本-start
    payParams.count = 1;
    payParams.productId = "dzk1";
    totalPrice = magazineList[index].Price;
    $(".buyUl .buyItem")
        .eq(0)
        .addClass("active");
    // 默认第一本-end
    if (className == "preview") {
        // 预览
        $(".previeBox").removeClass("hide");
        initSwiperDom(swiperData, function() {
            setTimeout(() => {
                initSwiper();
            }, 500);
        });
    } else if (className == "buyCode") {
        // 购买阅读码
        $(".buyBoxInner").removeClass("hide");
        $(".mask").removeClass("hide");
        $("body").addClass("hidden");
    }
});
// 点击购买阅读码(预览页)
$(".buyCodeBtn .buyCode").on("click", function() {
    $(".previeBox").addClass("hide");
    $(".buyBoxInner").removeClass("hide");
    $(".mask").removeClass("hide");
    $(".swiper-wrapper").html("");
    mySwiper.destroy();
});
function initSwiperDom(arr, fn) {
    var str = "";
    arr.forEach(function(item) {
        str +=
            "<div class='swiper-slide'><img src = " + item.PreviewPic + "></div >";
    });
    $(".swiper-wrapper").html(str);
    fn && fn();
}
// 复制(阅读码列表)
$(".readCode").on("click", ".notUse", function(e) {
    const range = document.createRange();
    range.selectNode(
        $(this)
            .parents(".codeBtns")
            .siblings(".readcode")
            .find("span")[0]
    );
    const selection = window.getSelection();
    if (selection.rangeCount > 0) selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    alert("复制成功！");
});
// 使用说明
$(".readCode").on("click", ".useTips", function() {
    $(".userTipsBox").removeClass("hide");
});
$(".userTipsBox").on("click", function() {
    $(this).addClass("hide");
});
// 复制(支付成功)
$(".copyCode").on("click", function(e) {
    console.log(e);
    if (
        e.target.className == "copyCode" ||
        e.target.parentNode.className == "copyCode"
    ) {
        const range = document.createRange();
        range.selectNode($(this).find("a")[0]);
        const selection = window.getSelection();
        if (selection.rangeCount > 0) selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        alert("复制成功！");
    }
});
// 确认支付
$(".surePay").on("click", function() {
    console.log(payParams);

    if (totalPrice == 0) {
        alert("请选择或输入购买数量");
        return;
    }
    if (paying) {
        return;
    }
    paying = true;
    $.ajax({
        type: "POST",
        url: "/clientservices/couponorderform/order",
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(payParams),
        success: function(res) {
            if (res.isSuc) {
                var OrderId = res.result.OrderId;
                getConfig(function() {
                    startWxPay(OrderId);
                });
            }
        },
        compvare: function() {}
    });
});

// 获取配置
function getConfig(fn) {
    $.ajax({
        type: "GET",
        url: "/clientservices/couponorderform/getpayconfig",
        beforeSend: function() {},
        success: function(data) {
            data = data.result;
            wx.config({
                debug: false, // 开启调试模式,成功失败都会有alert框
                appId: wxAppId, // 必填，公众号的唯一标识
                timestamp: data.timeStamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature, // 必填，签名
                jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表
            });
            wx.ready(function() {});
            wx.error(function(res) {});
            fn && fn();
        }
    });
}

function GetJsonData(OrderId) {
    var json = {
        orderid: OrderId
    };
    return json;
}
// 支付
function startWxPay(OrderId) {
    $.ajax({
        type: "POST",
        url: "/clientservices/couponorderform/getpaysign4buycoupon",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(GetJsonData(OrderId)),
        beforeSend: function() {},
        success: function(res) {
            res = res.result;
            wx.chooseWXPay({
                timestamp: res.timeStamp, // 支付签名时间戳
                nonceStr: res.nonceStr, // 支付签名随机串，不长于32 位
                package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: res.paysign, // 支付签名
                success: function(res) {
                    //支付成功
                    $(".buySuc ").removeClass("hide");
                    $(".buyBoxInner").addClass("hide");
                    $(".mask").addClass("hide");
                    $(".loading").removeClass("hide");
                    var timer = setInterval(function() {
                        getOrderState(OrderId, function(arg) {
                            if (arg.State == 1) {
                                clearInterval(timer);
                                $(".loading").addClass("hide");
                                getMyCodeList(function() {
                                    var readCode = readCodeList[0].CouponNum;
                                    $(".copyCode a").text(readCode);
                                    paying = false;
                                });
                            }
                        });
                    }, 1000);
                    // setTimeout(function () {
                    //     getMyCodeList()//重新获取我的阅读码
                    // }, 5000)
                },
                complete: function() {
                    paying = false;
                },
                cancel: function(res) {
                    paying = false;
                }
            });
        },
        fail: function() {}
    });
}
// 获取订单状态
function getOrderState(orderId, fn) {
    $.ajax({
        type: "POST",
        url: "/clientservices/couponorderform/orderstate",
        headers: {
            Accept: "application/json; charset=utf-8"
        },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({ orderId: orderId }),
        success: function(res) {
            if (res.isSuc) {
                fn && fn(res.result);
            }
        },
        fail: function(res) {},
        compvare: function(res) {}
    });
}
function weixinload(itemCover, ItemDescription) {
    if (navigator.userAgent.indexOf("MicroMessenger") >= 0) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function onreadystatechange() {
            if (this.readyState === 4) {
                eval("ret=" + this.responseText);

                if (ret.error == 0) {
                    wx.config({
                        debug: false,
                        appId: wxAppId,
                        timestamp: ret.timestamp,
                        nonceStr: "weixin",
                        signature: ret.sign4,
                        jsApiList: [
                            // 所有要调用的 API 都要加到这个列表中
                            "checkJsApi",
                            "onMenuShareTimeline",
                            "onMenuShareAppMessage",
                            "onMenuShareQQ",
                            "onMenuShareWeibo"
                        ]
                    });
                    wx.ready(function() {
                        //分享给好友
                        wx.onMenuShareAppMessage({
                            title: "人物新面孔",
                            desc: ItemDescription,
                            link: baseUrl + "page/index.html",
                            imgUrl: itemCover,
                            trigger: function(res) {},
                            success: function(res) {},
                            cancel: function(res) {},
                            fail: function(res) {}
                        });
                        //分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: "人物新面孔",
                            link: baseUrl + "page/index.html",
                            imgUrl: itemCover,
                            trigger: function(res) {},
                            success: function(res) {},
                            cancel: function(res) {},
                            fail: function(res) {}
                        });
                    });
                    //end+
                }
            }
        };
        xhr.open("POST", baseUrl + "services/sign.ashx");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("url2=" + encodeURIComponent(location.href));
    }
    //---wx sign end-----
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}

// $('.mask').on('touchmove', function (e) {
//     e.preventDefault();
// })
// $('.buyBox').on('click', function (e) {
//     e.preventDefault();
// })
$(".previeBox").on("touchmove", function(e) {
    e.preventDefault();
});
$(".buyExplain").on("touchmove", function(e) {
    e.preventDefault();
});
$(".buySuc").on("touchmove", function(e) {
    e.preventDefault();
});

var bfscrolltop = document.body.scrollTop;
$("input")
    .focus(function() {
        interval = setInterval(function() {
            document.body.scrollTop = document.body.scrollHeight;
        }, 1000);
    })
    .blur(function() {
        clearInterval(interval);
        document.body.scrollTop = bfscrolltop;
    });