const API_BASE_URL = 'http://localhost/movie_theatre/api/movies/'


fetchAndPopulateMoviesInDropdown()
restrictPreviousDayBooking()
fillHallWithSeats()
handleNumberOfTicketsChange()
fetchBookedSeats()


$('#book-ticket-form').submit(function (event) {
    event.preventDefault()
    bookTickets()
})

// on change of movie dropdown and date
$('#movie-dropdown, #date').change(function () {
    fetchBookedSeats()
})

function getMovieIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('id')
}

function bookTickets() {
    const movieId = Number($('#movie-dropdown').val())
    const date = $('#date').val()
    const numberOfTickets = $('#n-tickets').val()
    const seats = $('.seat.bg-secondary').map(function () {
        return $(this).attr('id')
    }).get()

    const user_id = localStorage.getItem('user_id') || 1

    const tickets = Array.from({ length: numberOfTickets }, () => ({
        movie_id: movieId,
        show_date: date,
        user_id: user_id,
        seat_number: seats.pop()
    }))

    console.log(tickets)

    $.ajax({
        url: `${API_BASE_URL}/bookTicket.php`,
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(tickets),
        success: (response) => {
            console.log(response)
            alert('Ticket booked successfully!')
            window.location.href = '/index.html'
        },
        error: (error) => {
            console.log(error)
            alert(error.responseJSON?.message)
        }
    })
}

function handleNumberOfTicketsChange() {
    $('#n-tickets').change(function () {
        const numberOfSeats = Number($('#n-tickets').val()) || 0
        const selectedSeats = $('.seat.bg-secondary').length
        if (selectedSeats == numberOfSeats) {
            $("#book-now-button").attr('disabled', false)
        }
        if (selectedSeats > numberOfSeats) {
            for (let i = 0; i < selectedSeats - numberOfSeats; i++) {
                $('.seat.bg-secondary').last().toggleClass('bg-secondary text-white')
            }
        }
        if (selectedSeats < numberOfSeats) {
            $("#book-now-button").attr('disabled', true)
        }
    })
}

function fetchBookedSeats() {
    const movieId = Number($('#movie-dropdown').val())
    const show_date = $('#date').val()

    if (!movieId || !show_date) {
        return
    }

    $.ajax({
        url: `${API_BASE_URL}/getBookedSeats.php?movie_id=${movieId}&show_date=${show_date}`,
        method: 'GET',
        dataType: 'json',
        success: (seats) => {
            blockBookedSeats(seats)
        },
        error: (error) => {
            console.log(error)
        }
    })

}

function blockBookedSeats(seats) {
    seats.forEach(seat => {
        $(`#${seat.seat_number}`).attr('disabled', true)
        $(`#${seat.seat_number}`).addClass('bg-danger text-white')
        $(`#${seat.seat_number}`).css('cursor', 'not-allowed')
    })
}

function fillHallWithSeats() {
    const rows = ['A', 'B', 'C', 'D']
    const columns = 12
    $('#hall').html('')
    for (let i = 0; i < rows.length; i++) {
        $('#hall').append(`
        <div class="d-flex flex-wrap justify-content-center hall-row">
        </div>
        `)

        for (let j = 1; j <= columns; j++) {
            const seat_number = `SEAT-${rows[i]}-${j}`
            $('.hall-row').last().append(`
            <button type="button" class="seat" style="font-size:10px" id="${seat_number}">${rows[i]}${j}</button>
            `)
        }
    }

    $('.seat').click(function () {
        $(this).toggleClass('bg-secondary text-white')
        const numberOfSeats = Number($('#n-tickets').val()) || 0
        const selectedSeats = $('.seat.bg-secondary').length

        if (numberOfSeats == 0) {
            alert('Please select number of seats first!')
            return
        }
        if (selectedSeats == numberOfSeats) {
            $("#book-now-button").attr('disabled', false)
        }
        if (selectedSeats > numberOfSeats) {
            alert('You have selected more seats than you have requested!')
            $(this).toggleClass('bg-secondary text-white')

        }
    })
}


function restrictPreviousDayBooking() {
    var today = new Date()

    var dd = today.getDate()
    var mm = today.getMonth() + 1 // January is 0!
    var yyyy = today.getFullYear()

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    var formattedDate = yyyy + '-' + mm + '-' + dd
    $('#date').attr('min', formattedDate)
    $('#date').val(formattedDate)
}

function fetchAndPopulateMoviesInDropdown() {
    $.ajax({
        url: `${API_BASE_URL}`,
        method: 'GET',
        dataType: 'json',
        success: (response) => {
            populateMoviesInDropdown(response)
        },
        error: (error) => {
            console.log(error)
        }
    })
}

function populateMoviesInDropdown(movies) {
    $('#movie-dropdown').html('')
    const movieId = getMovieIdFromUrl()
    $('#movie-dropdown').append(`<option value="" ${movieId ? '' : 'selected'}  disabled>Select a movie</option>`)
    movies.forEach(movie => {
        $('#movie-dropdown').append(`
            <option value="${movie.id}" ${movieId ? 'selected' : ''} >${movie.title}</option>
        `)
    })
}