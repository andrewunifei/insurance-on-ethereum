let avg = 0;
let total = 0;
let count = 0;
let dataStructure = [];
args.forEach(function(item, index) {
    total += parseInt(item);
    count++;
});
avg = total / count;
dataStructure.push(parseInt(avg))

return Functions.encodeUint256(dataStructure[0]);