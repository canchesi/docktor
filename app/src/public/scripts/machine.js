//const goTo = require("../../middleware/goTo");

const checkPort = (port) => {
    return Boolean(port.match(/^[0-9]{1,5}$/)) && port > 0 && port < 65536;
}

const checkIPv4 = (ip) => {
    return Boolean(ip.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/));
}

const checkURL = (url) => {
    return Boolean(url.match(/[a-zA-Z0-9@:%._\+~#=]{1,256}/));
}

const statuses = {
    'running': 0,
    'paused': 1,
    'exited': 2
}

const types = {
    'volume': 0,
    'bind': 1
}

const buttons = {
    'running': '<button class="btn btn-secondary btn-container" value="pause"><i class="fa-solid fa-pause"></i></button><button class="btn bg-gray-dark btn-container" value="stop"><i class="fa-solid fa-stop"></i></button>',
    'exited': '<button class="btn bg-olive btn-container" value="start"><i class="fa-solid fa-play"></i></button><button class="btn bg-danger btn-delete container-delete"><i class="fa-solid fa-trash"></i></button>',
    'paused': '<button class="btn bg-olive btn-container" value="unpause"><i class="fa-solid fa-play"></i></button><button class="btn bg-gray-dark btn-container" value="stop"><i class="fa-solid fa-stop"></i></button>',
    'created': '<button class="btn bg-olive btn-container" value="start"><i class="fa-solid fa-play"></i></button><button class="btn bg-danger btn-delete container-delete"><i class="fa-solid fa-trash"></i></button>'
}

const volumeButton = '<button class="btn bg-danger btn-delete volume-delete"><i class="fa-solid fa-trash"></i></button>'

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
    }
    return Boolean(ip.match(/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/));       
}

const getContainersFromHost = (callback) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/json?all=1',
            type: 'GET',
            success: (data) => {
                callback(data);
                resolve();
            },
            error: (err) => {
                reject();
            }
        })
    })
}

const getVolumesFromHost= (callback) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/volumes',
            type: 'GET',
            success: (data) => {
                callback(data, false);
                resolve();
            }
        })
    })
}

const getPorts = () => {
    var input = $('#porte').val();
    var ports = {
        "exposed": {},
        "published": {}
    };
    if (input != "") {
        input = input.split(', ');
        if (input != undefined && input != null) {
            if (new Set(input).size != input.length)
                throw new Error('Duplicate port');
            for (let port of input) {
                let protocol = 'tcp';
                if (port.indexOf(':') != -1) {
                    port = port.split(':');
                    if (port[1].indexOf('/') != -1) {
                        port[1] = port[1].split('/');
                        if (port[1][1] == 'udp' || port[1][1] == 'tcp') {
                            protocol = port[1][1];
                            port[1] = port[1][0];
                        } else
                            throw new Error('Invalid protocol');
                    }
                    if (checkPort(port[0]) && checkPort(port[1])) {
                        ports["exposed"][(port[1] + '/' + protocol)] = {};
                        ports["published"][(port[1] + '/' + protocol)] = [{"HostPort": port[0]}];
                    } else
                        throw new Error('Invalid port');
                } else {
                    if (port.indexOf('/') != -1) {
                        port = port.split('/');
                        if (port[1] == 'udp' || port[1] == 'tcp') {
                            protocol = port[1];
                            port = port[0];
                        } else
                            throw new Error('Invalid protocol');
                    }
                    if (checkPort(port))
                        ports["exposed"][(port + '/' + protocol)] = {};
                    else
                        throw new Error('Invalid port');
                        
                }
            }
        } else 
            throw new Error('Port invalid syntax');
    }
    return ports;
}

const getVolumes = () => {
    var input = $('#volumi').val();
    var volumes = {volumes: {}, binds: []};
    if (input != "") {
        input = input.split(', ');
        if (input != undefined && input != null) {
            if (new Set(input).size != input.length)
                throw new Error('Duplicate volume');
            for (let volume of input) {
                if (volume.indexOf(':') != -1) {
                    if(volume.split(':')[1] == '/')
                        throw new Error('Invalid volume');
                    else
                        volumes.binds.push(volume);
                } else
                    volumes.volumes[volume] = {};
            }

        } else
            throw new Error('Volume invalid syntax');
    }
    return volumes;
}

