$.ajax({
    url: '/templates/sidebar',
    type: 'GET',
    success: (data) => {
        $('#sidebar').html(data);
        $('.sidebar').find('a').each((i, el) => {
            if (el.href == window.location.href) {
                $(el).addClass('current-page');
            }
        })
    }
})