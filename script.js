// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Check if API_KEY is defined
    if (typeof API_KEY === 'undefined') {
        console.error('API key is not defined! Please check your config.js file.');
        return;
    }

    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // For posters
    const POSTER_PLACEHOLDER = 'https://via.placeholder.com/200x300.png?text=No+Image+Available';


    // Function to fetch data from TMDb
    async function fetchData(endpoint) {
        const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&language=en-US&page=1`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            return []; // Return empty array on error
        }
    }

    // Function to create and display content cards within a carousel track
    function displayContent(sectionId, items, isMovie = true) {
        const carouselTrack = document.querySelector(`#${sectionId} .carousel-track`);
        if (!carouselTrack) {
            console.error(`Carousel track not found for section: ${sectionId}`);
            return;
        }

        carouselTrack.innerHTML = ''; // Clear previous content

        items.forEach(item => {
            const title = isMovie ? (item.title || item.original_title) : (item.name || item.original_name);
            const overview = item.overview || 'No description available.';
            const posterPath = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : POSTER_PLACEHOLDER;
            const voteAverage = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

            const card = document.createElement('div');
            card.classList.add('item-card');

            card.innerHTML = `
                <img src="${posterPath}" alt="${title} Poster" class="poster">
                <div class="rating">
                    <i class="fas fa-star"></i> ${voteAverage}
                </div>
                <div class="card-content">
                    <h3>${title}</h3>
                    <p class="overview">${overview}</p>
                </div>
            `;
            carouselTrack.appendChild(card);
        });
    }

    // --- Fetching and Displaying various categories ---

    // Popular Movies
    fetchData('movie/popular').then(movies => {
        displayContent('movies-popular', movies, true);
    });

    // Movies Now Playing (In Theatres)
    fetchData('movie/now_playing').then(movies => {
        displayContent('now-playing-movies', movies, true);
    });

    // Upcoming Movies
    fetchData('movie/upcoming').then(movies => {
        displayContent('upcoming-movies', movies, true);
    });

    // Top Rated Movies
    fetchData('movie/top_rated').then(movies => {
        displayContent('top-rated-movies', movies, true);
    });

    // Popular TV Shows
    fetchData('tv/popular').then(tvShows => {
        displayContent('tv-popular', tvShows, false);
    });

    // TV Shows On The Air
    fetchData('tv/on_the_air').then(tvShows => {
        displayContent('tv-on-the-air', tvShows, false);
    });

    // Top Rated TV Shows
    fetchData('tv/top_rated').then(tvShows => {
        displayContent('tv-top-rated', tvShows, false);
    });
});
