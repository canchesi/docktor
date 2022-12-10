// Ottenimento dati utente
$.ajax({
    url: '/api/users/this?email=true',
    type: 'GET',
    success: (data) => {
        $('#email').val(data.email)
    }
})

// Ottenimento informazioni utente
$.ajax({
    url: '/api/infos/this',
    type: 'GET',
    success: (data) => {
        $('#id').val(data.uid)
        $('#nome').val(data.first_name)
        $('#cognome').val(data.last_name)
        $('#data').val(data.birth_date)
        $('#gender').find('option').each((i, el) => {
            if(el.value == data.gender)
                $(el).prop('selected', true)
        })
    }
})

// Aggiornamento informazioni utente
$('#info-save').click(() => {
    $.ajax({
        url: '/api/infos/this',
        type: 'PUT',
        data: {
            first_name: $('#nome').val(),
            last_name: $('#cognome').val(),
            gender: $('#gender').val(),
            birth_date: $('#data').val()
        },
        success: () => {
            $('#nome').removeClass('is-invalid').addClass('is-valid');
            $('#cognome').removeClass('is-invalid').addClass('is-valid');
            $('#gender').removeClass('is-invalid').addClass('is-valid');
            $('#data').removeClass('is-invalid').addClass('is-valid');
        },
        error: () => {
            $('#nome').removeClass('is-valid').addClass('is-invalid');
            $('#cognome').removeClass('is-valid').addClass('is-invalid');
            $('#gender').removeClass('is-valid').addClass('is-invalid');
            $('#data').removeClass('is-valid').addClass('is-invalid');
        }
    })
})

// Aggiornamento dati utente
$('#access-save').click(() => {
    if (String($('#email').val()).toLowerCase().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/))
            $.ajax({
            url: '/api/users/this',
            type: 'PUT',
            data: {
                email: $('#email').val()
            },
            success: () => {
                $('#email').removeClass('is-invalid').addClass('is-valid');
            },
            error: (err) => {
                $('#email').removeClass('is-valid').addClass('is-invalid');
            }
        })
    else
        $('#email').removeClass('is-valid').addClass('is-invalid');

    if($('#nuova-password').val() || $('#nuova-password-conf').val() || $('#vecchia-password').val()) {
        $.ajax({
            url: '/api/users/check',
            type: 'POST',
            data: {
                passwd: $('#vecchia-password').val()
            },
            success: (data) => {
                if (!data) {
                    $('#vecchia-password').removeClass('is-valid').addClass('is-invalid');
                    $('#nuova-password').removeClass('is-valid is-invalid');
                    $('#nuova-password-conf').removeClass('is-valid is-invalid');
                } else if($('#nuova-password').val() == '') {
                    $('#vecchia-password').removeClass('is-invalid').addClass('is-valid');
                    $('#nuova-password').removeClass('is-valid').addClass('is-invalid');
                    $('#nuova-password-conf').removeClass('is-valid').addClass('is-invalid');
                } else if($('#nuova-password').val() != $('#nuova-password-conf').val()) {
                    $('#vecchia-password').removeClass('is-invalid').addClass('is-valid');
                    $('#nuova-password').removeClass('is-invalid is-valid');
                    $('#nuova-password-conf').removeClass('is-valid').addClass('is-invalid');
                } else 
                    $.ajax({
                        url: '/api/users/this',
                        type: 'PUT',
                        data: {
                            passwd: $('#nuova-password').val(),
                        },
                        success: () => {
                            $('#nuova-password-conf').removeClass('is-invalid').addClass('is-valid');
                            $('#nuova-password').removeClass('is-invalid').addClass('is-valid');
                            $('#vecchia-password').removeClass('is-invalid').addClass('is-valid');
                        }
                    })
            }
        })
    }
})

// Popolazioe gruppi
$.ajax({
    url: '/api/groups/this',
    type: 'GET',
    success: (data) => {
        const private = data.pop((el) => el.is_private)
        $('#groups').append('<tr style="background: var(--color-primary);"><td>' + private.id + '</td><td>Privato</td><td>' + private.num_members + '</td></tr>')
        data.forEach((el) => {
            $('#groups').append('<tr><td>' + el.id + '</td><td>' + el.name + '</td><td>' + el.num_members + '</td></tr>')
        })
        if($('#group-table').height() > $('#group-table').parent().height())
            $('#group-table').parent().attr('style', 'overflow-y: scroll;')
        else if($('#group-table').height() < $('#group-table').parent().height() / 1.33)
            $('#group-table').parent().attr('style', 'position: relative').append('<i class="fa-solid fa-check" id="check" title="Non ci sono pi\ gruppi" style="top:' + ((1 + ($('#group-table').height() / $('#group-table').parent().height())) * 50) + '%"></i>')
    }

})