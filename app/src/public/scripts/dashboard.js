$.ajax({
    url: '/api/machines',
    type: 'GET',
    success: (data) => {
        var containers = 0;
        const number = $('#containers-info').find('.info-box-number').html();
        for (elem of data) {
            var whereToConnect = [elem.url, elem.ipv4, elem.ipv6] 
            if (elem.is_active) {
                $.ajax({
                    url: 'http://' + whereToConnect[0] + ':' + elem.port + '/api/containers/json',
                    type: 'GET',
                    cors: true,
                    success: (data) => {
                        if (number != '...')
                            $('#containers-info').find('.info-box-number').html(number + JSON.parse(data).length);
                        else
                            $('#containers-info').find('.info-box-number').html(JSON.parse(data).length);
                    },
                    error: (err) => {
                        $.ajax({
                            url: 'http://' + whereToConnect[1] + ':' + elem.port + '/api/containers/json',
                            type: 'GET',
                            cors: true,
                            success: (data) => {
                                if (number != '...')
                                    $('#containers-info').find('.info-box-number').html(number + JSON.parse(data).length);
                                else
                                    $('#containers-info').find('.info-box-number').html(JSON.parse(data).length);
                            },
                            error: (err) => {
                                $.ajax({
                                    url: 'http://[' + whereToConnect[2] + ']:' + elem.port + '/api/containers/json',
                                    type: 'GET',
                                    cors: true,
                                    success: (data) => {
                                        if (number != '...')
                                            $('#containers-info').find('.info-box-number').html(number + JSON.parse(data).length);
                                        else
                                            $('#containers-info').find('.info-box-number').html(JSON.parse(data).length);
                                    },
                                    error: (err) => {
                                        $('#containers-info').find('.info-box-number').html('<i class="cib-highly" title="Problemi di raggiungimento delle macchine."></i>').removeClass('bg-info').addClass('bg-warning');
                                        $.ajax({
                                            url: '/api/machines/' + elem.id,
                                            type: 'PUT',
                                            data: {
                                                is_active: false
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
        if (containers)
            $('#containers-info').find('.info-box-number').html(containers);
        $('#machines-info').find('.info-box-number').html(data.length);
    }
});