$.ajax({
    url: '/templates/sidebar',
    type: 'GET',
    success: (data) => {
        $('#sidebar').html(data);
        $('.main-sidebar').find('a').each((i, el) => {
            if (el.href == window.location.href) {
                $(el).addClass('current-page');
            }
        })

        // UserID, nome e cognome utente
        $.ajax({
            url: '/api/infos/this',
            type: 'GET',
            success: (data) => {
                $('#user').html(data.uid + ' - ' + data.first_name + ' ' + data.last_name);
            }
        });
    }
})
