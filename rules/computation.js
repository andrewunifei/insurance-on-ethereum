if(secrets.apiKey == "") {
    throw Error("Error with the weather API key.")
};
let dataStructure = [];
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${args[0]}&lon=${args[1]}&appid=${secrets.apiKey}`;

// ** MAYBE **: Agregar o resultado de múltiplas APIs para aumentar a descentralização
const response = await Functions.makeHttpRequest({url});
dataStructure.push(parseInt(response.data.main.humidity));
return Functions.encodeUint256(dataStructure[0]);
