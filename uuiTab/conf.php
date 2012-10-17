<?php
    $uiconf = array(
        "uiname"    => "uuiTab", // protected
        "addCMD"    => "cd ../;svn add uuiTab;svn up;svn ci -m 'add uuiTab';",// add ui to svn,exc after create
        "ciCMD"     => "cd ../;svn up;svn add uuiTab/*;svn ci ",// commit code
        "deployCMD" => "cp -r build/* /search/uidoc/files/;cd ../;cp -r uuiTab /search/uidoc/doc/;", // cmd to deploy ur ui project
        "path"      => "/search/ui/bin", // protected
        "yui"       => "/etc/uyui/yui.jar", // where ur yui set up
        "arc"       => true,// use arc to review ur code
    );
?>
