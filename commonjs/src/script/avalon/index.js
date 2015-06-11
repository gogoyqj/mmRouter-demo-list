require('./avalon.js');
require('./avalon.live.js');

avalon.config({
    loader: false
});

avalon.$ui = function( id ) {
    return avalon.vmodels[id];
};

window.avalon = window.$$ = avalon;

avalon.assign = assign;

function assign( obj , value ) {

    /*
        如果是数组，先mock个对象作为数组的宿主
     */
    if( avalon.type(obj) === 'array'){
        value = avalon.mix(true,{},{_:value});
        obj = {_:obj};
    }else{
        value = avalon.mix( true , {} , value );
    }

    for( var i in obj ) {
        if( typeof value[i] == 'undefined' || !obj.hasOwnProperty(i) || i === 'hasOwnProperty' ) continue;
        switch( avalon.type(obj[i]) ) {
            case 'object':
                assign( obj[i] , value[i] );
                break;
            case 'array':
                avalon.each( value[i] , function(idx,v){

                    var type = typeof obj[i][idx];

                    if( type === 'object' && obj[i][idx] !== null){
                        assign(obj[i][idx],v);
                    }else{
                        if(idx >= obj[i].size()){
                            obj[i].push(v);
                        }else{
                            obj[i].set(idx,v);
                        }

                    }


                });

                while(obj[i].length > value[i].length){
                    obj[i].pop();
                }
                break;
            default:
                obj[i] = value[i];
                break;
        }
    }
}

function testVM( expr , vm ) {
    var t = vm,
        pre;
    for( var i = 0; i < expr.length; i++ ) {
        var k = expr[i];
        if( typeof t[k] !== 'undefined' ) {
            pre = t;
            t = t[k];
        } else {
            return;
        }
    }

    return pre;
}

/*
    返回参数
    [
        expr以.分割的最后一位
        expr最后一位的model，结合第一个元素就可以$watch
        匹配expr的vmodel
    ]
*/
avalon.getModel = function( expr , vmodels ){
    var e = expr.split('.');
    for( var i = 0; i < vmodels.length; i++ ) {
        var vm = vmodels[i];
        var m = testVM( e , vm);

        if( typeof m !== 'undefined' ) return [ e[e.length-1] , m , vm ];
    }
    return null;
}

module.exports = avalon;
