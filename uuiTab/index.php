<!DOCTYPE html>
<html>
    <head>
    <meta charset="utf-8">
    <title>jQuery ui plugin uuiTab</title>
    <style type="text/css">
    html, body, div, span, applet, object, iframe,  h1, h2, h3, h4, h5, h6, p, blockquote, pre,  a, abbr, acronym, address, big, cite, code,  del, dfn, em, img, ins, kbd, q, s, samp,  small, strike, strong, sub, sup, tt, var,  b, u, i, center,  dl, dt, dd, ol, ul, li,  fieldset, form, label, legend,  table, caption, tbody, tfoot, thead, tr, th, td,  article, aside, canvas, details, embed,  figure, figcaption, footer, header, hgroup,  menu, nav, output, ruby, section, summary,  time, mark, audio, video { margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,  footer, header, hgroup, menu, nav, section { display: block; }
    body { line-height: 1; }
    ol, ul { list-style: none; }
    blockquote, q { quotes: none; }
    blockquote:before, blockquote:after,  q:before, q:after { content: ''; content: none; }
    table { border-collapse: collapse; border-spacing: 0; }
    </style>
    <link rel="stylesheet" href="http://ufo.sogou-inc.com/pingback/main.css" type="text/css" media="screen"/>
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
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
    <?php if(isset($uiconf)){?>
    <script>
    <?php 
        echo file_get_contents($uiconf['path'] . '/../base/base.js');
    ?>
    </script>
    <?php }?>
    <?php if(isset($_GET['mobile'])){ ?>
    <script src="./build/js/mobile.uuiTab.js"></script>
    <?php }else{ ?>
    <script src="./js/uuiTab.js"></script>
    <?php }?>
    </head>
    <body>
    <div class="header">
        <h1>
            <img src="http://ufo.sogou-inc.com/static/logo/logo-white.png" class="" alt="" style="padding:0 20px 0 0;position:relative;top:5px;">
            uuiTab TEST page
        </h1>
    </div>
    <div class="content">
        <div class="content-inner">
            <p><a href="./doc/uuiTab/index.html" target="_blank">preview doc[exc "ui doc first"]</a></p>
            <p>
                <?php if(isset($_GET['mobile'])){ ?>
                    <a href="#" onclick="location.search=location.search.replace(/[&]?mobile=1/g,'')">test version for pc</a>
                <?php }else{ ?>
                    <a href="#" onclick="location.search+='&mobile=1'">test version for mobile[build first]</a>
                <?php }?>
            </p>

            <p>test code here:</p>
            <textarea id="code" style="width:600px;height:400px;">
            $('#uuiTab-main').uuiTab({
                title:$('#uuiTab-main>ol>li'),
                content:$('#uuiTab-main>ul>li'),
                index:0,
                className:'cur'
            });
            $('#uuiTab-main').uuiTab().excUUICMD('init');
            var _ = $('.uuiTab-main').getUUI('uuiTab')[0];



            $('#up').on('click',function(e){
                e.preventDefault();
                _.excUUICMD('prev');
                return false;
            })
            $('#down').on('click',function(e){
                e.preventDefault();
                _.excUUICMD('next');
                return false;
            })
            $('#uuiTab-main2').uuiTab({
                title:$('#uuiTab-main2>ol>li'),
                content:$('#uuiTab-main2>ul>li'),
                index:0,
                className:'cur'
            });
            $('#uuiTab-main2').uuiTab().excUUICMD('init');
            </textarea>
            <input type=button value="run test" onclick="eval($('#code').attr('value'))"/>
            <p>test dom here:</p>




            <div class="uuiTab-main" id="uuiTab-main">
                <ol>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                </ol>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                </ul>
            </div>
            <a href="#" id="up">上一个</a>
            <a href="#" id="down">下一个</a>
            <div class="uuiTab-main" id="uuiTab-main2">
                <ol>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                </ol>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                </ul>
            </div>





            


        </div>
    </div>
    <div class="footer">
        ©2012 ufo@sogou-inc
    </div>
</body>
</html>
