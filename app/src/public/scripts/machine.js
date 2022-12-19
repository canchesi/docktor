const checkPort = (port) => {
    return Boolean(port.match(/^[0-9]{1,5}$/)) && port > 0 && port < 65536;
}

const checkIPv4 = (ip) => {
    return Boolean(ip.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/));
}

const checkURL = (url) => {
    return Boolean(url.match(/[a-zA-Z0-9@:%._\+~#=]{1,256}/));
}

const status = {
    'running': 0,
    'paused': 1,
    'exited': 2
}

const checkIPv6 = (ip) => {
    if (ip.indexOf('::') != -1) {
        const split = ip.split('::');
        const toBeCounted = split[0] + split[1];
        const count = toBeCounted.split(':').length;
        if (split[0] == "" && split[1] == "")
            ip = ip.replace('::', '0:'.repeat(7) + '0');
        else if (split[0] == "")
            ip = ip.replace('::', '0:'.repeat(8 - count));
        else if(split[1] == "")
            ip = ip.replace('::', ':0'.repeat(8 - count));
        else
            ip = ip.replace('::', ':' + '0:'.repeat(7 - count));
            console.log(count, toBeCounted, split, ip);
    }
    return Boolean(ip.match(/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/));       
}

const getContainers = (callback) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/json?all=1',
            type: 'GET',
            success: (data) => {
                callback(data);
                resolve();
            }
        })
    })
}

const fullfillTable = (data) => {
    const buttons = {
        'running': '<button class="btn btn-secondary btn-container mr-1" value="pause"><i class="fa-solid fa-pause"></i></button><button class="btn bg-gray-dark btn-container" value="stop"><i class="fa-solid fa-stop"></i></button>',
        'exited': '<button class="btn bg-olive btn-container mr-1" value="start"><i class="fa-solid fa-play"></i></button><button class="btn bg-danger btn-delete"><i class="fa-solid fa-trash"></i></button>',
        'paused': '<button class="btn bg-olive btn-container mr-1" value="unpause"><i class="fa-solid fa-play"></i></button><button class="btn bg-gray-dark btn-container" value="stop"><i class="fa-solid fa-stop"></i></button>',
    }
    for (let container of JSON.parse(data).sort((a, b) => status[a.State] - status[b.State]))
        $('#table').append('<tr> \
            <td>' + container.Id.substring(0, 16) + '</td> \
            <td>' + container.Names[0].replace('/', '') + '</td> \
            <td>' + container.State + ' - ' + container.Status + '</td> \
            <td>' + buttons[container.State] + '</td></tr>')

    $('#card-containers').height((5 * $('#table').children().last().height() + 1 + $('#div-table').children().find('thead').height() + $('#div-table').parent().find('.card-header').innerHeight()) / window.innerHeight *100 + 'vh');
    $('#check').remove();
    if ($('#table').children().length > 5)
        $('#div-table').attr('style', 'padding:0; overflow-y: auto; display: block;')
    else if ($('#table').children().length < 4){
        $('#table-containers').parent().attr('style', 'padding: 0;position: relative').append('<i class="fa-solid fa-check" id="check" title="Non ci sono più containers" style="top:' + ((1 + ($('#table-containers').height() / $('#div-table').innerHeight())) * 50) + '%"></i>')
    }
}

const buttonsActions = () => {
    $('.btn-container') .click(function () {
        const id = $(this).parent().parent().children()[0].innerHTML;
        $.ajax({
            url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/' + id + '/' + $(this).val(),
            type: 'POST',
            success: () => {
                getContainers((data) => {
                    $('#table').empty();
                    (() => {
                        return new Promise((resolve, reject) => {
                            fullfillTable(data);
                            resolve();
                        })
                    })().then(() => {
                        buttonsActions();
                    })
                })
            },
            error: (data) => {
                
            }
        })
    })

    $('.btn-delete').click(function () {
        const id = $(this).parent().parent().children()[0].innerHTML;
        $.ajax({
            url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/' + id,
            type: 'DELETE',
            success: () => {
                getContainers((data) => {
                    $('#table').empty();
                    (() => {
                        return new Promise((resolve, reject) => {
                            fullfillTable(data);
                            resolve();
                        })
                    })().then(() => {
                        buttonsActions();
                    })
                })
            },
            error: (data) => {
                
            }
        })
    })
}

$('.btn-refresh').click(() => {
    getContainers((data) => {
        $('#table').empty();
        fullfillTable(data);
    }).then(() => {
        buttonsActions();
    })
});


(() => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/machines/' + window.location.pathname.split('/')[2],
            type: 'GET',
            success: function (data) {
                $('#id').val(data.id)
                $('#name').val(data.custom_name);
                $('#address').val(data.address);
                $('#port').val(data.port);
                $('#is_active').prop('checked', data.is_active);
                resolve()
            }
        })
    })
})().then(() => {
    getContainers((data) => {
        $('#table').empty();
        fullfillTable(data);
    }).then(() => {
        buttonsActions();
    })
})


$('#save').click(() => {
    if (checkIPv4($('#address').val()) || checkIPv6($('#address').val()) || checkURL($('#address').val())) {
        if (checkPort($('#port').val())) {
            $.ajax({
                url: '/api/machines/' + $('#id').val(),
                type: 'PUT',
                data: {
                    custom_name: $('#name').val(),
                    address: $('#address').val(),
                    port: $('#port').val(),
                    is_active: $('#is_active').prop('checked')
                },
                success: () => {
                    $('#name').removeClass('is-invalid').addClass('is-valid');
                    $('#address').removeClass('is-invalid').addClass('is-valid');
                    $('#port').removeClass('is-invalid').addClass('is-valid');
                },
                error: () => {
                    $('#name').removeClass('is-valid').addClass('is-invalid');
                    $('#address').removeClass('is-valid').addClass('is-invalid');
                    $('#port').removeClass('is-valid').addClass('is-invalid');
                }
            })
        } else
            $('#port').removeClass('is-valid').addClass('is-invalid');
    } else
        $('#address').removeClass('is-valid').addClass('is-invalid');
})
