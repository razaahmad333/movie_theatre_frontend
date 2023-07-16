const API_BASE_URL = 'http://localhost/movie_theatre/api/account/login.php'

$('#login-form').submit(function (event) {
    event.preventDefault()
    $('#login-button').attr('disabled', true)
    $('#login-button').html('Loading...')
    const user = {
        username: $('#username').val(),
        password: $('#password').val(),
    }


    $.ajax({
        url: API_BASE_URL,
        method: 'POST',
        dataType: 'json',
        data: user,
        success: (response, textStatus, jqXHR) => {
            // console.log(response)
            localStorage.setItem('user_id', response.user.id)
            // const sessionId = jqXHR.getResponseHeader('PHPSESSID') || jqXHR.getResponseHeader('Set-Cookie')
            // console.log(sessionId)
            window.location.href = '/'
        },
        error: (error) => {
            console.log(error)
            $('#error-message').html(error.responseJSON?.message).addClass('alert alert-danger')
            $('#login-button').attr('disabled', false)
            $('#login-button').html('Login')
        },
    })
})
