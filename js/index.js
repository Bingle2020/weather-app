$(function () {

    //查看本地是否已经有该城市信息
    // var city = JSON.parse(localStorage.getItem('city'));
    // if(city == null){
    //     var city = {};
    //     localStorage.setItem('city',JSON.stringify(city));
    // }

    // city['广州'] = {};

    //当前城市定位
    function initCity() {
        var city, districtCity;
        $.ajax({
            type: 'get',
            url: 'https://apis.map.qq.com/ws/location/v1/ip',
            data: {
                key: '4SFBZ-GEWKX-VBB4V-7YRTU-2W342-S5F3H',
                output: 'jsonp'
            },
            dataType: 'jsonp',
            success: function (data) {
                city = data.result.ad_info.city;
                districtCity = data.result.ad_info.district;
                //渲染天气信息
                $('.locate-city').text(city);
                getHours(city);
                getDays(city);
            }
        })
    }



    //获取当天24个小时天气信息
    function getHours(city) {
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/hourly',
            data: {
                location: city,
                key: 'a4ff400fbf8248508d80a775d56b35dd'
            },
            success: function (data) {
                console.log('24小时==>', data);
                var status = data.HeWeather6[0].status; //获取成功返回'ok'
                if (status == 'ok') {
                    var hour24 = data.HeWeather6[0].hourly;
                    //添加上栏
                    var $frag1 = $(document.createDocumentFragment());
                    for (var i = 0; i < 12; i++) {
                        var $li = $('<li></li>');
                        var str = `
                        <span class="now-tmp">${hour24[i].tmp}°</span>
                        <div class="chart">
                            <img src="./weather/${hour24[i].cond_txt}.png" class="auto-img">
                        </div>
                        <span class="time">${hour24[i].time.slice(-5)}</span>
                        `;
                        $li.html(str);
                        $frag1.append($li);
                    }
                    $('.lis-1').empty().append($frag1);

                    //添加下栏
                    var $frag2 = $(document.createDocumentFragment());
                    for (var j = 12; j < hour24.length; j++) {
                        var li = $('<li></li>');
                        var st = `
                       <span class="now-tmp">${hour24[j].tmp}°</span>
                       <div class="chart">
                           <img src="./weather/${hour24[j].cond_txt}.png" class="auto-img">
                       </div>
                       <span class="time">${hour24[j].time.slice(-5)}</span>
                       `;
                        li.html(st);
                        $frag2.append(li);
                    }
                    $('.lis-2').empty().append($frag2);
                } else
                    return;
            }
        })
    }


    //获取未来10天天气状况
    function getDays(city) {
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/forecast',
            data: {
                location: city,
                key: 'a4ff400fbf8248508d80a775d56b35dd'
            },
            success: function (data) {
                console.log('10天天气==>', data);
                var status = data.HeWeather6[0].status;
                if (status == 'ok') {
                    var day10 = data.HeWeather6[0].daily_forecast;

                    //修改城市
                    $('.nowCity').text(city);
                    $('.locate-city').text(city);

                    //动态添加当天天气信息
                    var hour = new Date().getHours();
                    var isDay = (hour >= 8 && hour < 20) ? true : false;
                    var str = `
                    <span>天气: ${isDay==true ? day10[0].cond_txt_d : day10[0].cond_txt_n}</span>
                    <span>温度: ${day10[0].tmp_min}° ~ ${day10[0].tmp_max}°</span>
                    <span>风向： ${day10[0].wind_dir}</span>
                    <span>时间： ${day10[0].date}</span>
                    `;
                    $('.other-state>div').empty().html(str);
                    //修改图标
                    $('.cityIcon>img').attr('src', './weather/' + (isDay == true ? day10[0].cond_txt_d : day10[0].cond_txt_n) + '.png');

                    //未来10天天气
                    var $frag = $(document.createDocumentFragment());
                    for (var i = 0; i < day10.length; i++) {
                        var $li = $('<li class="po-r"></li>');
                        var str = `
                        <span class="date fl">${day10[i].date.slice(0,4)}/${day10[i].date.slice(5,7)}/${day10[i].date.slice(-2)}</span>
                        <div class="day9-icon mid">
                            <img src="./weather/${day10[i].cond_txt_d}.png" class="auto-img">
                        </div>
                        <span class="date fr tr">${day10[i].tmp_max}°/${day10[i].tmp_min}°</span>
                        `;
                        $li.html(str);
                        $frag.append($li);
                    }
                    $('.day-lis').empty().append($frag);
                } else
                    return;
            }
        })
    }

    //初始化页面
    // initCity();

    //搜索城市
    $('.search').click(function () {
        var city = $('.input>input').val();

        getHours(city);

        getDays(city);
    })

    //点击箭头上拉未来9天天气
    $('.arrow-up').click(function () {
        $(this).animate({
            opacity: 0,
        }, 500);
        $('.arrow-down').animate({
            opacity: 1,
        }, 500);
        $('.day9').addClass('alterColor');
        $('.lo').animate({
            opacity: 1
        },500);
        $('.ve').animate({
            opacity: 1
        },500);     
    })
    //点击箭头收起未来9天天气
    $('.arrow-down').click(function () {
        $(this).animate({
            opacity: 0,
        }, 500);
        $('.arrow-up').animate({
            opacity: 1,
        }, 500);
        $('.day9').removeClass('alterColor');
        $('.lo').animate({
            opacity: 0
        },500);
        $('.ve').animate({
            opacity: 0
        },500);     
    })

    //激活搜索框
    $('.input').click(function(){
        $('.record').toggle();
    })

    
})