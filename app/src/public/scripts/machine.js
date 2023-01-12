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
    'running': '<button class="btn btn-secondary btn-container mr-1" value="pause"><i class="fa-solid fa-pause"></i></button><button class="btn bg-gray-dark btn-container" value="stop"><i class="fa-solid fa-stop"></i></button>',
    'exited': '<button class="btn bg-olive btn-container mr-1" value="start"><i class="fa-solid fa-play"></i></button><button class="btn bg-danger btn-delete container-delete"><i class="fa-solid fa-trash"></i></button>',
    'paused': '<button class="btn bg-olive btn-container mr-1" value="unpause"><i class="fa-solid fa-play"></i></button><button class="btn bg-gray-dark btn-container" value="stop"><i class="fa-solid fa-stop"></i></button>',
    'created': '<button class="btn bg-olive btn-container mr-1" value="start"><i class="fa-solid fa-play"></i></button><button class="btn bg-danger btn-delete container-delete"><i class="fa-solid fa-trash"></i></button>'
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
            url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/json?all=1',
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
            url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/volumes',
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
            throw new Error('Invalid syntax');
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
                if (volume.indexOf(':') != -1)
                    volumes.binds.push(volume);
                else
                    volumes.volumes[volume] = {};
            }
        } else
            throw new Error('Invalid syntax');
    }
    return volumes;
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
    if ($('#table-containers').height() > $('#div-table').height())
        $('#div-table').attr('style', 'padding:0; overflow-y: auto; display: block;')
    else if (!$('#table').children().length){
        $('#table-containers').parent().attr('style', 'padding: 0;position: relative').append('<i class="fa-solid fa-check" id="check" title="Non ci sono containers"></i>')
    }
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
            return a.container.localeCompare(b.container) ? a.container.localeCompare(b.container) : a.Name.localeCompare(b.Name)}))
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
            url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/' + id + '/' + $(this).val(),
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
                url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/' + id + '/json',
                type: 'GET',
                success: (data) => {
                    volumes = JSON.parse(data).Mounts
                    deleted = volumes.length;
                }
            }).then(() => {
                $.ajax({
                    url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/' + id,
                    type: 'DELETE'
                }).then(() => {
                for (volume of volumes)
                    $.ajax({
                        url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/volumes/' + volume.Name + '?force=1',
                        type: 'DELETE',
                        success:() => {
                            if(!--deleted)
                                location.reload()
                        }
                    })
                })
            })
        })
    })
}

const volumeButtonsActions = () => {
    $('.volume-delete').click(function () {
        const id = $(this).parent().parent().children()[1].innerHTML;
        $.ajax({
            url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/volumes/' + id + '?force=1',
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
    })
    $('#networking').click(() => {
        $('#networking').toggleClass('btn-success');
        $('#networking').toggleClass('btn-danger');
        $('#networking').val($('#netiworking').val() == 'true' ? 'false' : 'true');
    })
    $('#confirm-button-container-create-modal').click(() => {
        const ports = getPorts();
        const volumes = getVolumes();
        const data = {
            Image: $('#immagine').val(),
            ExposedPorts: ports.exposed,
            Cmd: $('#comandi').val() ? $('#comandi').val().split('; ') : [],
            Volumes: volumes.volumes,
            HostConfig: {
                Binds: volumes.binds,
                PortBindings: ports.published,
                RestartPolicy: {
                    Name: $('#restart').val()
                }
            }
        }
        if ($('#avanzate').val() == 'true') {
            data.HostConfig.RestartPolicy = {
                Name: $('#restart').val()
            }
            try {
                data.HostConfig.CpusetCpus = "0" + (Number($('#cpu').val()) - 1 != '0' ? ('-' + (Math.abs(Number($('#cpu').val()) - 1))) : "");
            } catch (e) {
                data.HostConfig.CpusetCpus = "0";
            }
            data.HostConfig.Memory = Number($('#ram').val() * 1024 * 1024);
            data.HostConfig.AutoRemove = $('#autoremove').val() == 'true';
            data.NetworkDisabled = $('#networking').val() == 'false';
        }
        $.ajax({
            url: 'http://' + $('#address').val() + ':' + $('#port').val() + '/api/containers/create?name=' + $('#nome').val(),
            type: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            success: () => {
                console.log(data);
                //location.reload();
            },
            error: (e) => {
                console.log(data);
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
                        url:"http://" + $('#address').val() + ":" + $('#port').val() + "/api/containers/" + $(this).parent().children()[0].innerHTML + "/rename?name=" + $(this).parent().children()[1].innerText,
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