const getImage = () => {
    var image = $('#immagine').val();
    if (image != "")
        if(image.indexOf(':') != -1) {
            image = image.split(':');
            if (image[1] == '')
                throw new Error('Invalid image');
            else
                return image;
        } else
            return [image, 'latest'];
    else
        throw new Error('Inserire immagine');
}

const containerFullfill = (data) => {
    for (let container of JSON.parse(data).sort((a, b) => {
        if (statuses[a.State] > statuses[b.State])
            return 1;
        else if (statuses[a.State] < statuses[b.State])
            return -1;
        else
            return a.Id.localeCompare(b.Id)}))
        $('#table').append('<tr> \
            <td>' + container.Id.substring(0, 16) + '</td> \
            <td><i class="fa-solid fa-pencil edit" style="margin-right: 4px"></i>' + container.Names[0].replace('/', '') + '</td> \
            <td class="container-state">' + container.Status + '</td> \
            <td>' + buttons[container.State] + '</td></tr>')

    $('#check').remove();
    //if ($('#table-containers').height() > $('#div-table').height())
        $('#div-table').attr('style', 'padding:0; overflow-y: auto; display: block;')
    //else if (!$('#table').children().length){
    //    $('#table-containers').parent().attr('style', 'padding: 0;position: relative').append('<i class="fa-solid fa-check" id="check" title="Non ci sono containers"></i>')
    //}
}

const volBindFullfill = (data, connected) => {
    var binds = [];
    if(connected) {
        for (let container of JSON.parse(data))
            for (let bind of container.Mounts) {
                bind["container"] = container.Id
                binds.push(bind);
            }

        for (let bind of binds.sort((a, b) => {
            if (types[(a.Type)] > types[(b.Type)])
                return 1;
            else if (types[(a.Type)] < types[(b.Type)])
                return -1;
            else if (a.container.localeCompare(b.container))
                return a.container.localeCompare(b.container)
            else if (a.Name != undefined && b.Name != undefined)
                return a.Name.localeCompare(b.Name)
            else 
                return a.Source.localeCompare(b.Source)}))
                $('#volume-table').append('<tr> \
                    <td>' + bind.Type.charAt(0).toUpperCase() + bind.Type.slice(1) + '</td> \
                    <td>' + (bind.Type == 'volume' ? bind.Name : bind.Source) + '</td> \
                    <td>' + bind.Destination + '</td> \
                    <td>' + bind.container.substring(0, 16) + '</td> \
                    <td>~</td></tr>');
    } else {
        var volumes = [];
        $('#volume-table').children().each((i, e) => volumes.push($(e).children().eq(1).text()))
        for (let volume of JSON.parse(data).Volumes.sort((a, b) => a.Name.localeCompare(b.Name))){
            if(!volumes.includes(volume.Name))
                $('#volume-table').append('<tr> \
                    <td>Volume Not Connected</td> \
                    <td>' + volume.Name + '</td> \
                    <td>~</td> \
                    <td>~</td> \
                    <td>' + volumeButton + '</td></tr>');
        }
    }
    $('#check-volumes').remove();
    if ($('#table-volumes').height() > $('#div-table-volumes').height())
        $('#div-table-volumes').attr('style', 'padding:0; overflow-y: auto; display: block;')
    else if (!$('#volume-table').children().length){
        $('#table-volumes').parent().attr('style', 'padding: 0;position: relative').append('<i class="fa-solid fa-check" id="check-volumes" title="Non ci sono volumi"></i>')
    }
}

const containerButtonsActions = () => {
    $('.btn-container') .click(function () {
        const id = $(this).parent().parent().children()[0].innerHTML;
        $.ajax({
            url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/' + id + '/' + $(this).val(),
            type: 'POST',
            success: () => {
                getContainersFromHost((data) => {
                    $('#table').empty();
                    $('#volume-table').empty();
                    (() => {
                        return new Promise((resolve, reject) => {
                            containerFullfill(data);
                            volBindFullfill(data, true);
                            resolve();
                        })
                    })().then(() => {
                        containerButtonsActions();
                        getVolumesFromHost(volBindFullfill)
                        .then(() => {
                            volumeButtonsActions();
                        })
                    })
                });
            }
        })
    })

    $('.container-delete').click(function () {
        const id = $(this).parent().parent().children()[0].innerHTML;
        $("#container-delete-modal").modal('show');
        $("#cancel-button-container-modal").click(() => {
            $("#container-delete-modal").modal('hide')
        })
        $("#confirm-button-container-modal").click(() => {
            var volumes;
            $.ajax({
                url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/' + id + '/json',
                type: 'GET',
                success: (data) => {
                    volumes = JSON.parse(data).Mounts
                    deleted = volumes.length;
                }
            }).then(() => {
                $.ajax({
                    url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/' + id,
                    type: 'DELETE'
                }).then(() => {
                    if(deleted > 0)
                        for (volume of volumes)
                            $.ajax({
                                url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/volumes/' + volume.Name + '?force=1',
                                type: 'DELETE',
                                success:() => {
                                    if(!--deleted)
                                        location.reload()
                                }
                            })
                    else
                        location.reload()
                })
            })
        })
    })
}

