<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>jQuery ui plugin uuiDialog</title>
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
        .uuiDialog-main{
            background: #fff;
            top: 0;    
            height: 300px;
            margin-top: -150px;
            width: 300px;
            margin-left:-150px;
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
    <script src="./build/js/mobile.uuiDialog.js"></script>
    <script src="../uuiDrag/build/js/mobile.uuiDrag.js"></script>
    <script src="./uuiModal/build/js/mobile.uuiModal.js"></script>
    <?php }else{ ?>
    <script src="./js/uuiDialog.js"></script>
    <script src="../uuiDrag/js/uuiDrag.js"></script>
    <script src="../uuiModal/js/uuiModal.js"></script>
    <link rel="stylesheet" href="../uuiDrag/css/uuiDrag.css" type="text/css"/>
    <link rel="stylesheet" href="../uuiModal/css/uuiModal.css" type="text/css"/>
    <?php }?>
    <link rel="stylesheet" href="http://ufo.sogou-inc.com/pingback/main.css" type="text/css" media="screen"/>
</head>
<body>
<div class="header">
        <h1>
            <img src="http://ufo.sogou-inc.com/static/logo/logo-white.png" class="" alt="" style="padding:0 20px 0 0;position:relative;top:5px;">
            uuiDialog TEST page
        </h1>
    </div>
    <div class="content">
        <div class="content-inner">
            <p><a href="./doc/uuiDialog/index.html" target="_blank">preview doc[exc "ui doc first"]</a></p>
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
$('#uuiDialogBox2').uuiDialog({
    width: 250,
    height: 200,
    type: 'confirm',
    modal: true,
    draggable: true,
    classPrefix: 'uui',
    content: 'hello world!',
    titleText: '这是个alert' 
});
$('#uuiDialogBox1').uuiDialog({
    width: 250,
    height: 200,
    type: 'iframe',
    modal: true,
    draggable: true,
    classPrefix: 'uui',
    content: 'http://123.sogou.com',
    titleText: '这是个iframe' 
});
$('#uuiDialogBox').uuiDialog({
    width: 250,
    height: 200,
    type: 'alert',
    modal: true,
    draggable: true,
    classPrefix: 'uui',
    content: 'hello world!',
    titleText: '这是个confirm' 
});
$('#uuiDialogBox4').uuiDialog({
    width: 250,
    id: '#a-dom-dialog',
    height: 200,
    type: 'alert',
    modal: true,
    draggable: true,
    classPrefix: 'uui',
    content: 'hello world!',
    titleText: '这是个把dom元素转换为dialog的测试用例' 
});
            </textarea>
            <input type=button value="run test" onclick="eval($('#code').attr('value'))"/>
            <p>test dom here:</p>
            <p>多个dialog共存</p>
            <div id="a-dom-dialog" class="uuiDialog-main" style="display:none;">
                <div class="uuiDialog-head">
                    <a href="#" class="uuiDialog-close" onmousedown="event.stopPropagation && event.stopPropagation();event.cancelBubble=true;return false;" onclick="return false;">X</a>
                    <span class="uuiDialog-title"></span>
                </div>
                <div class="uuiDialog-content"></div>
                <div class="uuiDialog-foot"></div>
            </div>
            <div id="uuiDialogBox" style="background:#fff;padding:10px;">这是个alert click me</div>
            <div id="uuiDialogBox1" style="background:#fff;padding:10px;">这是个iframe click me</div>
            <div id="uuiDialogBox2" style="background:#fff;padding:10px;">这是个confirm click me</div>
            <div id="uuiDialogBox4" style="background:#fff;padding:10px;">将一个dom元素转换为dialog click me</div>
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
