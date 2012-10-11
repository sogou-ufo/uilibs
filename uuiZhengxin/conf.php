<?php
    $uiconf = array(
        "uiname"    => "uuiZhengxin", // protected
        "addCMD"    => "cd ../;svn add uuiZhengxin;svn up;svn ci -m 'add uuiZhengxin';",// add ui to svn,exc after create
        "ciCMD"     => "cd ../;svn up;svn add uuiZhengxin/*;svn ci ",// commit code
        "deployCMD" => "cp -r build/* /search/uidoc/files/;cd ../;cp -r uuiZhengxin /search/uidoc/doc/;", // cmd to deploy ur ui project
        "path"      => "/search/ui/bin", // protected
        "yui"       => "/etc/uyui/yui.jar", // where ur yui set up
        "arc"       => true,// use arc to review ur code
    );
?>
