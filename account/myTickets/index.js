const API_BASE_URL = 'http://localhost/movie_theatre/api/tickets/'


fetchMyTickets()

function fetchMyTickets() {
    const user_id = localStorage.getItem('user_id')

    $.ajax({
        url: `${API_BASE_URL}/myTickets.php?user_id=${user_id}`,
        method: 'GET',
        dataType: 'json',
        success: (tickets) => {
            console.log(tickets)
            populateMyTickets(tickets)
        }
    })

}

function populateMyTickets(tickets) {
    const myTicketsContainer = $('#my-tickets-container')
    myTicketsContainer.empty()

    tickets.forEach(ticket => {
        const {
            id,
            movie_title,
            movie_description,
            show_date,
            seat_number,
        } = ticket
        const qr = generateQRCodeURL(ticket)


        const ticketCard = $(`
        <div class="col-md-4 mb-4" id="ticket-${id}">
        <div class="card bg-light p-2">
          <img src="${qr}" class="card-img-top" style="width:200px; margin:auto; border-radius:10px;"  alt="Movie 3">
          <div class="card-body" style="height:230px;">
            <h5 class="card-title">${movie_title}</h5>
            <p class="card-text">${truncateString(movie_description, 50)}</p>
            <p class="card-text">Showtime: <span class="text-primary">${formatDate(show_date)}</span></p>
            <p class="card-text">Seat Number: <span class="text-danger">${seat_number}</span></p>
          </div>
          <div class="btn-group mx-auto">
            <button class="btn btn-outline-danger btn-sm cancel-ticket-btn " data-id="${id}" >Cancel Ticket</button>
            <button class="btn btn-outline-success btn-sm download-ticket-btn " data-id="${id}" >Download Ticket</button>
            <button class="btn btn-outline-primary btn-sm share-ticket-btn" data-id="${id}"  >Share Ticket</button>
         </div>
        </div>
      </div>
    `)
        myTicketsContainer.append(ticketCard)
    })

    $('.cancel-ticket-btn').click(function (event) {
        event.preventDefault()
        const ticketId = $(this).data('id')
        const salim = $(this).data('salim')

        console.log(salim)
        cancelTicket(ticketId)
    })

    $('.download-ticket-btn').click(function (event) {
        event.preventDefault()
        const ticketId = $(this).data('id')
        downloadTicket(ticketId)
    })

    $('.share-ticket-btn').click(function (event) {
        event.preventDefault()
        const ticketId = $(this).data('id')
        shareTicket(ticketId)
    })

}

function cancelTicket(ticketId) {
    console.log(ticketId)
}

function downloadTicket(ticketId) {
    window.location.href = `/account/myTickets/download-ticket.html?ticketId=${ticketId}`
}


function shareTicket(ticketId) {
    console.log(ticketId)
}

function truncateString(str, num) {
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...'
}


function formatDate(date) {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function generateQRImageSrc(ticketId) {
    return `https://chart.googleapis.com/chart?chs=350x350&cht=qr&chl=${ticketId}&choe=UTF-8`
}

function generateQRCodeURL(ticket_) {
    const ticket = { ...ticket_ }
    delete ticket.id
    delete ticket.movie_description
    const encodedData = encodeURIComponent(JSON.stringify(ticket))
    const qrCodeURL = `https://chart.googleapis.com/chart?chs=350x350&cht=qr&chl=${encodedData}&choe=UTF-8`
    return qrCodeURL
}