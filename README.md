![npm](https://img.shields.io/npm/v/nested-curry)
![NPM](https://img.shields.io/npm/l/nested-curry)

# other language
 * [korean](./README-ko.md)

# nested-curry
The nested-curry is library exported as Node.js modules. it provide a curry functions that support nested objects.

## Installation
Using npm:

    $ npm i nested-curry

In Node.js:

```js
    const curry = require("nested-curry")
    const sum = ({a, b, c}) => a + b + c
    console.log( sum({a : 1})({b : 2})({c : 3})() ) // output : 6
```

## Documentation
### simple currying
It can pass as a regular parameter just like any other currying function.

```js
    let sumed = curry((...nums) => nums.reduce((a,b) => a + b))  
    console.log(sum()(1)(2)(3)(4)(5)) //15;
```

### nested parameter
Case of nested objects, if the object to be overwritten has the same structure, properties that are not changed are maintained.

```js
  let printPerson = curry(({age,name:{first,last}}) => `${first} ${last} is ${age} ages.`)
  ({
    age: 20,
    name: {
      first:'Jeffrey',
      last:"T. Dingle"
    }
  })
  console.log(printPerson() //`Jeffrey T. Dingle is 20 ages.`
  console.log(printPerson({name:{first:"Kevin"}})()) //`Kevin T. Dingle is 20 ages.`
```

### immutability
cured parameter objects remain immutable.
```js
    let sayHello = curry(({str}) => `hello ${str}!`)
    let param = {str:"curry"};
    let helloToCurry = sayHello(param);
    param.str = 'cutlet'
    console.log(helloToCurry()) //'hello curry!'
```

If you want to keep the mutable state, you can pass the option below when passing the function for the first time.
```js
    let options = { mutable : true }
    let sayHello = curry(({str}) => `hello ${str}!`, options)
    let param = {str:"curry"};
    let helloToCurry = sayHello(param);
    param.str = 'cutlet'
    console.log(helloToCurry()) //'hello curry!'
```

### combined curry
General parameters and object parameters can be used at the same time.
```js
    let returnResult = curry((...params) => params)
    let returnMixed = returnResult
      ({foo1:'bar1'})
      (1)
      ({foo2:'bar3'})
      ({foo123:'bar321'})
      (2,3)
      (['apple','banana'])
    let result = returnMixed(); 
    console.log(result) // [{ foo1: 'bar1' },1,{ foo2: 'bar3', foo123: 'bar321' },2,3,{ '0': 'apple', '1': 'banana' },null]
```
### curry chaining
By passing a function multiple times, you can implement a pipelined implementation like the one below.

Previous parameters come last.
```js
    let tagging = ({tagName}, children) => `<${tagName}>${children}</${tagName}>`  
    let boldRice = curry(tagging)({tagName:"b"})('rice');
    console.log(boldRice()) //`<b>rice</b>`

    let removedBoldRice = boldRice(tagging)({tagName:"del"})
    console.log(removedBoldRice()) //`<del><b>rice</b></del>`)

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
    console.log(styledBoldRice()) //`<span id="bigrice" style="fontSize:1.2em;color:#4CAF50;"><b>rice</b></span>`
```