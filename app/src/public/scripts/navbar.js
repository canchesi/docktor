$.ajax({
    url: '/templates/navbar',
    type: 'GET',
    success: (data) => {
        $('#navbar').html(data);
        $('#dropdownMenuButton').click(() => {
        });

        // UserID, nome e cognome utente
        $.ajax({
            url: '/api/infos/this',
            type: 'GET',
            success: (data) => {
                $('#profile').append(data.uid + ' - ' + data.first_name + ' ' + data.last_name);
            }
        });
    }
})
