let query = new URLSearchParams(location.search);
if(query.toString() != "") {
    if(query.get("sessione") == "scaduta") {
        $('.alert-danger').html('Sessione scaduta. Effettua nuovamente il login.')
        query.delete("session");
    } else if(query.get("errore") == "generico") {
        $('.alert-danger').html('Errore generico. Contatta l\'amministratore.')
        query.delete("errore");
    } else if(query.get("token") == "invalido") {
        $('.alert-danger').html('Errore nell\'autenticazione. Effettua nuovamente il login.')
        query.delete("token");
    }
    $('.alert-danger').show();
    history.replaceState(null, null, location.pathname);
}

$('.login-input').keyup(function(e) {
    if (e.keyCode == 13) {
        $('#login-button').click();
    }
});

$('#login-button').click(function() {
    var email = $('#email').val();
    var password = $('#password').val();
    $.ajax({
        url: '/login',
        type: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        data: {
            email: email,
            passwd: password
        },
        success: function() {
            window.location.href = '/';
        },
        error: function() {
            $(".alert-danger").html('Email e/o password errati.').show();
        }
    });
});