const API_BASE_URL = 'http://localhost/movie_theatre/api/movies/'

fetchAndPopulateFeaturedMovies()

function fetchAndPopulateFeaturedMovies() {
    $.ajax({
        url: `${API_BASE_URL}`,
        method: 'GET',
        dataType: 'json',
        success: (response) => {
            populateFeaturedSection(response)
        },
        error: (error) => {
            console.log(error)
        }
    })
}

function populateFeaturedSection(featured_movies) {
    $('#featured-movies').html('')
    console.log(featured_movies)
    featured_movies.forEach(movie => {
        $('#featured-movies').append(`
            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <img src="${movie.image_url}" class="card-img-top" alt="...">
                    <div class="card-body " style="height:130px;" >
                        <p class="card-text">${movie.title}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <a href="/movie.html?id=${movie.id}" class="btn btn-sm btn-outline-secondary">View</a>
                                <a href="/tickets/bookTicket.html?id=${movie.id}" class="btn btn-sm btn-outline-secondary">Book</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }
    )
}