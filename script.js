let fullData = [];  // Global variable to hold all fetched data
document.addEventListener('DOMContentLoaded', () => {
    const SHEET_ID = '1z0wPcQFAWJBVRgpkM0xqtbeO9xBQsHpr_83ely2uwG4';
    const API_KEY = 'AIzaSyA8fOeAvHEKc-Iz9RjXsh9jNOuZHTI0rTY';
    const RANGE = 'Sheet1!A1:E53';
    const SHEET_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/1z0wPcQFAWJBVRgpkM0xqtbeO9xBQsHpr_83ely2uwG4/values/Sheet1!A1:E53?key=AIzaSyA8fOeAvHEKc-Iz9RjXsh9jNOuZHTI0rTY`;

    fetch(SHEET_API_URL)
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        const rows = data.values;
        const headers = rows[0];

        const jsonData = rows.slice(1).map(row => {
            const obj = {};
            row.forEach((value, index) => {
                obj[headers[index]] = value;
            });
            return obj;
        });

        console.log('jsonData:', jsonData);

        if (jsonData.length === 0 || !jsonData.every(item => item["color"])) {
            console.error('Missing color field in jsonData.');
            return;
        }

        // Sort data
        const sortedData = jsonData.sort((a, b) => {
            const colorA = a["color"]?.toLowerCase() || '';
            const colorB = b["color"]?.toLowerCase() || '';

        });

        fullData = sortedData;
        renderData(fullData);
    })
    .catch(err => console.error('Error fetching data:', err));

// Color filter
document.getElementById('color-filter')
.addEventListener('change', (e) => {
    const selectedColor = e.target.value;
    const filtered = selectedColor === 'all'
        ? fullData
        : fullData.filter(item => (item.color || '').toLowerCase() === selectedColor);
    renderData(filtered);
});

//  Render function
function renderData(data) {
    const container = document.querySelector('.interactive-container');
    container.innerHTML = '';

    data.forEach(item => {
        const imageURL = item["URL"] || '';
        if (!imageURL) return;

        const title = item["title"] || 'Unknown';
        const color = item["color"] || 'Unknown';
        const emotion = item["emotion"] || 'Unknown';

        const div = document.createElement('div');
        div.className = 'image-container';

        const maxX = window.innerWidth - 120;
        const maxY = window.innerHeight - 120;
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        const img = document.createElement('img');
        img.src = imageURL;
        img.alt = title;
        img.style.left = `${randomX}px`;
        img.style.top = `${randomY}px`;
        img.style.position = 'absolute';
        img.onclick = () => openPopup(imageURL, title, emotion, color);

        div.appendChild(img);
        container.appendChild(div);
    });
}

// Popup logic
function openPopup(imageSrc, title, emotion, color) {
    const popup = document.getElementById('popup');
    const popupImg = document.getElementById('popup-img');
    const popupText = document.getElementById('popup-text');

    // Set the image source
    popupImg.src = imageSrc;

    // Set the text content with line breaks using innerHTML
    popupText.innerHTML = `<div class="pt">Title: ${title}</div><br>
    <div class="pe">Emotion: ${emotion}</div><br>
    <div class="pc">Color: ${color}</div>`;

    popup.style.display = 'flex'; // Show the popup
}

window.closePopup = function () {
    document.getElementById('popup').style.display = 'none';
};
});