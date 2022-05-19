/* Global Variables */
// import json from "body-parser";


// select the DOM elements
const zip = document.querySelector('#zip');
const feelings = document.getElementById('feelings');
const generate = document.getElementById('generate');
const time = document.querySelector('#time');
const date = document.querySelector('#date');
const title = document.querySelector('.title');
const icon = document.querySelector('#icon');

// declaring URL for API call
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=88e405424a8f55f33938089c65eafcc0&units=imperial';

function dateTime () {
    let d = new Date();
    let todaysDate = d.toDateString();
    let seconds = d.getSeconds();
    let min = d.getMinutes();
    let hour = d.getHours();
    seconds = timeFormat(seconds);
    min = timeFormat(min);
    hour = timeFormat(hour);
    date.innerHTML = todaysDate;
    time.innerHTML = `${hour}:${min}:${seconds}`;
    setTimeout(dateTime, 1000);
}

function timeFormat(i) {
    if (i < 10) {i = "0" + i};
    return i;
    }


generate.addEventListener('click', function(event){
    event.preventDefault();
    const apiURL = `${baseURL}${zip.value}${apiKey}`;
    getStuff(apiURL)
    .then((data) => {
        createData(data)
        .then((what) => {
            postData("/post", what)
            .then((data) => {
                retrieveData("/get")
                .then((data) =>{
                    updateUi(data)
                });
            });
        });
    });
});


const getStuff = async (stuff) => {
    try{
        const result = await fetch(stuff);
        const data = await result.json();
        return data;     
    }catch(error){
        console.log('error', error);
    }
};

const createData = async (data) => {
    try{
        const myData = {
            feelings: feelings.value,
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            location: data.name,
        };
        return myData;
    } catch (error){
        console.log('error', error);
    }
};

const postData = async(url="", data={}) => {
    try{
        const result = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return result;
    }catch(error){
        console.log('error', error);
    }
};

const retrieveData = async(url) => {
    const data = await fetch(url);
    try{
        const response = await data.json();
        return response;
    }catch(error){console.log("error", error);}
};

const updateUi = async(data) => {
    const response = await data;
    const iconSrc = "http://openweathermap.org/img/w/" + response.icon + ".png";
    icon.innerHTML = `<img src="${iconSrc}" alt="Weather icon" width="150px" height="auto" id="icon-img" >`;
    title.innerHTML = `At ${data.location} today we have ${data.description}, the temperature is
                        ${response.temp} degrees Fahrenheit and it is a good day to feel ${response.feelings.slice(7)}.`;
}

window.addEventListener('load', dateTime());

