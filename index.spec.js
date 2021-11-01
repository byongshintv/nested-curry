let { assert } = require("chai")
let curry = require("./index.js")
describe("curry", function() {

    it("Basic Behaviour", function() {
      let output = curry(({a,b}) => a + b)
      ({a : 3})
      ({b : 4})()

      assert.equal(output,7);
    });

    
    it("Nested", function() {
      let printPerson = curry(({age,name:{first,last}}) => `${first} ${last} is ${age} ages.`)
        ({
          age: 20,
          name: {
            first:'Jeffrey',
            last:"T. Dingle"
          }
        })
        assert.equal(printPerson(),`Jeffrey T. Dingle is 20 ages.`);
        assert.equal(printPerson({name:{first:"Kevin"}})(),`Kevin T. Dingle is 20 ages.`);

        let printLocation = curry(
          ({age,name,location:{state,city}}) => 
              `${age}살 ${name}는 ${state}시 ${city}에 살아요.`
          )
        ({
          age: 18,
          name: '성욱이',
          female: true,
          location: {
            state:"부산",
            city:"해운대구",
          }
        })

        assert.equal(printLocation(),`18살 성욱이는 부산시 해운대구에 살아요.`);
        assert.equal(printLocation({location:{city:'금정구'}})(),`18살 성욱이는 부산시 금정구에 살아요.`);
        
        
    });
    
    it("reusable", function() {
      let div2 = curry(({a,b}) => b / a)({a : 2})

      for(let n of [2,4,6,8]){
        assert.equal(div2({b : n})(),n/2);
      }

    });

    it("General Parameter", function() {
      let sumed = curry((...nums) => nums.reduce((a,b) => a + b))
        (1)(2)(3)(4)(5)()

      assert.equal(sumed,15);
    });


    it("immutable", function() {
      let sayHello = curry(({str}) => `hello ${str}!` )
      let param = {str:"curry"};

      let helloToCurry = sayHello(param);
      
      param.str = 'cutlet'
      assert.equal(helloToCurry(),'hello curry!');
      
    });
    
    it("mutable", function() {
      let sayHello = curry(({str}) => `hello ${str}!`,{ mutable : true} )
      let param = {str:"curry"};

      let helloToCurry = sayHello(param);
      
      param.str = 'cutlet'
      assert.equal(helloToCurry(),'hello cutlet!');
      
    });

    it("combine", function() {
      let returnResult = curry((...params) => params)

      let returnMixed = returnResult
        ({foo1:'bar1'})
        (1)
        ({foo2:'bar3'})
        ({foo123:'bar321'})
        (2,3)
        (['apple','banana'])
      

      let result = returnMixed();
      assert.equal(result[0].foo1,"bar1")
      assert.equal(result[1],1)
      assert.equal(result[2].foo2,"bar3")
      assert.equal(result[2].foo123,"bar321")
      assert.equal(result[3],2)
      assert.equal(result[4],3)
      assert.equal(result[5][0],"apple")
      assert.equal(result[5][1],"banana")
      console.log(result)
    });

    
    it("combineWithFunction", function() {
      let tagging = ({tagName}, children) => `<${tagName}>${children}</${tagName}>`  
      let boldRice = curry(tagging)({tagName:"b"})('rice');
      assert.equal(boldRice(),`<b>rice</b>`)

      let removedBoldRice = boldRice(tagging)({tagName:"del"})
      assert.equal(removedBoldRice(),`<del><b>rice</b></del>`)

      let styledBoldRice = boldRice(({style,id},child) => 
      `<span id="${id}" style="${ 
        Object.entries(style).map(([key,id]) => `${key}:${id};`)
      }">${child}</span>`,
      {
        style:{
          fontSize:"1.2em",
          color:"#4CAF50"
        },
        id:"bigrice",
      })
      assert.equal(styledBoldRice(),`<span id="bigrice" style="fontSize:1.2em;,color:#4CAF50;"><b>rice</b></span>`)
    });
  }); 