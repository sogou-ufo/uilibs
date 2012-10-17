<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>jQuery ui plugin uuiTimer</title>
    <style type="text/css">
        html, body, div, span, applet, object, iframe,
        h1, h2, h3, h4, h5, h6, p, blockquote, pre,
        a, abbr, acronym, address, big, cite, code,
        del, dfn, em, img, ins, kbd, q, s, samp,
        small, strike, strong, sub, sup, tt, var,
        b, u, i, center,
        dl, dt, dd, ol, ul, li,
        fieldset, form, label, legend,
        table, caption, tbody, tfoot, thead, tr, th, td,
        article, aside, canvas, details, embed, 
        figure, figcaption, footer, header, hgroup, 
        menu, nav, output, ruby, section, summary,
        time, mark, audio, video {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
        }
        /* HTML5 display-role reset for older browsers */
        article, aside, details, figcaption, figure, 
        footer, header, hgroup, menu, nav, section {
            display: block;
        }
        body {
            line-height: 1;
        }
        ol, ul {
            list-style: none;
        }
        blockquote, q {
            quotes: none;
        }
        blockquote:before, blockquote:after,
        q:before, q:after {
            content: '';
            content: none;
        }
        table {
            border-collapse: collapse;
            border-spacing: 0;
        }
    </style>
        <?php
        if(file_exists('conf.php'))require_once('conf.php');
        if(!isset($_GET['mobile'])){
            $dir = './css';
            if(is_dir($dir)){ 
                if($dp = opendir($dir)){ 
                    while(($file=readdir($dp)) != false){ 
                        if(!is_dir($dir.'/'.$file)){ 
                        echo '<link rel="stylesheet" href="./css/' . $file . '" type="text/css"/>';
                        } 
                    } 
                    closedir($dp); 
                }else{ 
                    exit('Not permission'); 
                } 
            }  
        }
        ?>
    <script src="http://d.123.sogou.com/jsn/lib/ufo.js"></script>
    <?php if(isset($uiconf)){?>
    <script>
    <?php 
        echo file_get_contents($uiconf['path'] . '/../base/base.js');
    ?>
    </script>
    <?php }?>
    <?php if(isset($_GET['mobile'])){ ?>
    <script src="./build/js/mobile.uuiTimer.js"></script>
    <?php }else{ ?>
    <script src="./js/uuiTimer.js"></script>
    <?php }?>
    <link rel="stylesheet" href="http://ufo.sogou-inc.com/pingback/main.css" type="text/css" media="screen"/>
</head>
<body>
<div class="header">
        <h1>
            <img src="http://ufo.sogou-inc.com/static/logo/logo-white.png" class="" alt="" style="padding:0 20px 0 0;position:relative;top:5px;">
            uuiTimer TEST page
        </h1>
    </div>
    <div class="content">
        <div class="content-inner">
            <p><a href="./doc/uuiTimer/index.html" target="_blank">preview doc[exc "ui doc first"]</a></p>
            <br />
                <p>                                                                                                           
                <?php if(isset($_GET['mobile'])){ ?>                                                                      
                      <a href="#" onclick="location.search=location.search.replace(/[&]?mobile=1/g,'')">test version for pc</a>      
                   <?php }else{ ?>                                                                                           
                    <a href="#" onclick="location.search+='&mobile=1'">test version for mobile[build first]</a>
                <?php }?>                                                                                                 
                </p>       
            <br />
            <p>test code here:</p>
            <textarea id="code" style="width:600px;height:400px;">
$('#timeA').uuiTimer({
	container:$('#timeA span'),
	onSettime : function(oTime){
		this.innerHTML = oTime.d + '天' + oTime.h + '小时' + oTime.m + '分' + oTime.s + '秒' + oTime.ms + '毫秒'
	},
	onEnd : function(){
		this.innerHTML = '结束'
	}

});
$('#timeB').uuiTimer({
	container:$('#timeB span'),
	onSettime : function(oTime){
		this.innerHTML = oTime.h + '小时' + oTime.m + '分' + oTime.s + '秒' + oTime.ms + '毫秒'
	},
    timeType:'h',
    refreshTime:200,
	onEnd : function(){
		this.innerHTML = '结束'
	}

});
$('#timeC').uuiTimer({
	container:$('#timeC span'),
	onSettime : function(oTime){
		this.innerHTML = oTime.m + '分' + oTime.s + '秒' + oTime.ms + '毫秒'
	},
    timeType:'m',
    refreshTime:50,
	onEnd : function(){
		this.innerHTML = '结束'
	}

});

$('#timeD').uuiTimer({
	onSettime : function(oTime){
		this.innerHTML = oTime.s + '秒' + oTime.ms + '毫秒'
	},
    timeType:'s',
    refreshTime:300,
	onEnd : function(){
		this.innerHTML = '结束'
	}

});
$('#timeE').uuiTimer({
	onSettime : function(oTime){
		this.innerHTML = oTime.ms + '毫秒'
	},
    timeType:'ms',
    refreshTime:300,
	onEnd : function(){
		this.innerHTML = '结束'
	}

});

$('#timeA').uuiTimer().excUUICMD('init');
$('#timeB').uuiTimer().excUUICMD('init');
$('#timeC').uuiTimer().excUUICMD('init');
$('#timeD').uuiTimer().excUUICMD('init');
$('#timeE').uuiTimer().excUUICMD('init');
            </textarea>
            <input type=button value="run test" onclick="eval($('#code').attr('value'))"/>
            <p>test dom here:</p>
            <style type="text/css">
            #uuiTimerBox{padding:50px 0;}
            #uuiTimerBox p{ height:20px; margin-bottom:10px; background:red; color:#FFFFFF; font-weight:700; padding:10px; }
            </style>
            <div id="uuiTimerBox" style="background:#fff;">
		
                <p id="timeA">
                	<span data-endtime="1360133890000"></span>
                </p>
                <p id="timeB">
                	<span data-endtime="1360133890000"></span>
                </p>
                <p id="timeC">
                	<span data-endtime="1360133890000"></span>
                </p>
               
                <p id="timeD" data-endtime="1360033890000">

                </p>
                <p id="timeE" data-endtime="1360033890000">

                </p>
			
			</div>
        </div>
    </div>
    <div class="footer">
        &copy;2012 ufo@sogou-inc
    </div>
<!--
    write ur test here
-->
<script>
    /*#main#*/
</script>
</body>
</html>
