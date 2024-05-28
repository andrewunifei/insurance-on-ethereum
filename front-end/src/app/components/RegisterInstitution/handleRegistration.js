async function handleRegistration(institutionInfo) {
    const options = {
        method: 'POST',
        body: JSON.stringify({
            institutionInfo
        }),
        headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
    }
    const response = await fetch('http://localhost:8080/institution', options);
    const parsed = await response.json();
    console.log(parsed);
    const institutionAddress = parsed.institutionAddress;
    return institutionAddress;
}

export default handleRegistration;