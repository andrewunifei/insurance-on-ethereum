const metricJS = 'let avg = 0;let total = 0;let count = 0;let dataStructure = [];args.forEach(function(item, index) {total += parseInt(item);count++;});avg = total / count;dataStructure.push(parseInt(avg))return Functions.encodeUint256(dataStructure[0]);';
const computationJS = 'if(secrets.apiKey == "") {throw Error("Error with the weather API key.")}; let dataStructure = []; const url = `https://api.openweathermap.org/data/2.5/weather?lat=${args[0]}&lon=${args[1]}&appid=${secrets.apiKey}`; const response = await Functions.makeHttpRequest({url}); dataStructure.push(parseInt(response.data.main.humidity)); return Functions.encodeUint256(dataStructure[0]);'
export { metricJS, computationJS };


