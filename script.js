const peopleTab = document.getElementById('peopleTab');
const filmsTab = document.getElementById('filmsTab');
const listContainer = document.getElementById('listContainer');
const detailContainer = document.getElementById('detailContainer');
const backButton = document.getElementById('backButton');
const detailName = document.getElementById('detailName');
const detailDescription = document.getElementById('detailDescription');
const detailCreated = document.getElementById('detailCreated');
let activeTab = 'people';

//initialise function to show empty page on first load of the webpage, alsoit hides the details section and back button
function initialise(){
    listContainer.style.display = 'flex';
    detailContainer.style.display = 'none';
    backButton.style.display = 'none';
}
initialise();

// Function to fetch data from the SWAPI API
async function fetchData(category, page = 1) {
    try {
        const response = await fetch(`https://swapi.dev/api/${category}/?page=${page}`);//response will store the data in string format
        const data = await response.json();//parsing the response data received in json format and storing in data
        return data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function fetchAndDisplayDetails(category) {
    let page = 1;
    let allDetails = [];

    try {
        while (true) {
            const data = await fetchData(category, page);

            // Check for successful response and results
            if (!data || !Array.isArray(data.results) || data.results.length === 0) {
                break; // No more data to fetch or an issue with the API
            }

            allDetails = allDetails.concat(data.results);
            page++;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    return allDetails;
}

//showing details for initial load of the page
fetchAndDisplayDetails(activeTab).then(data => displayList(data));

// Function to display item details for people
function showPeopleDetail(item) {
    listContainer.style.display = 'none';
    detailContainer.style.display = 'block';
    backButton.style.display = 'block';

    // Display the details of the selected person
    detailName.textContent = item.name;
    detailDescription.innerHTML = `
        <p><strong>Height(cm):</strong> ${item.height}</p>
        <p><strong>Mass:</strong> ${item.mass}</p>
        <p><strong>Hair Color:</strong> ${item.hair_color}</p>
        <p><strong>Skin Color:</strong> ${item.skin_color}</p>
        <p><strong>Eye Color:</strong> ${item.eye_color}</p>
        <p><strong>Birth Year:</strong> ${item.birth_year}</p>
        <p><strong>Gender:</strong> ${item.gender}</p>
    `;
    detailCreated.textContent = item.created;
}

// Function to display item details for films
function showFilmDetail(item) {
    listContainer.style.display = 'none';
    detailContainer.style.display = 'block';
    backButton.style.display = 'block';

    // Display the details of the selected film
    detailName.textContent = item.title;
    detailDescription.innerHTML = `
        <p><strong>Director:</strong> ${item.director}</p>
        <p><strong>Producer:</strong> ${item.producer}</p>
        <p><strong>Release Date:</strong> ${item.release_date}</p>
        <p><strong>Opening Crawl:</strong></p>
        <p>${item.opening_crawl}</p>
    `;
    detailCreated.textContent = item.created;
}

// Function to display item details based on the active tab such as film tab and people tab
function showDetail(item) {
    if (activeTab === 'people') {
        showPeopleDetail(item);
    } else if (activeTab === 'films') {
        showFilmDetail(item);
    }
}

// Function to go back to the active tab
backButton.addEventListener('click', () => {
    listContainer.style.display = 'flex';
    detailContainer.style.display = 'none';
    backButton.style.display = 'none';
});

// Function to display a list of items (films and people)
function displayList(data) {
    listContainer.innerHTML = '';
    data.forEach(item => {
        const listItem = document.createElement('div');
        listItem.classList.add('list-item');
        
        const title = document.createElement('h3');
        title.textContent = item.name || item.title; // Adjust for People/Films

        const details = document.createElement('div');
        details.classList.add('item-details');

        // Check if it's a film item (based on properties)
        if (item.release_date && item.director) {
            details.innerHTML = `
                <p><strong>Release Date:</strong> ${item.release_date}</p>
                <p><strong>Director:</strong> ${item.director}</p>
            `;
        } else {
            // For people items (based on properties)
            details.innerHTML = `
                <p><strong>Height:</strong> ${item.height}</p>
                <p><strong>Gender:</strong> ${item.gender}</p>
            `;
        }

        // Common details for both types
        details.innerHTML += `
            <p><strong>Created On:</strong> ${item.created}</p>
        `;

        listItem.appendChild(title);
        listItem.appendChild(details);

        listItem.addEventListener('click', () => showDetail(item));//adding event listener to the list item and on clicking it will navigate accordingly
        listContainer.appendChild(listItem);
    });
}

// adding event listener on the tab of people
peopleTab.addEventListener('click', async () => {
    activeTab = 'people';
    peopleTab.classList.add('active');//css proeperties
    filmsTab.classList.remove('active');//css preperties
    const data = await fetchAndDisplayDetails(activeTab);
    displayList(data);
});

// adding event listener on the tab of film 
filmsTab.addEventListener('click', async () => {
    activeTab = 'films';
    filmsTab.classList.add('active');//css proeperties
    peopleTab.classList.remove('active');//css proeperties
    const data = await fetchAndDisplayDetails(activeTab);
    displayList(data);
});