// script.js
document.addEventListener('DOMContentLoaded', () => {
    if (typeof API_KEY === 'undefined') {
        console.error('API key is not defined! Please check your config.js file.');
        return;
    }

    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
    const POSTER_PLACEHOLDER = 'https://via.placeholder.com/220x330.png?text=Image+Not+Found';

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
            return [];
        }
    }

    function displayContent(sectionId, items, isMovie = true) {
        const carouselTrack = document.querySelector(`#${sectionId} .carousel-track`);
        if (!carouselTrack) {
            console.error(`Carousel track not found for section: ${sectionId}`);
            return;
        }

        carouselTrack.innerHTML = '';

        items.forEach(item => {
            if (!item.poster_path) return; // Skip items without a poster

            const title = isMovie ? (item.title || item.original_title) : (item.name || item.original_name);
            const overview = item.overview || 'No description available.';
            const posterPath = `${IMAGE_BASE_URL}${item.poster_path}`;
            const voteAverage = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';

            const card = document.createElement('div');
            card.classList.add('item-card');

            // This is the new HTML structure for the card with overlays
            card.innerHTML = `
                <img src="${posterPath}" alt="${title} Poster" class="poster" loading="lazy">
                
                <div class="rating">
                    <i class="fas fa-star"></i> ${voteAverage}
                </div>

                <div class="card-overlay">
                    <h3>${title}</h3>
                    <p class="overview">${overview}</p>
                </div>
            `;
            carouselTrack.appendChild(card);
        });
    }

    // --- Fetching and Displaying various categories ---
    fetchData('movie/popular').then(data => displayContent('movies-popular', data, true));
    fetchData('movie/now_playing').then(data => displayContent('now-playing-movies', data, true));
    fetchData('movie/upcoming').then(data => displayContent('upcoming-movies', data, true));
    fetchData('movie/top_rated').then(data => displayContent('top-rated-movies', data, true));
    fetchData('tv/popular').then(data => displayContent('tv-popular', data, false));
    fetchData('tv/on_the_air').then(data => displayContent('tv-on-the-air', data, false));
    fetchData('tv/top_rated').then(data => displayContent('tv-top-rated', data, false));
});
