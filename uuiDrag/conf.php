<?php
    $uiconf = array(
        "uiname"    => "uuiDrag", // protected
        "addCMD"    => "cd ../;svn add uuiDrag;svn up;svn ci -m 'add uuiDrag';",// add ui to svn,exc after create
        "ciCMD"     => "cd ../;svn up;svn add uuiDrag/*;svn ci ",// commit code
        "deployCMD" => "cp -r build/* /search/uidoc/files/;cd ../;cp -r uuiDrag /search/uidoc/doc/;", // cmd to deploy ur ui project
        "path"      => "/search/ui/bin", // protected
        "yui"       => "/etc/uyui/yui.jar", // where ur yui set up
        "arc"       => true,// use arc to review ur code
    );
?>
