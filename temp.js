
const args = ['1', '2', '3', '4', '5']
var total = 0;
var count = 0;
var avg;

args.forEach(function(item, index) {
    total += Number(item);
    count++;
});

avg = total / count;


console.log(typeof parseInt(avg));