const volumeButtonsActions = () => {
    $('.volume-delete').click(function () {
        const id = $(this).parent().parent().children()[1].innerHTML;
        $.ajax({
            url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/volumes/' + id + '?force=1',
            type: 'DELETE',
            success: () => {
                location.reload();
            }
        })
    })
}

$('#container-refresh').click(() => {
    getContainersFromHost((data) => {
        $('#table').empty();
        $('#volume-table').empty();
        containerFullfill(data);
        volBindFullfill(data, true)
    }).then(() => {
        containerButtonsActions();
        getVolumesFromHost(volBindFullfill)
        .then(() => {
            volumeButtonsActions();
        })
    })
});

$('#container-create').click(() => {
    $('#container-create-modal').modal('show');
    $('#container-create-error').empty();
    $('#cancel-button-container-create-modal').click(() => {
        $('#container-create-modal').modal('hide');
    })
    $('#avanzate').click(() => {
        $('#avanzate').val($('#avanzate').val() == 'true' ? 'false' : 'true');
        if ($('#avanzate').val() == 'true')
            $('.avanzata').show();
        else
            $('.avanzata').hide();
    })
    $('#autoremove').click(() => {
        $('#autoremove').toggleClass('btn-success');
        $('#autoremove').toggleClass('btn-danger');
        $('#autoremove').val($('#autoremove').val() == 'true' ? 'false' : 'true');
        $('#autoremove').val() == 'true' ? $('#restart').attr('disabled', 'disabled') : $('#restart').removeAttr('disabled');
    })
    $('#networking').click(() => {
        $('#networking').toggleClass('btn-success');
        $('#networking').toggleClass('btn-danger');
        $('#networking').val($('#netiworking').val() == 'true' ? 'false' : 'true');
    })
    $('#confirm-button-container-create-modal').click(() => {
        $('.is-invalid').removeClass('is-invalid');
        $('.fa-exclamation-triangle').remove();
        try {
            const ports = getPorts();
            const volumes = getVolumes();
            const image = getImage();
            if ($('#immagine').val() == '')
                throw new Error('Inserire immagine');
            if ($('#nome').val() == '')
                throw new Error('Inserire nome');
            const data = {
                Image: image[0] + ':' + image[1],
                ExposedPorts: ports.exposed,
                Cmd: $('#comandi').val() ? $('#comandi').val().split('; ') : [],
                Volumes: volumes.volumes,
                HostConfig: {
                    Binds: volumes.binds,
                    PortBindings: ports.published,
                }
            }
            if ($('#avanzate').val() == 'true') {
                if($('autoremove').val() == 'false')
                    data.HostConfig.RestartPolicy = {
                        Name: $('#restart').val()
                    }
                try {
                    data.HostConfig.CpusetCpus = "0" + (Number($('#cpu').val()) - 1 != '0' ? ('-' + (Math.abs(Number($('#cpu').val()) - 1))) : "");
                } catch (e) {
                    data.HostConfig.CpusetCpus = "0";
                }
                
                if(Number($('#ram').val()) > 6)
                    data.HostConfig.Memory = Number($('#ram').val()) * 1024 * 1024;
                else
                    throw new Error('RAM minima 6MB');
                data.HostConfig.AutoRemove = $('#autoremove').val() == 'true';
                data.NetworkDisabled = $('#networking').val() == 'false';
            }
            $.ajax({
                url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/create?name=' + $('#nome').val(),
                type: 'POST',
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                success: () => {
                    location.reload();
                },
                error: (e) => {
                    $('#container-create-error').empty();
                    switch (e.status) {
                        case 400:
                            $('#container-create-error').html('<i class="fas fa-exclamation-triangle" title="Errore di sintassi"></i>');
                            break;
                        case 404:
                            $('#container-create-error').html('<i class="fas fa-exclamation-triangle" title="Immagine non trovata"></i><button id="pull-image" class="btn btn-warning ml-2"><i class="fas fa-download"></i> Scarica immagine</button>');
                            $('#pull-image').click(() => {
                                $('#pull-image').html('<i class="fas fa-spinner fa-spin"></i> Scaricamento in corso...');
                                $.ajax({
                                    url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/images/create?fromImage=' + image[0] + '&tag=' + image[1],
                                    type: 'POST',
                                    success: () => {
                                        $('#pull-image').html('<i class="fas fa-check"></i> Immagine scaricata');
                                        $('#pull-image').attr('disabled', 'disabled');
                                    },
                                    error: (e) => {
                                        switch (e.status) {
                                            case 400:
                                                $('#container-create-error').html('<i class="fas fa-exclamation-triangle" title="Errore di sintassi"></i>');
                                                break;
                                            case 404:
                                                $('#container-create-error').html('<i class="fas fa-exclamation-triangle" title="Immagine inesistente"></i>');
                                                break;
                                            case 409:
                                                $('#container-create-error').html('<i class="fas fa-exclamation-triangle" title="Conflitto durante la creazione"></i>');
                                                break;
                                            case 500:
                                                $('#container-create-error').html('<i class="fas fa-exclamation-triangle" title="Errore interno. Controllare parametri."></i>');
                                                break;
                                            default:
                                                $('#container-create-error').html('<i class="fas fa-exclamation-triangle" title="Errore sconosciuto"></i>');
                                        }
                                    }
                                })
                            })
                            break;
                        case 409:
                            $('#container-create-title').html($('#container-create-title').html() + '<i class="fas fa-exclamation-triangle" title="Conflitto durante la creazione"></i>');
                            break;
                        case 500:
                            $('#container-create-title').html($('#container-create-title').html() + '<i class="fas fa-exclamation-triangle" title="Errore interno"></i>');
                            break;
                        default:
                            $('#container-create-title').html($('#container-create-title').html() + '<i class="fas fa-exclamation-triangle" title="Errore sconosciuto"></i>');
                    }

                }
            })
        } catch (e) {
            $('#container-create-error').empty();
            switch (e.message) {
                case 'Duplicate volume':
                    $('#volumi').addClass('is-invalid');
                    $('label[for="volumi"]').html($('label[for="volumi"]').html() + '<i class="fas fa-exclamation-triangle" title="Inserito volume pi\ù volte"></i>');
                    break;
                case 'Invalid volume':
                    $('#volumi').addClass('is-invalid');
                    $('label[for="volumi"]').html($('label[for="volumi"]').html() + '<i class="fas fa-exclamation-triangle" title="Volume / non valido"></i>');
                    break;
                case 'Volume invalid syntax':
                    $('#volumi').addClass('is-invalid');
                    $('label[for="volumi"]').html($('label[for="volumi"]').html() + '<i class="fas fa-exclamation-triangle" title="Sintassi non valida, rispettare l\'esempio"></i>');
                    break;
                case 'Invalid port':
                    $('#porte').addClass('is-invalid');
                    $('label[for="porte"]').html($('label[for="porte"]').html() + '<i class="fas fa-exclamation-triangle" title="Porta non valida"></i>');
                    break;
                case 'Duplicate port':
                    $('#porte').addClass('is-invalid');
                    $('label[for="porte"]').html($('label[for="porte"]').html() + '<i class="fas fa-exclamation-triangle" title="Inserita porta pi\ù volte"></i>');
                    break;
                case 'Port invalid syntax':
                    $('#porte').addClass('is-invalid');
                    $('label[for="porte"]').html($('label[for="porte"]').html() + '<i class="fas fa-exclamation-triangle" title="Sintassi non valida, rispettare l\'esempio"></i>');
                    break;
                case 'Invalid protocol':
                    $('#porte').addClass('is-invalid');
                    $('label[for="porte"]').html($('label[for="porte"]').html() + '<i class="fas fa-exclamation-triangle" title="Protocollo non valido"></i>');
                    break;
                case 'Inserire immagine':
                    $('#immagine').addClass('is-invalid');
                    $('label[for="immagine"]').html($('label[for="immagine"]').html() + '<i class="fas fa-exclamation-triangle" title="Inserire immagine"></i>');
                    break;
                case 'Inserire nome':
                    $('#nome').addClass('is-invalid');
                    $('label[for="nome"]').html($('label[for="nome"]').html() + '<i class="fas fa-exclamation-triangle" title="Inserire nome"></i>');
                    break;
                case 'RAM minima 6MB':
                    $('#ram').addClass('is-invalid');
                    $('label[for="ram"]').html($('label[for="ram"]').html() + '<i class="fas fa-exclamation-triangle" title="RAM minima 6MB"></i>');
                    break;
                default:
                    $('#container-create-title').html($('#container-create-title').html() + '<i class="fas fa-exclamation-triangle" title="' + e.message + '"></i>');
            }
        }
    })
})

