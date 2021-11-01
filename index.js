let _merge = require("lodash/merge");
let _cloneDeep = require("lodash/cloneDeep");
function execute(inputs){

    let def = inputs.shift();
    if(typeof def !== 'function'){
        throw Error('The first curry parameter must be function.');
    }

    let params = []
    let previousResult = null;
    while(true){
        if(inputs.length === 0) break;

        let next = inputs.shift();
        if( typeof next === "function"){
            previousResult = def(...params,previousResult);
            params = [];
            def = next;
        } else if( typeof next === "object"){
            let l = params.length
            if(l === 0 || typeof params[l - 1] !== "object" ) params.push({})
            l = params.length
            params[l-1] = _merge(
                params[l - 1] || {},
                next 
            )
                  
        } else {
            params.push(next);
        }
    }
    previousResult = def(...params,previousResult);

    return previousResult;

}

function curry(...param){
    
    let self = (() => {
        let isFirst = !Array.isArray(this?.stackedParams)
        if( isFirst ) return {
            stackedParams: [],
            options: {
                mutable: false,
            }
        } 
        return this
    })();
    
    let {stackedParams, options} = self;
    if( param.length === 0) return execute(stackedParams.concat(), options);
    // when firsts currying
    if(stackedParams.length === 0){
        stackedParams = [param[0]];
        if(param[1]) options = {...options, ...param[1]}
        return curry.bind({stackedParams ,options});
    }

    if(!options.mutable){
        param = _cloneDeep(param)
    }

    return curry.bind({ 
        stackedParams:stackedParams.concat(param), 
        options
    });
}
module.exports = curry