<?php
    $action = isset($_GET["action"]) ? $_GET["action"] : false;
    $arr = array();
    if($action == "list") {
        $pageId = isset($_GET["pageId"]) ? intval($_GET["pageId"]) : 0;
        $count = 0;
        while($count < 10) {
            array_push($arr, array(
                "id" => $pageId * 10 + $count,
                "title" => "拉森B冰架2020年将消失" . ($pageId * 10 + $count),
            ));
            $count++;
        }
    } elseif ($action == "detail") {
        $blogId = isset($_GET["blogId"]) ? intval($_GET["blogId"]) : 0;
        $arr = array(
            "title" => "精彩文章第" . $blogId . "篇",
            "content" => "霸王龙，又名暴龙，属暴龙科中的一种，名字的意思是残暴的蜥蜴王。是史上最庞大的肉食性动物之一和最著名的食肉恐龙，它是恐龙中生存年代最晚的种类之一，体长12~14米，最长15米。平均臀部高度3.6米，最高4.1米。平均高度5.1米，最高6米（从地面至头部）。平均体重9吨，最重14.85吨，头部1·55米。咬合力居陆地生物和食肉恐龙第一（咬合力可达20吨），同时也是体型最为粗壮的食肉恐龙。",
            "blogId" => $blogId,
        );
    }
    header("Content-Type:application/json");
    echo json_encode($arr);
?>