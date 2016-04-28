### avalon2 版本

#### 注意事项

* 只支持avalon2

* view.$onRendered 不再支持

某种神奇的用法

```html
    <!DOCTYPE html>
    <html>
        <head>
            <title>文章单页应用</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width">
            <link rel="stylesheet" href="css/style.css">
        </head>
        <body 
              ms-controller="root">
            <div ms-view="" class="layout"></div>
            <xmp ms-widget="{is: 'ms-state', $onReady: @onReady, views: @views}">
                <blog stateUrl="./blog" abstract="true">
                    <list url="{pageId}" stateUrl="./list"></list>
                    <detail url="detail/{blogId}" stateUrl="./detail">
                        <comment views="@views"/>
                    </detail>
                </blog>
            </xmp>
        </body>
        <script type="text/javascript" src="http://127.0.0.1:8080/www/script/avalon.js"></script>
        <script src="build/script/lib.js"></script>
        <script src="build/script/route.js"></script>
    </html>

```