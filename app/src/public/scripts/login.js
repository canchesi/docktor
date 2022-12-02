$('#login-button').click(function() {
    var email = $('#email').val();
    var password = $('#password').val();
    $.ajax({
        url: '/login',
        type: 'POST',
        data: {
            email: email,
            passwd: password
        },
        success: function(data) {
            window.location.href = '/';
        },
        error: function() {
            $(".error-text").show();
        }
    });
});