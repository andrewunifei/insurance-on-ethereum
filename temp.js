// {
//     "args": ["44.34", "10.99"], 
//     "source": "if(secrets.apiKey == \"\") {\n    throw Error(\"Error with the weather API key.\")\n};\nlet dataStructure = [];\nconst url = `https://api.openweathermap.org/data/2.5/weather?lat=${args[0]}&lon=${args[1]}&appid=${secrets.apiKey}`;\n\n// ** MAYBE **: Agregar o resultado de m\u00faltiplas APIs para aumentar a descentraliza\u00e7\u00e3o\nconst response = await Functions.makeHttpRequest({url});\ndataStructure.push(parseInt(response.data.main.humidity));\nreturn Functions.encodeUint256(dataStructure[0]);\n", 
//     "secrets": h'A266736C6F744964006776657273696F6E1A66534CAD', 
//     "codeLanguage": 0, 
//     "codeLocation": 0, 
//     "secretsLocation": 2
// }

// // {"slotId": 0, "version": 1716735149}

// {
//     "args": ["44.34", "10.99"], 
//     "source": "if(secrets.apiKey == \"\") {\n    throw Error(\"Error with the weather API key.\")\n};\nlet dataStructure = [];\nconst url = `https://api.openweathermap.org/data/2.5/weather?lat=${args[0]}&lon=${args[1]}&appid=${secrets.apiKey}`;\n\n// ** MAYBE **: Agregar o resultado de m\u00faltiplas APIs para aumentar a descentraliza\u00e7\u00e3o\nconst response = await Functions.makeHttpRequest({url});\ndataStructure.push(parseInt(response.data.main.humidity));\nreturn Functions.encodeUint256(dataStructure[0]);\n", 
//     "secrets": h'A266736C6F744964006776657273696F6E1A66512949', 
//     "codeLanguage": 0, 
//     "codeLocation": 0, 
//     "secretsLocation": 2
// }

// // {"slotId": 0, "version": 1716595017}

// Gateway req & res

// req
// {
//     gatewayUrls: [
//         'https://whispering-dawn-72285-c14f4a8005ca.herokuapp.com/https://01.functions-gateway.testnet.chain.link/',
//         'https://whispering-dawn-72285-c14f4a8005ca.herokuapp.com/https://02.functions-gateway.testnet.chain.link/'
//     ],
//     method: 'secrets_set',
//     don_id: 'fun-ethereum-sepolia-1',
//     payload: {
//         slot_id: 0,
//         version: 1716741017,
//         payload: 'eyJUREgyQ3R4dCI6ImV5SkhjbTkxY0NJNklsQXlOVFlpTENKRElqb2lhVmRRWlUxNkszZEhRbEJoZFhaaFptVk5ORWwwY2pCbU9VNHlPV1YyVWtnMGJISldiRGxKWTJSYVJUMGlMQ0pNWVdKbGJDSTZJa0ZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRTlJaXdpVlNJNklrSlFXbEZyYzBwd2NsUnNjRzFpUmpWNUwzZHlSSGc1VXpOek1FMWtaVVJ1Y0VwT1pIVktOREZ0TTFVeVQwUmxMMlJGVlZsMlFuQkhSVWcyWlRWQkswOXFiR2szU0ZSVGRVMTJhVmNyVlZWMVQzUmthMGxRYXowaUxDSlZYMkpoY2lJNklrSk5ZazF4VldoV1ZUWmhjWEJuV2poSmFVaG9VRGxHUTB0RU4zbEZNMWxPVGtKUWRuSlROM05GWnl0NVpFRnZiemMwUjNKeVFsSm5RVkJPZUdSeGNIbE9RMUJWY0Zac2FUbDVkV2t3Ym1KWFoyaEhVMlZRZHowaUxDSkZJam9pTW05MVFUTlpPR0ZrYlZGRk5uUTNkWFZ5UmpGck5VOVpPRlJTZWtWU05tOXBLMUZPV210NVF6RXlRVDBpTENKR0lqb2llV3N5YjBKR1YyUnFPSFl5YWtWQloyVk5SMjByV1RoQlQwZHFiM0J5TTNSdVJHRjFXQzk2TkRKVmJ6MGlmUT09IiwiU3ltQ3R4dCI6InlqTHUvcWlrdTNJTDF5SEM4dzRnd0ErRVJweTVJcTE3VS9NM1BTQmQrb1BWNXBtVGEwaHdhM2NSRlRMK3YxS1F1YklMa0VNUWhTR2hsaDhPWnhEQjl6L2pWUk11WnZ3bFZiYTZmSkJjWEw0UTU0Z2pnNjYzOGxTYWhDdmVwVTJiTkM3WGFYQy8rMGxYUFBZL3ljZGIrd1p5MFpwaVdiM1ZQSUJ0dUdvQVpoWFZ1UnI3NVFuOGo1eDlzT1F4Z0o4Zjc2ZFpyYnVVQ20wTElwL0lDUFl4QXpLbU5iL3VUNmRtcE8zU0NIMGtwVXVLY3AweU5TTDdsdXJkQ0N3c0pHUy9acGI0QXgxNVV1MEk3bnV1eGVZZDBJcWxEZ04vdmtSTW9sRlpoa0Vod0Q2Qzc1dlRvL1hvbDZlRXNwQXkySm5UVjlORmMxRXFScnV6aU1zeHJ5UUJwTjFlUlkybjkzdEI5MWdGOWdYU29SaGpid0V0MkFqWHdmZXRNaTBKNytFL0pLMVo1TmV3RElSSzVOUHU3Wlhmb2JxVkk3TUpjOUI4b2ZIL3JkTkEwSFlxM0dEYWVsU3VQYVFnT3B5MGlMeGZLZTlyRUc0SzhVNmJxU0JkOUlvMTRzMEU2aDJXQXh2aFBYS2c1N2Y5eDZRZU9POG1SQ3c2eG0wMkNDSXpTS20veXc5YThxQU9xcHlSZmtjckxicEtNTTdpQnU4aVo4Q3ZLOHdzM0ozWGVmdmlBMGdwdFVydUpXL2VSYmdZS1d3cGpLTT0iLCJOb25jZSI6ImVvZ2htRE4ybXhPYnE4c3cifQ==',
//         expiration: 1716827417545,
//         signature: 'JSrPy9pX3VjBtjX4O8MOPLeNkUXEBPND6rdZpVOCLlAJCX+2sOHde1Rh4h9cMzwiHwkc+5w+FWjbpQJqF8SPqhs='
//     }
// }

