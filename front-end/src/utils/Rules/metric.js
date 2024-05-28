//const metricJS = 'let avg = 0;let total = 0;let count = 0;let dataStructure = [];args.forEach(function(item, index) {total += parseInt(item);count++;});avg = total / count;dataStructure.push(parseInt(avg))return Functions.encodeUint256(dataStructure[0]);';
//const computationJS = 'if(secrets.apiKey == "") {throw Error("Error with the weather API key.")}; let dataStructure = []; const url = `https://api.openweathermap.org/data/2.5/weather?lat=${args[0]}&lon=${args[1]}&appid=${secrets.apiKey}`; const response = await Functions.makeHttpRequest({url}); dataStructure.push(parseInt(response.data.main.humidity)); return Functions.encodeUint256(dataStructure[0]);'

const MAP_HEX = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
    7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13,
    e: 14, f: 15, A: 10, B: 11, C: 12, D: 13,
    E: 14, F: 15
};

function fromHex(hexString) {
    const bytes = new Uint8Array(Math.floor((hexString || "").length / 2));
    let i;
    for (i = 0; i < bytes.length; i++) {
      const a = MAP_HEX[hexString[i * 2]];
      const b = MAP_HEX[hexString[i * 2 + 1]];
      if (a === undefined || b === undefined) {
        break;
      }
      bytes[i] = (a << 4) | b;
    }
    return i === bytes.length ? bytes : bytes.slice(0, i);
}

const computationJSHex = '696628736563726574732e6170694b6579203d3d20222229207b0a202020207468726f77204572726f7228224572726f72207769746820746865207765617468657220415049206b65792e22290a7d3b0a6c65742064617461537472756374757265203d205b5d3b0a636f6e73742075726c203d206068747470733a2f2f6170692e6f70656e776561746865726d61702e6f72672f646174612f322e352f776561746865723f6c61743d247b617267735b305d7d266c6f6e3d247b617267735b315d7d2661707069643d247b736563726574732e6170694b65797d603b0a0a2f2f202a2a204d41594245202a2a3a2041677265676172206f20726573756c7461646f206465206dc3ba6c7469706c6173204150497320706172612061756d656e74617220612064657363656e7472616c697a61c3a7c3a36f0a636f6e737420726573706f6e7365203d2061776169742046756e6374696f6e732e6d616b654874747052657175657374287b75726c7d293b0a646174615374727563747572652e70757368287061727365496e7428726573706f6e73652e646174612e6d61696e2e68756d696469747929293b0a72657475726e2046756e6374696f6e732e656e636f646555696e7432353628646174615374727563747572655b305d293b0a'
const buf = fromHex(computationJSHex);
const computationJS = new TextDecoder().decode(buf);
console.log(computationJS)

const metricJSHex = '6c657420617667203d20303b0a6c657420746f74616c203d20303b0a6c657420636f756e74203d20303b0a6c65742064617461537472756374757265203d205b5d3b0a617267732e666f72456163682866756e6374696f6e286974656d2c20696e64657829207b0a20202020746f74616c202b3d207061727365496e74286974656d293b0a20202020636f756e742b2b3b0a7d293b0a617667203d20746f74616c202f20636f756e743b0a646174615374727563747572652e70757368287061727365496e742861766729293b0a72657475726e2046756e6374696f6e732e656e636f646555696e7432353628646174615374727563747572655b305d293b0a'
const buf2 = fromHex(metricJSHex);
const metricJS = new TextDecoder().decode(buf2);

export { metricJS, computationJS };