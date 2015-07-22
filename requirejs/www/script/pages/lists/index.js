define(["./lists", "text!./list.html"], function(lists, html) {
    avalon.templateCache["pages/lists/list.html"] = html
    return {
        ctrl: lists,
        tpl: html
    }
})