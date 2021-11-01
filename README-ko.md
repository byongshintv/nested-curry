![npm](https://img.shields.io/npm/v/nested-curry)
![NPM](https://img.shields.io/npm/l/nested-curry)

# nested-curry
중첩된 객체를 지원하는 커리 함수입니다.

## 커리가 뭐에요?
커리가 무엇이고 유용하게 쓰는 방법에 대해 아래 링크에서 배울 수 있습니다.
* https://ko.javascript.info/currying-partials


## 어떻게 써요?
npm에서 아래와 같이 설치 할 수 있습니다.

  $ npm i nested-curry

설치하고 이렇게 사용합니다.

```js
const curry = require("nested-curry")
const sum = ({a, b, c}) => a + b + c
console.log( sum({a : 1})({b : 2})({c : 3})() ) // 결과 : 6
```

## 더 없어요?
### 일반 커링
다른 커링 함수와 같이 일반 파라미터로 전달 할 수 있습니다.

```js
let sumed = curry((...nums) => nums.reduce((a,b) => a + b))  
console.log(sum(1)(2)(3)(4)(5)()) //15;
```

### 중첩객체 예제
덮어씌우려는 객체가 동일한 구조를 가지고 있을 때, 변경되지 않는 프로퍼티는 유지됩니다.

```js
let printLocation = curry(
  ({age,name,location:{state,city}}) => 
      console.log(`${age}살 ${name}는 ${state}시 ${city}에 살아요.`)
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
printLocation(); //18살 성욱이는 부산시 해운대구에 살아요.;
printLocation({location:{city:'금정구'}})() //18살 성욱이는 부산시 금정구에 살아요.
```

### 불변성
일반적으로 커링된 파라미터 객체들은 이뮤터블 상태가 유지됩니다.
```js
let sayHello = curry(({str}) => `hello ${str}!`)
let param = {str:"curry"};
let helloToCurry = sayHello(param);
param.str = 'cutlet'
console.log(helloToCurry()) //'hello curry!'
```

객체들이 뮤터블 상태를 유지하길 원한다면 처음 함수 전달시 아래와 같은 옵션을 같이 넘겨주면 됩니다. 
```js
let options = { mutable : true }
let sayHello = curry(({str}) => `hello ${str}!`, options)
let param = {str:"curry"};
let helloToCurry = sayHello(param);
param.str = 'cutlet'
console.log(helloToCurry()) //'hello cutlet!'
```

### 커리 컴바인
일반 파라미터와 객체 파라미터를 동시에 사용 할 수 있습니다.
```js
let returnResult = curry((...params) => params)
let returnMixed = returnResult
  ({foo1:'bar1'})
  (1)
  ({foo2:'bar3'})
  ({foo123:'bar321'})
  (2,3)
  (['apple','banana']);
let result = returnMixed(); 
console.log(result) // [{ foo1: 'bar1' },1,{ foo2: 'bar3', foo123: 'bar321' },2,3,{ '0': 'apple', '1': 'banana' },null]
```
### 커리 체이닝
함수를 여러번 전달해서 아래와 같은 파이프라인식 구현을 할 수 있습니다.

이전 파라미터는 가장 뒤쪽에 들어옵니다.
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