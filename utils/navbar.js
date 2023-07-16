const user_id = localStorage.getItem('user_id')

if (user_id) {
    $('#login-button').hide()
    $('#register-button').hide()
    $('#logout-button').show()
    $('#my-tickets-button').show()
} else {
    $('#login-button').show()
    $('#register-button').show()
    $('#logout-button').hide()
    $('#my-tickets-button').hide()

    const unauthenticatedPaths = ['/', '/account/register/', '/account/login/']
    if (!unauthenticatedPaths.includes(window.location.pathname)) {
        window.location.href = '/account/login'
    }
}

$("#logout-button").click(function () {
    localStorage.removeItem('user_id')
    window.location.href = '/'
})