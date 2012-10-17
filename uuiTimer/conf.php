<?php
    $uiconf = array(
        "uiname"    => "uuiTimer", // protected
        "addCMD"    => "cd ../;svn add uuiTimer;svn up;svn ci -m 'add uuiTimer';",// add ui to svn,exc after create
        "ciCMD"     => "cd ../;svn up;svn add uuiTimer/*;svn ci ",// commit code
        "deployCMD" => "cp -r build/* /search/uidoc/files/;cd ../;cp -r uuiTimer /search/uidoc/doc/;", // cmd to deploy ur ui project
        "path"      => "/search/ui/bin", // protected
        "yui"       => "/etc/uyui/yui.jar", // where ur yui set up
        "arc"       => true,// use arc to review ur code
    );
?>
