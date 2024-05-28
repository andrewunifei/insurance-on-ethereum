// import donParams from "../Chainlink/donParams.js";
// import NodeRSA from 'encrypt-rsa';

// const key = `-----BEGIN PRIVATE KEY-----
// MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDjWl2Q3c+jvllE
// H8CqH4ADQ92EoGqUqI8muZWstAgxHXDaYroEyHVDZ9DR/HxL/snob+i7CENFqhej
// lDhEK8Rxb0tgZ92VFuNtBitz0mcrPg9z5zzIUcAAchS/bQrSX7cgkyCMDSLURDu0
// h6YUr0PaTUMmJDf7Q2MvA3ETCZe3EG6hjZIm/yriFRIjkELF2DHO1W2aqP63pJ6c
// g9uZQbW5N8/8m3AVc1P2jGt/UCicn6YNknEqr80Hy9JzEf1nWewy32poEsSiM2lT
// L16Xf5152wdHlkgQUDmik7wT43QS3MEUe9N5x7aMiY+FeEcYKrJkSETD+QqAeblV
// cY4nDXjvAgMBAAECggEATdJjzq+uYI1KfwAjcdhAeF2lmL1UXjhob8f8zNX/K9i5
// BXff1r1LLlx95TL41QaM1GxiDItig5kaaFrW+7bDklSXR5OmDF9+T5ZaD1ZJDEs8
// /N59NtCM2VozcecAWkx7IcJa1LW2Y1RL35rDJbdskW/6+TZSl0ZU0AXskaip7vYi
// ihznCHOyg8DGOyrWsa1Rg5gxK6ih+0fC29t4q2hOFFxUMG7DfJXf9M+4vvEBTswF
// uBFm1Fdf2I0MD9XijSM3jQDgYSEPw/INEEr8j1RTe5fVKVuifzAH7zAHNJnt2yjl
// O0KR1ghvhRs3q+S4WsHSuQdLjDrCD7ChywDPQMJ98QKBgQD/btawEGF4QrdWPJ5/
// uHwRrUEfj3/ZpV5/9TnRRuw8XrH4fgJAr3P3gl9u2JOV9zM4o8zBIYAxgzaNqD48
// o16KjvVduY2Imyf7baJokhwYmmmQWPP3I2N7rAyhLBJgP5j9T3fgnH2LtdEAS6Ik
// hxBq4+p6UdbXqYFc2v2pb9iiFwKBgQDj25GztPf5/3kCHo2XUQI1x7/SEWTPQYWC
// rpDvgV+aJLYy01e3gKPMZTUJif5EelcjebCz3Jv7mxOuYvsS0Ntowjr9IJ8hBAui
// dI/uBI6W0w7QDkrnWI3xc0r+sEBWPZ0dRS7j2d/fNPNplrNt1VTfisA42T8rc4I+
// eDWJYX7e6QKBgDXvI2m9q7cG70tINXdmbtwUpyGQ3UAJiPCfyPuFbDA7Fn0Prk4W
// PfhPEPOIy3Do52nYPE2zUywhNo2mrq2DGV1MXkbR/S6RBFo0hgxqfYA8annOLoVK
// daERbQFDGwYzp4wlEXzdziyH0X+seKoZ0r+fLE1zpleXNPd0TgdO1IE1AoGALE36
// Q64RdYvGNLJKJ7z5qAlh8++r4VzFIAbfaaKHO0qeHr3XVXfu4YRgTq2FQj1jiiNU
// R3TC46ZgqkzWsu7narQxkhxwtJO7y2fMwKQkMZFyVOQijl86olMfpuwQZnRug017
// c5ReomECX2qNEvMjIKAzBhq/3KwGDC2Fg2PwrlkCgYAnrAeECPeupQeIoS2ye5EI
// UHPYqLDpjS2Rf0IKdMKoYjJIU0AUftlJnKlyWIPzg6qFRvcLANjQ3asVpR6/080d
// 8Lj3aC24JpY5+Pdl8Tou8X3a5C1mOvERY+UUyCri0nZoOi47fTh6UXzqRVcTFoRl
// BcFAwn2tg/IZaenMtjp63A==
// -----END PRIVATE KEY-----`

// async function buildRequestParameters(config) {
//     const encryptRsa = new NodeRSA();
//     const encryptedSecrets = encryptRsa.encrypt({ 
//         text: 'cf3649563c87f34f3b45714527f8b257',   
//         privateKey: key
//     });
//     console.log(encryptedSecrets);

//     const options = {
//         method: 'POST',
//         body: JSON.stringify({
//             secrets: encryptedSecrets,
//             config: config,
//             donParams: donParams

//         }),
//         headers: new Headers({
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             }),
//     }
//     const response = await fetch('http://localhost:8080/', options);
//     const parsed = await response.json();
    
//     return(parsed);
// }

// export default buildRequestParameters