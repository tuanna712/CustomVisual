const sum = (a: number, b: number) =>  a + b
console.log(sum(4, 6))

var employee : {
    id: string,
    name: string,
    age: number,
}

const new_employee = {
    id: "VPI32", 
    name: "Hua Quang Huy", 
    age: 22
}
console.log(new_employee)

// array in typescript
var list:string [] = [
    "alpha", 
    "beta",
    "gamma"
]
console.log(list)

// tuple
var employee_tuple: [number, string] = [1, "Huy"]
console.log(employee_tuple)

// enum ~ dictionary trong python
enum Dict{
    NewPaper = "NEWPAPER",
    Magarine = "MAGARIN",
}
console.log(Dict.Magarine)
console.log(Dict["NewPaper"])

const unionVar : (string | number | true) = true
console.log(unionVar)

// for traditional
var arr:number[] = [1, 2, 3, 4, 5, 6]
for(var i = 0; i < arr.length; i++){
    console.log(arr[i])
}
//  for of: value
for (var i of arr){
    console.log(i)
}
// for in : index
for(var index in arr){
    console.log(index)
}
