<?php
    $uiconf = array(
        "uiname"    => "uuiDialog", // protected
        "addCMD"    => "cd ../;svn add uuiDialog;svn up;svn ci -m 'add uuiDialog';",// add ui to svn,exc after create
        "ciCMD"     => "cd ../;svn up;svn add uuiDialog/*;svn ci ",// commit code
        "deployCMD" => "cp -r build/* /search/uidoc/files/;cd ../;cp -r uuiDialog /search/uidoc/doc/;", // cmd to deploy ur ui project
        "path"      => "/search/ui/bin", // protected
        "yui"       => "/etc/uyui/yui.jar", // where ur yui set up
        "arc"       => true,// use arc to review ur code
    );
?>
