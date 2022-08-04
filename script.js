
const apiKey = 'myRdRcaNbM1BpfFYa2ciLJh16BjFueQ3f5Yc2TBW';

window.addEventListener("load", () => { 
    // Creates input state in the localStorage
    window.localStorage.setItem("inputState", JSON.stringify({}));
});

/*
    Logical Steps of "get" method handler func -
    1. Check if the date property (ex: 2022-01-05) exists in the target object (inputState)
        if true -  return inputState[date]
        else - fetch from the API, add the new date to the inputState and return inputState[date]
*/

const handler = {
    get: async (target, date) => {
        if(target[date]){
            return target[date];
        }
        else{
            console.log('Date inside', date);
            const dataRaw = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`, {
                method : "GET",
                mode: 'cors',
            });
            const dataClean = await dataRaw.json();
            console.log('Dataclean', dataClean);
            target[date] = dataClean.hdurl;
            window.localStorage.setItem("inputState", JSON.stringify(target));
            return dataClean.hdurl;
        }
    },
};

const getTargetObj = () => {
    return JSON.parse(window.localStorage.getItem("inputState"));
}

const proxyObj = new Proxy(getTargetObj(), handler);

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/* 
    Logical Steps of following getImage func -
    1. Get parent container
    2. Remove all child nodes of parent
    3. Get currentDate from local storage
    4. Create Image element
    5. Set the source of Image element to the proxy object's currentDate(ex: 2022-05-01) property 

*/


const getImage = async () => {
    const imagesDiv = document.getElementById('images');
    removeAllChildNodes(imagesDiv);
    const currentDate = window.localStorage.getItem('currentDate');
    const imageElement = document.createElement('img');
    imageElement.src = await proxyObj[currentDate];
    imagesDiv.append(imageElement);
}




function takeInput(val) {  
    // Push current date
    window.localStorage.setItem("currentDate", val);
}


