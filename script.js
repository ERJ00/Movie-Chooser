document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const submitButton = document.getElementById("submit-button");
    const searchInput = document.getElementById("search");
    const results = document.getElementById("results");
    const selectedMovies = document.getElementById("selected-movies");
    const Key = 'MDc5MDk5NDU5OG1zaDEyNDhhMTkzMTc0MmYxZnAxNDE3YTNqc25kMGFkNDViYjQ0MDc=';
    let selectedMoviesContainer = document.getElementById("selected-movies");
    let selectedMoviesList = [];

    searchButton.addEventListener("click", function () {
        const query = searchInput.value.trim();
        if (query !== "") {
            searchMovies(query);
        }
    });

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const query = searchInput.value.trim();
            if (query !== "") {
                searchMovies(query);
            }
        }
    });

    async function searchMovies(query) {
        const apiKey = atob(Key);
        const url = `https://imdb8.p.rapidapi.com/auto-complete?q=${query}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'imdb8.p.rapidapi.com',
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data); // Log the full API response for debugging
            displayResults(data.d);
        } catch (error) {
            console.error(error);
        }
    }

    function displayResults(data) {
        results.innerHTML = "";
        data.forEach(item => {
            const movieElement = document.createElement("div");
            const movieId = item.id;
    
            // Skip this item if it doesn't have an image URL
            if (!item.i || !item.i.imageUrl) {
                return;
            }
    
            const btnContainer = document.createElement("div");
            btnContainer.className = "btn";
    
            const infoContainer = document.createElement("div");
            infoContainer.className = "info";
    
            const imgContainer = document.createElement("div");
            imgContainer.className = "img-Container";
    
            movieElement.className = "movie";
            movieElement.id = `movie-${movieId}`;
            const imageUrl = item.i.imageUrl;
            const title = item.l;
            const year = item.y;
            const type = item.q;
            const cast = item.s;
    
            imgContainer.innerHTML = `
                <img src="${imageUrl}" alt="${title}">
            `;
    
            infoContainer.innerHTML = `
                <h2>${title}</h2>
                <p id="year">Year: ${year}</p>
                <p id="type">Type: ${type}</p>
                <p id="cast">Cast: ${cast}</p>
            `;
    
            btnContainer.innerHTML = `
                <button class="add-button" onclick="addMovie('${movieId}')">Add</button>
            `;
    
            // Append btnContainer to movieElement
            movieElement.appendChild(imgContainer);
            movieElement.appendChild(infoContainer);
            movieElement.appendChild(btnContainer);
            results.appendChild(movieElement);
        });
    }
    


    window.addMovie = function (movieId) {
        const selectedMovie = document.getElementById(`movie-${movieId}`);
        const isDuplicate = selectedMoviesList.some(item => item.id === selectedMovie.id);
    
        if (!isDuplicate) {
            const clone = selectedMovie.cloneNode(true);
            const addButton = clone.querySelector(".btn");
    
            // Create a new Remove button container
            const btnContainer = document.createElement("div");
            btnContainer.className = "btn";
    
            // Create a new "Remove" button
            const removeButton = document.createElement("button");
            removeButton.className = "remove-button";
            removeButton.textContent = "Remove";
    
            const plusMinusButtonContainer = document.createElement("div");
            plusMinusButtonContainer.innerHTML = `
                <button id="minus" onclick="decrementCount('${movieId}')">-</button>
                <p id="count">0</p>
                <button id="plus" onclick="incrementCount('${movieId}')">+</button>
            `;
    
            btnContainer.appendChild(removeButton);
            btnContainer.appendChild(plusMinusButtonContainer);
    
            // Set the "Remove" button's onclick function to remove the movie
            removeButton.onclick = function () {
                removeMovie(movieId);
            };
    
            // Replace the "Add" button with the "Remove" button
            clone.replaceChild(btnContainer, addButton);
    
            selectedMoviesList.push(clone);
            selectedMovies.appendChild(clone);
        }
    };

    window.decrementCount = function (movieId) {
        const selectedMovie = selectedMoviesList.find(item => item.id === `movie-${movieId}`);
        const countElement = selectedMovie.querySelector("#count");
        let count = parseInt(countElement.textContent);
        if (count > 0) {
            count--;
            countElement.textContent = count;
        }
    }
    
    window.incrementCount = function (movieId) {
        const selectedMovie = selectedMoviesList.find(item => item.id === `movie-${movieId}`);
        const countElement = selectedMovie.querySelector("#count");
        let count = parseInt(countElement.textContent);
        count++;
        countElement.textContent = count;
    }

    function removeMovie(movieId) {
        const selectedMovie = selectedMoviesList.find(item => item.id === `movie-${movieId}`);
    
        if (selectedMovie) {
            selectedMoviesList = selectedMoviesList.filter(item => item.id !== `movie-${movieId}`);
            selectedMoviesContainer.removeChild(selectedMovie);
        }
    }

    submitButton.addEventListener("click", function () {
        displaySelectedMoviesPopup();
    });
    
    function displaySelectedMoviesPopup() {
        const popup = document.createElement("div");
        popup.className = "popup";
    
        const popupContent = document.createElement("div");
        popupContent.className = "popup-content";
    
        const closeButton = document.createElement("span");
        closeButton.className = "close-button";
        closeButton.innerHTML = "&times;";
        closeButton.onclick = function () {
            popup.style.display = "none";
        };
    
        const popupHeading = document.createElement("h2");
        popupHeading.textContent = "Selected Movies";
    
        // Find the movie with the highest count
        let highestCountMovie = null;
        selectedMoviesList.forEach((selectedMovie) => {
            const countElement = selectedMovie.querySelector("#count");
            const movieCount = parseInt(countElement.textContent);
    
            if (highestCountMovie === null || movieCount > highestCountMovie.count) {
                highestCountMovie = {
                    element: selectedMovie,
                    count: movieCount,
                };
            }
        });
    
        if (highestCountMovie) {
            const countElement = highestCountMovie.element.querySelector("#count");
            const movieTitle = highestCountMovie.element.querySelector("h2").textContent;
            const movieImageSrc = highestCountMovie.element.querySelector("img").src;
            const movieYear = highestCountMovie.element.querySelector("#year").textContent;
            const movieTypes = highestCountMovie.element.querySelector("#type").textContent;
    
            const movieItem = document.createElement("div");
            movieItem.className = "movie-item";
    
            const movieImage = document.createElement("img");
            movieImage.src = movieImageSrc;
            movieImage.className = "movie-image";
    
            const movieInfo = document.createElement("div");
            movieInfo.className = "movie-info";
            
            const movieTitleElement = document.createElement("h3");
            movieTitleElement.textContent = movieTitle;
            
            const movieDetails = document.createElement("p");
            movieDetails.textContent = `Year: ${movieYear} - Types: ${movieTypes} - Count: ${highestCountMovie.count}`;
    
            movieInfo.appendChild(movieTitleElement);
            movieInfo.appendChild(movieDetails);
    
            movieItem.appendChild(movieImage);
            movieItem.appendChild(movieInfo);
            popupContent.appendChild(popupHeading);
            popupContent.appendChild(movieItem);
        }
    
        popupContent.appendChild(closeButton);
        popup.appendChild(popupContent);
    
        document.body.appendChild(popup);
    
        popup.style.display = "block";
    }
    

});
