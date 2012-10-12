<?php
    $uiconf = array(
        "uiname"    => "uuiRange", // protected
        "addCMD"    => "cd ../;svn add uuiRange;svn up;svn ci -m 'add uuiRange';",// add ui to svn,exc after create
        "ciCMD"     => "cd ../;svn up;svn add uuiRange/*;svn ci ",// commit code
        "deployCMD" => "cp -r build/* /search/uidoc/files/;cd ../;cp -r uuiRange /search/uidoc/doc/;", // cmd to deploy ur ui project
        "path"      => "/search/ui/bin", // protected
        "yui"       => "/etc/uyui/yui.jar", // where ur yui set up
        "arc"       => true,// use arc to review ur code
    );
?>
