const API_BASE_URL = 'http://localhost/movie_theatre/api/movies/'

fetchAndPopulateMovies()
let movieToDelete = null

$("#submit-movie").click(() => {
    const title = $("#title").val()
    const description = $("#description").val()
    const release_date = $("#release_date").val()
    const image_url = $("#image_url").val()
    if (!title || !description || !release_date || !image_url) {
        alert("Please fill out all fields")
        return
    }
    $.ajax({
        url: `${API_BASE_URL}`,
        method: 'POST',
        dataType: 'json',
        data: {
            title,
            description,
            release_date,
            image_url
        },
        success: (response) => {
            fetchAndPopulateMovies()
            $("#title").val('')
            $("#description").val('')
            $("#release_date").val('')
            $("#image_url").val('')
            $('#addMovieModal').modal('hide')
        },
        error: (error) => {
            console.log(error)
        },
    })
})

$("#delete-movie").click(() => {
    $.ajax({
        url: `${API_BASE_URL}?id=${movieToDelete.id}`,
        method: 'DELETE',
        dataType: 'json',
        success: (response) => {
            fetchAndPopulateMovies()
            $("#deleteMovieModal").modal('hide')
        },
        error: (error) => {
            console.log(error)
        },
    })
})


function fetchAndPopulateMovies() {
    console.log(localStorage.getItem('token'))
    $.ajax({
        url: `${API_BASE_URL}`,
        method: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: (response) => {
            populateMovieTable(response)
        },
        error: (error) => {
            console.log(error)
        }
    })
}

function populateMovieTable(movies) {
    $('#movie-list-table tbody').empty()
    $.each(movies, (index, movie) => {
        $('#movie-list-table tbody').append(`
        <tr>
            <td>${index + 1}</td>
            <td><img src="${movie.image_url}" width="100px" height="100px" style="object-fit:cover;" /></td>
            <td>${movie.title}</td>
            <td style="width:500px" >${movie.description}</td>
            <td>${movie.release_date}</td>
            <td>
                <button class='btn btn-danger ' id="toggleDeleteModal-${movie.id}"  data-id="${movie.id}" data-movie-title="${movie.title}"   >Delete</button>
            </td>
        </tr>
        `)
        attachDeleteMovieHandlerInRow(movie)
    })
}

function attachDeleteMovieHandlerInRow(movie) {
    $(`#toggleDeleteModal-${movie.id}`).click((event) => {
        const id = $(event.target).data('id')
        const title = $(event.target).data('movie-title')
        movieToDelete = {
            id,
            title
        }
        populateDeleteModal(movieToDelete)
    })
}

function populateDeleteModal(movie) {
    $("#deleteMovieModal").modal('show')
    $("#deleteMovieModal .modal-body").html(`
        <p>Are you sure you want to delete <b> ${movie.title}? </b> </p>
    `)
}