$('#volume-create').click(() => {
    $('#volume-create-modal').modal('show');
    $('#volume-create-error').empty();
    $('#cancel-button-volume-create-modal').click(() => {
        $('#volume-create-modal').modal('hide');
    })

    $('#confirm-button-volume-create-modal').click(() => {
        $.ajax({
            url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/volumes/create',
            type: 'POST',
            data: {
                name: $('#nome-volume').val() || null,
            },
            success: (data) => {
                location.reload();
            }
        })
    })
})


$('#volume-refresh').click(() => {
    getContainersFromHost((data) => {
        $('#volume-table').empty();
        volBindFullfill(data, true);
    }).then(() => {
        getVolumesFromHost(volBindFullfill)
        .then(() => {
            volumeButtonsActions();
        })
    })
});

$('#volume-prune').click(() => {
    $('#volume-prune-modal').modal('show');
    $('#cancel-button-volume-prune-modal').click(() => {
        $('#volume-prune-modal').modal('hide');
    })
    $('#confirm-button-volume-prune-modal').click(() => {
        $('#volume-prune-modal').modal('hide');
        $.ajax({
            url: 'https://' + $('#address').val() + ':' + $('#port').val() + '/api/volumes/prune',
            type: 'POST',
            success: function (data) {
                location.reload();
            }
        })
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
                if (!data.is_active)
                    reject('Machine is not active');
                else
                    resolve()
            },
            error: function (data) {
                reject(data);
            }
        })
    })
})().then(() => {
    getContainersFromHost((data) => {
        $('#table').empty();
        containerFullfill(data);
        volBindFullfill(data, true);
    }).then(() => {
        containerButtonsActions();
    const query = new URLSearchParams(window.location.search);
    if(query.get('invalidContainerName')) {
        $('#table').children().filter((index, elem) => {
            return elem.children[1].innerText == query.get('invalidContainerName')
        }).addClass('table-danger');
        query.delete('invalidContainerName');
        history.replaceState(null, null, location.pathname);
    }
        $('.edit').click(function () {
            $(this).attr('hidden', 'true')
            $(this).parent().attr('contenteditable', 'true');
            $(this).parent().focus();
            $(this).parent().focusout(() => {
                $(this).parent().removeAttr('contenteditable');
                $(this).parent().children(".edit").removeAttr('hidden');
            })

            $(this).parent().keypress(function (e) {
                if (e.which == 13) {
                    $(this).children(".edit").attr('hidden', 'false')
                    $(this).removeAttr('contenteditable');
                    $.ajax({
                        url:"https://" + $('#address').val() + ":" + $('#port').val() + "/api/containers/" + $(this).parent().children()[0].innerHTML + "/rename?name=" + $(this).parent().children()[1].innerText,
                        type: 'POST',
                        success: () => {
                            location.reload();
                        },
                        error: () => {
                            location.href = '/machines/' + $('#id').val() + '?invalidContainerName=' + $(this).parent().children()[1].innerText
                        }
                    })
                }
            })
        })
        getVolumesFromHost(volBindFullfill)
        .then(() => {
            volumeButtonsActions();
        }).catch((err) => {
            $('#table').empty();
            $('#table, #volume-table').append('<tr><td colspan="5" class="text-center">Machine is not active</td></tr>');
            $.ajax({
                url: '/api/machines/' + $('#id').val(),
                type: 'PUT',
                data: {
                    is_active: false
                }
            })
        }).finally(() => {
            $('.overlay').remove();
        })
    })
}).catch((err) => {
    $('#table').empty();
    $('#volume-table').empty();
    $('#table').append('<tr><td colspan="5" class="text-center">Machine is not active</td></tr>');
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
