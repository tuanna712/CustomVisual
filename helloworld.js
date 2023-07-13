var sum = function (a, b) { return a + b; };
console.log(sum(4, 6));
var employee;
var new_employee = {
    id: "VPI32",
    name: "Hua Quang Huy",
    age: 22
};
console.log(new_employee);
// array in typescript
var list = [
    "alpha",
    "beta",
    "gamma"
];
console.log(list);
// tuple
var employee_tuple = [1, "Huy"];
console.log(employee_tuple);
// enum ~ dictionary trong python
var Dict;
(function (Dict) {
    Dict["NewPaper"] = "NEWPAPER";
    Dict["Magarine"] = "MAGARIN";
})(Dict || (Dict = {}));
console.log(Dict.Magarine);
console.log(Dict["NewPaper"]);
var unionVar = true;
console.log(unionVar);
// for traditional
var arr = [1, 2, 3, 4, 5, 6];
for (var i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
//  for of: value
for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
    var i = arr_1[_i];
    console.log(i);
}
// for in : index
for (var index in arr) {
    console.log(index);
}
