// DOM elements
let SearchButton = document.getElementById('SearchButton');
let Searchinput = document.getElementById('Search');
let Perpage = document.getElementById('perpage');
let BelowBar = document.getElementById('Number');
let BelowBarNumber = document.getElementsByClassName('BelowBarNumber');
let CardDiv = document.getElementById('CardList');
let Info = document.getElementById('Info');
let Loader = document.getElementById('Loading');
let bar = document.getElementById('NumberBar');
let User = document.getElementById('User');

// Array to store fetched data
let data = [];

// Function to generate HTML for topics
function Entertopic(dd) {
    let div = '';
    for (let index = 0; index < dd.length; index++) {
        const element = dd[index];
        div += `<span id='topic'>${element}</span>`;
    }
    return div;
}

// Function to set and display cards based on the current section
function SetCard(Section) {
    let perpagevalue = Perpage.value;
    CardDiv.innerHTML = "";
    for (let index = (perpagevalue * (Section - 1)); index < Math.min((perpagevalue * Section), data.length); index++) {
        CardDiv.innerHTML += `<div id='Card'>
            <h3 id="cardname1">${data[index].name}</h3>
            <div id="cardname2">${data[index].description}</div>
            <div id="topiclist">${Entertopic(data[index].topics)}</div>
        </div>`;
    }
}

// Function to fill and display cards along with pagination
function FillCards() {
    let perpagevalue = Perpage.value;
    let BelowBarvalue = Math.ceil(data.length / perpagevalue);
    BelowBar.innerHTML = "";
    for (let i = 0; i < BelowBarvalue; i++) {
        BelowBar.innerHTML += `<span class='BelowBarNumber'>${i + 1}</span>`;
    }
    SetCard(1);
    BelowBarNumber[0].style.backgroundColor = "Grey";
    BelowBarNumber[0].style.color = "white";
    for (let index = 0; index < BelowBarNumber.length; index++) {
        const element = BelowBarNumber[index];
        element.addEventListener('click', () => {
            for (let i = 0; i < BelowBarNumber.length; i++) {
                const element2 = BelowBarNumber[i];
                element2.style.backgroundColor = "White";
                element2.style.color = "black";
            }
            element.style.backgroundColor = "Grey";
            element.style.color = "white";
            SetCard(element.innerHTML);
        });
    }
}

// Event listener for perpage change
Perpage.addEventListener('change', () => {
    FillCards();
});

// Event listener for search button click
SearchButton.addEventListener('click', async () => {
    if (Searchinput.value === "") {
        Info.style.display = 'block';
        CardDiv.style.display = 'none';
        bar.style.display = 'none';
        User.style.display = 'none';
        return;
    }

    Info.style.display = 'none';
    Loader.style.display = 'block';
    CardDiv.style.display = 'none';
    bar.style.display = 'none';

    // Fetch user repositories from GitHub API
    await fetch(`https://api.github.com/users/${Searchinput.value}/repos?per_page=100`)
        .then((data) => {
            if (data.status == 404) {
                CardDiv.innerHTML = "User Not Found";
                return "Failed";
            }
            return data.json();
        })
        .then(async (k) => {
            if (k == "Failed") {
                CardDiv.style.display = 'block';
                Loader.style.display = 'none';
                return;
            }

            // Fetch additional user data from GitHub API
            await fetch(`https://api.github.com/users/${Searchinput.value}`)
                .then(data2 => {
                    return data2.json();
                })
                .then((userdata) => {
                    // Display user information
                    User.innerHTML = `
                        <div id="UserData1">
                            <img alt="profileImage" src='${userdata.avatar_url}'/>
                            <div id="UserData2">
                                <h1>${userdata.name == null ? userdata.login : userdata.name}</h1>
                                <p>${userdata.bio == null ? "" : userdata.bio}</p>
                            </div>
                        </div>
                        <div id="GitLink">
                            <a id="LinkIcon" href='${userdata.html_url == null ? "#" : userdata.html_url }'>🔗</a>
                            <div id="Link">${userdata.html_url == null ? "" : userdata.html_url}</div>
                        </div>
                    `;
                });

            // Update data and display cards
            data = k;
            FillCards();
            Loader.style.display = 'none';
            CardDiv.style.display = 'flex';
            bar.style.display = 'block';
            User.style.display = 'flex';
        });
});
