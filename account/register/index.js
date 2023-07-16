const API_BASE_URL = 'http://localhost/movie_theatre/api/account/register.php'

$("#user-register-button").click(function (event) {
    event.preventDefault()
    $("#user-register-button").attr("disabled", true)
    $("#user-register-button").html("Loading...")
    const user = {
        username: $("#username").val(),
        password: $("#password").val(),
        email: $("#email").val(),
        first_name: $("#first_name").val(),
        last_name: $("#last_name").val(),
    }

    $.ajax({
        url: API_BASE_URL,
        method: 'POST',
        dataType: 'json',
        data: user,
        success: (response) => {
            window.location.href = "/account/login"
        },
        error: (error) => {
            console.log(error)
        },
    })
})
