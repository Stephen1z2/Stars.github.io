let starCreationInterval;
let meteorCreationInterval;
const MeteorSection = document.querySelector('.meteor');
const numberofMeteors = 3;
let activeMeteors = 0;
const cloudsSection = document.querySelector('.clouds');
const numberOfClouds = 20;

// Start of cursor function
const starCursor = document.createElement('div');
starCursor.classList.add('star-cursor');
document.body.appendChild(starCursor);

// Function to update the star position on mouse move
document.addEventListener('mousemove', (e) => {
starCursor.style.left = `${e.pageX}px`;
starCursor.style.top = `${e.pageY}px`;
}); 
//end of cursor                                

/* Checks if it is a good day for stargazing (50% chance) */
function isGoodStargazingDay() {
    return Math.random() < 0.5;
}

//Start of Meteor creation
function createMeteor() {
    if (activeMeteors >= numberofMeteors) {
        return; // Limits the number of Meteors
    }

    const Meteor = document.createElement('div');
    Meteor.classList.add('meteor-item');

    Meteor.style.top = `${Math.random() * 50}%`;
    Meteor.style.right = '-800px';

    // Random animation duration and delay
    const fallDuration = Math.random() * 3 + .5;
    const fallDelay = Math.random() * 1.5;
    Meteor.style.animationDuration = `${fallDuration}s`;
    Meteor.style.animationDelay = `${fallDelay}s`;

    MeteorSection.appendChild(Meteor);
    activeMeteors++

    setTimeout(() => {
        Meteor.remove();
        activeMeteors--;
    }, 1000 + fallDuration * 1000);
}

//Start of cloud creation
function createCloud() {
    const cloud = document.createElement('div')
    cloud.classList.add('cloud')

    //Random vertical position, only in the top 40% of the container
    cloud.style.top = `${Math.random() * 40}%`;

    //Random width and height for more variation in shapes
    const width = Math.random() * 200 + 300; 
    const height = Math.random() * 50 + 130;
    cloud.style.width = `${width}px`;
    cloud.style.height = `${height}px`;

    cloud.style.borderRadius = `${Math.random() * 50 + 50}% ${Math.random() * 50 + 50}% ${Math.random() * 50 + 50}% ${Math.random() * 50 + 50}%`;  
    
    // Random animation duration and delay
    const floatDuration = Math.random() * 50 + 15; // Random duration between 60s and 120s
    const floatDelay = Math.random() * .2; // Random delay up to 10s
    cloud.style.animationDuration = `${floatDuration}s`;
    cloud.style.animationDelay = `${floatDelay}s`;

    cloudsSection.appendChild(cloud);
}
//End of cloud


/* Creates a star in a random position on the screen */
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 50}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.opacity = 0;
    document.getElementById('stars').appendChild(star);

    /* Makes the star fade in and out */
    setTimeout(() => {
        star.style.transition = 'opacity 1s';
        star.style.opacity = 1;
        setTimeout(() => {
            star.style.opacity = 0;
            setTimeout(() => star.remove(), 1000);
        }, 1000);
    }, Math.random() * 1000);
}
//end of star


/* Updates the stargazing conditions and toggles visibility of stars */
function updateStargazingConditions() {
    const starsContainer = document.getElementById('stars');
    const checkingConditions = document.getElementById('checkingConditions');
    const message = document.getElementById('message');
    

    // Show checking message
    checkingConditions.style.display = "block";
    message.style.display = "none";
    starsContainer.style.display = "none";

    // Simulate loading time for checking conditions
    setTimeout(() => {
        const goodDay = isGoodStargazingDay(); // Check if it's a good day

        // Hide checking message
        checkingConditions.style.display = "none";

        if (goodDay) {
            message.textContent = "Good Day to Stargaze! 🌟";
            starsContainer.style.display = "block"; // Show stars if a good day
            //starsVisible = true;
            
            document.addEventListener('mousemove', function(e) {
                let trail = document.createElement('div');
                trail.className = 'mouse-trail';
                trail.style.left = `${e.pageX}px`;
                trail.style.top = `${e.pageY}px`;
                document.body.appendChild(trail);
                
                setTimeout(() => {
                trail.remove();
                    }, 400); // Adjust the time for the trail to disappear
            });     

            starCreationInterval = setInterval(() => {
                for (let i = 0; i < 20; i++) {
                    createStar();
                }
            }, 200);

            meteorCreationInterval = setInterval(createMeteor, 100);

        } else {
            message.textContent = "Not a Good Day to Stargaze. ☁️";
            starsContainer.style.display = "block"; // Show stars if a good da

            starCreationInterval = setInterval(() => {
                for (let i = 0; i < 10; i++) {
                    createStar();
                }
            }, 200);
            
            for (let i = 0; i < numberOfClouds; i++) {
                createCloud();
            }
           
        }

        // Show result message
        message.style.display = "block";
    }, 3000);
}

function resetStargazingConditions() {
    // Clear the stars and clouds from the screen
    const starsContainer = document.getElementById('stars');
    starsContainer.innerHTML = ''; // Remove all stars
    cloudsSection.innerHTML = ''; // Remove all clouds

    // Clear previous messages
    const message = document.getElementById('message');
    message.textContent = '';

    // Hide or reset stats display
    document.getElementById('cloudCoverage').textContent = 'Loading...';
    document.getElementById('elevation').textContent = 'Loading...';
    document.getElementById('humidity').textContent = 'Loading...';
    document.getElementById('sunsetTime').textContent = 'Loading...';

    // Clear any running intervals
    clearInterval(starCreationInterval);
    clearInterval(meteorCreationInterval);

    // Hide checking conditions message if visible
    const checkingConditions = document.getElementById('checkingConditions');
    checkingConditions.style.display = 'none';
    
 }

/**
 * Adds an event listener to the search button to update conditions and stats
 */
 document.getElementById('searchButton').addEventListener('click', function() {
    const location = document.getElementById('locationInput').value.trim();

    if(!location) {
        alert("Please enter a location.");
    }

    // Validate input length
    if (location.length > 0 && location.length <= 30) {
        resetStargazingConditions(); // Reset previous results
        updateStargazingConditions(); // Update conditions for new search
        fetchWeatherData(location);
        return location;
    } else {
        alert('Please enter a valid location (max 12 characters).'); // Alert if input invalid
    }
 })
// Example weather API call (using OpenWeatherMap API for demonstration)
// You will need to replace 'YOUR_API_KEY' with your actual API key.

const apiKey = '41db8b032208cd83589ccd20529b4a91'; // Replace with your weather API key
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/';
const city = `${location}`

async function fetchWeatherData(location) {
    try {
        const response = await fetch(`${apiBaseUrl}weather?q=${location}&appid=${apiKey}&units=imperial`);
        const data = await response.json();
        console.log(response);
        // Display the raw JSON response in the console

        if (data.cod == 200) { // Check if the location is valid
            document.getElementById('locationname').textContent = data.name;
            document.getElementById('description').textContent = data.weather[0].description;
            document.getElementById('cloudCoverage').textContent = `${data.clouds.all}`;
            document.getElementById('temp').textContent = data.main.temp
            document.getElementById('elevation').textContent = data.main.pressure; // Using pressure as a substitute
            document.getElementById('humidity').textContent = data.main.humidity;
            document.getElementById('sunsetTime').textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        } else {
            console.log("Error:", data.message);
            alert(`City not found: ${data.message}. Please enter a valid city name.`);
        }
    } catch (error) { // This is the catch block
        console.error("Error fetching data:", error);
        alert("Failed to retrieve weather data. Please try again later.");
    }
}
