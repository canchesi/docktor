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

$('#delete-account').click(() => {
    $('#delete-account-modal').modal('show')
    $('#cancel-button-delete-account-modal').click(() => {
        $('#delete-account-modal').modal('hide')
    })

    $('#confirm-button-delete-account-modal').click(() => {
        $.ajax({
            url: '/api/users/' + $('#id').val(),
            type: 'DELETE',
            success: () => {
                $.ajax({
                    url: '/logout?eliminato=true',
                    type: 'GET',
                    success: () => {
                        window.location.href = '/'
                    },
                    error: () => {
                        window.location.href = '/'
                    }
                })
            }
        })
    })
})

// Popolazioe gruppi
$.ajax({
    url: '/api/groups/this',
    type: 'GET',
    success: (data) => {
        const defult = data.splice(data.indexOf(data.find((el) => el.is_default)), 1)[0]
        $('#groups').append('<tr style="background: var(--color-primary);"><td>' + defult.id + '</td><td>Defult</td><td>' + defult.num_machines + '</td><td></td></tr>')
        data.forEach((el) => {
            $('#groups').append('<tr><td>' + el.id + '</td><td>' + el.name + '</td><td>' + el.num_machines + '</td><td><button class="btn btn-danger btn-sm group-delete-button" id="group-delete-' + el.id + '"><i class="fa-solid fa-trash"></i></button></td></tr>')
        })
        if($('#group-table').height() > $('#group-table').parent().height())
            $('#group-table').parent().attr('style', 'overflow-y: scroll;')
        else if($('#group-table').height() < $('#group-table').parent().height() / 1.33)
            $('#group-table').parent().attr('style', 'position: relative').append('<i class="fa-solid fa-check" id="check" title="Non ci sono pi\ gruppi" style="top:' + ((1 + ($('#group-table').height() / $('#group-table').parent().height())) * 50) + '%"></i>')
    }

}).then(() => {
    $('#group-create-button').click(() => {
        $('#group-create-modal').modal('show')
        $('label[for="group-name"]').html('Nome');
        $('#cancel-button-group-create-modal').click(() => {
            $('#group-create-modal').modal('hide')
        })

        $('#confirm-button-group-create-modal').click(() => {
            $('#group-name').removeClass('is-invalid is-valid');
            if ($('#group-name').val() == '')
                $('#group-name').removeClass('is-valid').addClass('is-invalid')
            else {
                $.ajax({
                    url: '/api/groups/this',
                    type: 'GET',
                    success: (data) => {
                        if (data.find((el) => el.name == $('#group-name').val())) {
                            $('label[for="group-name"]').html('Nome');
                            $('#group-name').removeClass('is-valid').addClass('is-invalid')
                            $('label[for="group-name"]').append('<i class="fa-solid fa-exclamation-triangle" title="Esiste gi\ un gruppo con questo nome"></i>')
                        } else
                            $.ajax({
                                url: '/api/groups/create',
                                type: 'POST',
                                data: {
                                    name: $('#group-name').val()
                                },
                                success: () => {
                                    location.reload()
                                }
                            })
                    }
                })
            }
        })
    })

    $('.group-delete-button').click((e) => {
        console.log(e.target.id.split('-')[2]);
        $.ajax({
            url: '/api/groups/' + e.delegateTarget.id.split('-')[2],
            type: 'DELETE',
            success: () => {
                location.reload()
            }
        })
    })

})