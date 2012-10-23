<?php
    $uiconf = array(
        "uiname"    => "uuiModal", // protected
        "addCMD"    => "cd ../;svn add uuiModal;svn up;svn ci -m 'add uuiModal';",// add ui to svn,exc after create
        "ciCMD"     => "cd ../;svn up;svn add uuiModal/*;svn ci ",// commit code
        "deployCMD" => "cp -r build/* /search/uidoc/files/;cd ../;cp -r uuiModal /search/uidoc/doc/;", // cmd to deploy ur ui project
        "path"      => "/search/ui/bin", // protected
        "yui"       => "/etc/uyui/yui.jar", // where ur yui set up
        "arc"       => true,// use arc to review ur code
    );
?>