// res
// {
// status: 200,
// statusText: 'OK',
// headers: Object [AxiosHeaders] {
//     server: 'Cowboy',
//     'report-to': '{"group":"heroku-nel","max_age":3600,"endpoints":[{"url":"https://nel.heroku.com/reports?ts=1716741018&sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add&s=XKBHHpt22uWO7xWKVd02jkERzGYvn95JKAchskw%2BKR8%3D"}]}',
//     'reporting-endpoints': 'heroku-nel=https://nel.heroku.com/reports?ts=1716741018&sid=c46efe9b-d3d2-4a0c-8c76-bfafa16c5add&s=XKBHHpt22uWO7xWKVd02jkERzGYvn95JKAchskw%2BKR8%3D',
//     nel: '{"report_to":"heroku-nel","max_age":3600,"success_fraction":0.005,"failure_fraction":0.05,"response_headers":["Via"]}',
//     connection: 'close',
//     'x-request-url': 'https://01.functions-gateway.testnet.chain.link/',
//     date: 'Sun, 26 May 2024 16:30:18 GMT',
//     'content-type': 'application/jsonrpc',
//     'content-length': '1031',
//     'x-final-url': 'https://01.functions-gateway.testnet.chain.link/',
//     'access-control-allow-origin': '*',
//     'access-control-expose-headers': 'date,content-type,content-length,connection,x-final-url,access-control-allow-origin',
//     via: '1.1 vegur'
// },
// config: {
//     transitional: {
//     silentJSONParsing: true,
//     forcedJSONParsing: true,
//     clarifyTimeoutError: false
//     },
//     adapter: [ 'xhr', 'http' ],
//     transformRequest: [ [Function: transformRequest] ],
//     transformResponse: [ [Function: transformResponse] ],
//     timeout: 0,
//     xsrfCookieName: 'XSRF-TOKEN',
//     xsrfHeaderName: 'X-XSRF-TOKEN',
//     maxContentLength: -1,
//     maxBodyLength: -1,
//     env: { FormData: [Function], Blob: [class Blob] },
//     validateStatus: [Function: validateStatus],
//     headers: Object [AxiosHeaders] {
//     Accept: 'application/json, text/plain, */*',
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Access-Control-Allow-Origin': '*',
//     'x-requested-with': 'local',
//     'User-Agent': 'axios/1.6.3',
//     'Content-Length': '2104',
//     'Accept-Encoding': 'gzip, compress, deflate, br'
//     },
//     method: 'post',
//     url: 'https://whispering-dawn-72285-c14f4a8005ca.herokuapp.com/https://01.functions-gateway.testnet.chain.link/',
//     data: '{"id":"739960964","jsonrpc":"2.0","method":"secrets_set","params":{"body":{"message_id":"739960964","method":"secrets_set","don_id":"fun-ethereum-sepolia-1","receiver":"","payload":{"slot_id":0,"version":1716741017,"payload":"eyJUREgyQ3R4dCI6ImV5SkhjbTkxY0NJNklsQXlOVFlpTENKRElqb2lhVmRRWlUxNkszZEhRbEJoZFhaaFptVk5ORWwwY2pCbU9VNHlPV1YyVWtnMGJISldiRGxKWTJSYVJUMGlMQ0pNWVdKbGJDSTZJa0ZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRkJRVUZCUVVGQlFVRTlJaXdpVlNJNklrSlFXbEZyYzBwd2NsUnNjRzFpUmpWNUwzZHlSSGc1VXpOek1FMWtaVVJ1Y0VwT1pIVktOREZ0TTFVeVQwUmxMMlJGVlZsMlFuQkhSVWcyWlRWQkswOXFiR2szU0ZSVGRVMTJhVmNyVlZWMVQzUmthMGxRYXowaUxDSlZYMkpoY2lJNklrSk5ZazF4VldoV1ZUWmhjWEJuV2poSmFVaG9VRGxHUTB0RU4zbEZNMWxPVGtKUWRuSlROM05GWnl0NVpFRnZiemMwUjNKeVFsSm5RVkJPZUdSeGNIbE9RMUJWY0Zac2FUbDVkV2t3Ym1KWFoyaEhVMlZRZHowaUxDSkZJam9pTW05MVFUTlpPR0ZrYlZGRk5uUTNkWFZ5UmpGck5VOVpPRlJTZWtWU05tOXBLMUZPV210NVF6RXlRVDBpTENKR0lqb2llV3N5YjBKR1YyUnFPSFl5YWtWQloyVk5SMjByV1RoQlQwZHFiM0J5TTNSdVJHRjFXQzk2TkRKVmJ6MGlmUT09IiwiU3ltQ3R4dCI6InlqTHUvcWlrdTNJTDF5SEM4dzRnd0ErRVJweTVJcTE3VS9NM1BTQmQrb1BWNXBtVGEwaHdhM2NSRlRMK3YxS1F1YklMa0VNUWhTR2hsaDhPWnhEQjl6L2pWUk11WnZ3bFZiYTZmSkJjWEw0UTU0Z2pnNjYzOGxTYWhDdmVwVTJiTkM3WGFYQy8rMGxYUFBZL3ljZGIrd1p5MFpwaVdiM1ZQSUJ0dUdvQVpoWFZ1UnI3NVFuOGo1eDlzT1F4Z0o4Zjc2ZFpyYnVVQ20wTElwL0lDUFl4QXpLbU5iL3VUNmRtcE8zU0NIMGtwVXVLY3AweU5TTDdsdXJkQ0N3c0pHUy9acGI0QXgxNVV1MEk3bnV1eGVZZDBJcWxEZ04vdmtSTW9sRlpoa0Vod0Q2Qzc1dlRvL1hvbDZlRXNwQXkySm5UVjlORmMxRXFScnV6aU1zeHJ5UUJwTjFlUlkybjkzdEI5MWdGOWdYU29SaGpid0V0MkFqWHdmZXRNaTBKNytFL0pLMVo1TmV3RElSSzVOUHU3Wlhmb2JxVkk3TUpjOUI4b2ZIL3JkTkEwSFlxM0dEYWVsU3VQYVFnT3B5MGlMeGZLZTlyRUc0SzhVNmJxU0JkOUlvMTRzMEU2aDJXQXh2aFBYS2c1N2Y5eDZRZU9POG1SQ3c2eG0wMkNDSXpTS20veXc5YThxQU9xcHlSZmtjckxicEtNTTdpQnU4aVo4Q3ZLOHdzM0ozWGVmdmlBMGdwdFVydUpXL2VSYmdZS1d3cGpLTT0iLCJOb25jZSI6ImVvZ2htRE4ybXhPYnE4c3cifQ==","expiration":1716827417545,"signature":"JSrPy9pX3VjBtjX4O8MOPLeNkUXEBPND6rdZpVOCLlAJCX+2sOHde1Rh4h9cMzwiHwkc+5w+FWjbpQJqF8SPqhs="}},"signature":"0xd9a89c77285e0eebd9182f444e3066546dffa7348fdf0ab1b26ac24a99b3f24b4c375383ee4493c1e26135c234ca347b446be0a8032bd83e199232715afc50951c"}}'
// },
// request: <ref *1> ClientRequest {
//     _events: [Object: null prototype] {
//     abort: [Function (anonymous)],
//     aborted: [Function (anonymous)],
//     connect: [Function (anonymous)],
//     error: [Function (anonymous)],
//     socket: [Function (anonymous)],
//     timeout: [Function (anonymous)],
//     finish: [Function: requestOnFinish]
//     },
//     _eventsCount: 7,
//     _maxListeners: undefined,
//     outputData: [],
//     outputSize: 0,
//     writable: true,
//     destroyed: false,
//     _last: true,
//     chunkedEncoding: false,
//     shouldKeepAlive: false,
//     maxRequestsOnConnectionReached: false,
//     _defaultKeepAlive: true,
//     useChunkedEncodingByDefault: true,
//     sendDate: false,
//     _removedConnection: false,
//     _removedContLen: false,
//     _removedTE: false,
//     strictContentLength: false,
//     _contentLength: '2104',
//     _hasBody: true,
//     _trailer: '',
//     finished: true,
//     _headerSent: true,
//     _closed: false,
//     socket: TLSSocket {
//     _tlsOptions: [Object],
//     _secureEstablished: true,
//     _securePending: false,
//     _newSessionPending: false,
//     _controlReleased: true,
//     secureConnecting: false,
//     _SNICallback: null,
//     servername: 'whispering-dawn-72285-c14f4a8005ca.herokuapp.com',
//     alpnProtocol: false,
//     authorized: true,
//     authorizationError: null,
//     encrypted: true,
//     _events: [Object: null prototype],
//     _eventsCount: 10,
//     connecting: false,
//     _hadError: false,
//     _parent: null,
//     _host: 'whispering-dawn-72285-c14f4a8005ca.herokuapp.com',
//     _closeAfterHandlingError: false,
//     _readableState: [ReadableState],
//     _maxListeners: undefined,
//     _writableState: [WritableState],
//     allowHalfOpen: false,
//     _sockname: null,
//     _pendingData: null,
//     _pendingEncoding: '',
//     server: undefined,
//     _server: null,
//     ssl: [TLSWrap],
//     _requestCert: true,
//     _rejectUnauthorized: true,
//     parser: null,
//     _httpMessage: [Circular *1],
//     [Symbol(alpncallback)]: null,
//     [Symbol(res)]: [TLSWrap],
//     [Symbol(verified)]: true,
//     [Symbol(pendingSession)]: null,
//     [Symbol(async_id_symbol)]: 8257,
//     [Symbol(kHandle)]: [TLSWrap],
//     [Symbol(lastWriteQueueSize)]: 0,
//     [Symbol(timeout)]: null,
//     [Symbol(kBuffer)]: null,
//     [Symbol(kBufferCb)]: null,
//     [Symbol(kBufferGen)]: null,
//     [Symbol(kCapture)]: false,
//     [Symbol(kSetNoDelay)]: false,
//     [Symbol(kSetKeepAlive)]: true,
//     [Symbol(kSetKeepAliveInitialDelay)]: 60,
//     [Symbol(kBytesRead)]: 0,
//     [Symbol(kBytesWritten)]: 0,
//     [Symbol(connect-options)]: [Object]
//     },
//     _header: 'POST /https://01.functions-gateway.testnet.chain.link/ HTTP/1.1\r\n' +
//     'Accept: application/json, text/plain, */*\r\n' +
//     'Content-Type: application/x-www-form-urlencoded\r\n' +
//     'Access-Control-Allow-Origin: *\r\n' +
//     'x-requested-with: local\r\n' +
//     'User-Agent: axios/1.6.3\r\n' +
//     'Content-Length: 2104\r\n' +
//     'Accept-Encoding: gzip, compress, deflate, br\r\n' +
//     'Host: whispering-dawn-72285-c14f4a8005ca.herokuapp.com\r\n' +
//     'Connection: close\r\n' +
//     '\r\n',
//     _keepAliveTimeout: 0,
//     _onPendingData: [Function: nop],
//     agent: Agent {
//     _events: [Object: null prototype],
//     _eventsCount: 2,
//     _maxListeners: undefined,
//     defaultPort: 443,
//     protocol: 'https:',
//     options: [Object: null prototype],
//     requests: [Object: null prototype] {},
//     sockets: [Object: null prototype],
//     freeSockets: [Object: null prototype] {},
//     keepAliveMsecs: 1000,
//     keepAlive: false,
//     maxSockets: Infinity,
//     maxFreeSockets: 256,
//     scheduling: 'lifo',
//     maxTotalSockets: Infinity,
//     totalSocketCount: 1,
//     maxCachedSessions: 100,
//     _sessionCache: [Object],
//     [Symbol(kCapture)]: false
//     },
//     socketPath: undefined,
//     method: 'POST',
//     maxHeaderSize: undefined,
//     insecureHTTPParser: undefined,
//     joinDuplicateHeaders: undefined,
//     path: '/https://01.functions-gateway.testnet.chain.link/',
//     _ended: true,
//     res: IncomingMessage {
//     _readableState: [ReadableState],
//     _events: [Object: null prototype],
//     _eventsCount: 4,
//     _maxListeners: undefined,
//     socket: [TLSSocket],
//     httpVersionMajor: 1,
//     httpVersionMinor: 1,
//     httpVersion: '1.1',
//     complete: true,
//     rawHeaders: [Array],
//     rawTrailers: [],
//     joinDuplicateHeaders: undefined,
//     aborted: false,
//     upgrade: false,
//     url: '',
//     method: null,
//     statusCode: 200,
//     statusMessage: 'OK',
//     client: [TLSSocket],
//     _consuming: false,
//     _dumped: false,
//     req: [Circular *1],
//     responseUrl: 'https://whispering-dawn-72285-c14f4a8005ca.herokuapp.com/https://01.functions-gateway.testnet.chain.link/',
//     redirects: [],
//     [Symbol(kCapture)]: false,
//     [Symbol(kHeaders)]: [Object],
//     [Symbol(kHeadersCount)]: 26,
//     [Symbol(kTrailers)]: null,
//     [Symbol(kTrailersCount)]: 0
//     },
//     aborted: false,
//     timeoutCb: null,
//     upgradeOrConnect: false,
//     parser: null,
//     maxHeadersCount: null,
//     reusedSocket: false,
//     host: 'whispering-dawn-72285-c14f4a8005ca.herokuapp.com',
//     protocol: 'https:',
//     _redirectable: Writable {
//     _writableState: [WritableState],
//     _events: [Object: null prototype],
//     _eventsCount: 3,
//     _maxListeners: undefined,
//     _options: [Object],
//     _ended: true,
//     _ending: true,
//     _redirectCount: 0,
//     _redirects: [],
//     _requestBodyLength: 2104,
//     _requestBodyBuffers: [],
//     _onNativeResponse: [Function (anonymous)],
//     _currentRequest: [Circular *1],
//     _currentUrl: 'https://whispering-dawn-72285-c14f4a8005ca.herokuapp.com/https://01.functions-gateway.testnet.chain.link/',
//     [Symbol(kCapture)]: false
//     },
//     [Symbol(kCapture)]: false,
//     [Symbol(kBytesWritten)]: 0,
//     [Symbol(kNeedDrain)]: false,
//     [Symbol(corked)]: 0,
//     [Symbol(kOutHeaders)]: [Object: null prototype] {
//     accept: [Array],
//     'content-type': [Array],
//     'access-control-allow-origin': [Array],
//     'x-requested-with': [Array],
//     'user-agent': [Array],
//     'content-length': [Array],
//     'accept-encoding': [Array],
//     host: [Array]
//     },
//     [Symbol(errored)]: null,
//     [Symbol(kHighWaterMark)]: 16384,
//     [Symbol(kRejectNonStandardBodyWrites)]: false,
//     [Symbol(kUniqueHeaders)]: null
// },
// data: {
//     jsonrpc: '2.0',
//     id: '739960964',
//     result: {
//     signature: '0xd9a89c77285e0eebd9182f444e3066546dffa7348fdf0ab1b26ac24a99b3f24b4c375383ee4493c1e26135c234ca347b446be0a8032bd83e199232715afc50951c',
//     body: [Object]
//     }
// }
// }