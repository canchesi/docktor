const checkPort = (port) => {
    return Boolean(port.match(/^[0-9]{1,5}$/)) && port > 0 && port < 65536;
}

const checkIPv4 = (ip) => {
    return Boolean(ip.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/));
}

const checkURL = (url) => {
    return Boolean(url.match(/[a-zA-Z0-9@:%._\+~#=]{1,256}/));
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
    }
    return Boolean(ip.match(/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/));       
}

const checkCustomName = (name) => {
    return Boolean(name.match(/^[a-zA-Z0-9_]{1,64}$/));
}

var printed = {};

(() => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/machines/user?divided=1',
            type: 'GET',
            success: function (data) {
                var toPrint = [];
                var machineCounter = 0;
                data.sort((a, b) => a.machines.length == b.machines.length ? a.name.localeCompare(b.name) : b.machines.length - a.machines.length);
                data.push(data.splice(data.indexOf(data.find(elem => elem.is_default)), 1)[0]);
                for (let i = 0; i < data.length; i++) {
                    var len = 0;
                    if (!data[i].is_default) {
                        len = Object.values(data[i].machines).length;
                        if (!len)
                            len = [3, 8];
                        else
                            len = [12, 3];
                    }
                    toPrint.push('');
                    data[i].machines = data[i].machines.sort((a, b) => a.is_active == b.is_active ? a.custom_name.localeCompare(b.custom_name) : b.is_active - a.is_active);
                    toPrint[i] +=
                        '<div class="card card-primary col-' + (len ? len[0] : 12) + ' m-3 pr-3 verdana" style="border-left: 5px solid var(' + (data[i].is_default ? "--dark" : "--color-secondary") + '); width: auto;" id="' + data[i].id + '"> \
                            <div class="content-header ml-2"> \
                                <h3 class="float-left">' + (data[i].is_default ? 'Macchine dell\'utente' : data[i].name) + '</h3> \
                                <button class="btn bg-' + (data[i].is_default ? "olive" : "info") + ' float-right ' + (data[i].is_default ? "" : "add-button") + '" id="add-machine' + (data[i].is_default ? "" : ("-" + data[i].id)) + '">' + (data[i].is_default ? "Nuova" : "Aggiungi") + ' macchina</button> \
                            </div> \
                            <div class="content ml-3"> \
                                <div class="row" style="">'
                    if (data[i].machines.length == 0 )
                        toPrint[i] += '<div class="col-12 mb-2"><h4>Nessuna macchina</h4></div>'
                    else
                        for (machine of data[i].machines) {
                            toPrint[i] +=
                                    '<div class="col-' + (len ? len[1] : 3) + '"> \
                                        <div class="info-box" style="border-left: 4px solid var(--' + (machine.is_active ? "success" : "danger") + ')"> \
                                            <span class=" btn info-box-icon bg-' + (machine.is_active ? `success` : `danger`) + ' machine-btn" id="' + machineCounter + '"><i class="fas fa-server"></i></span> \
                                            <div class="info-box-content"> \
                                                <span class="info-box-number"> ' + machine.custom_name + ' </span> \
                                                <span class="info-box-text courier">' + ( machine.address + ':' + machine.port) + '</span> \
                                            </div>' + (data[i].is_default ? ' \
                                            <span class="btn bg-danger machine-delete-button"> \
                                                <i class="fa-solid fa-trash" style="vertical-align: middle"></i> \
                                            </span>' : 
                                            '<span class="btn bg-secondary machine-delete-from-group-button"> \
                                                <i class="fa-solid fa-xmark" style="vertical-align: middle"></i> \
                                            </span>') +
                                        '</div> \
                                    </div>'
                            printed[machineCounter++] = machine.id;
                        }

                        toPrint[i] +=
                                '</div> \
                            </div> \
                        </div>'
                }
                toPrint.unshift(toPrint.splice(toPrint.length - 1, 1));
                $('#machines').html(toPrint.join(''));
                resolve();
            }    
        })
    })
})().then(() => {
    $('.machine-btn').click((e) => {
        window.location.href = '/machines/' + printed[e.delegateTarget.id];
    })

    $('#add-machine').click(() => {
        $('#machine-add-modal').modal('show');
        $('#cancel-button-machine-add-modal').click(() => {
            $('#machine-add-modal').modal('hide');
        })
        $('#active').click(() => {
            $('#active').toggleClass('btn-success');
            $('#active').toggleClass('btn-danger');
            $('#active').val($('#active').val() == 'true' ? 'false' : 'true');
        })

        $('#confirm-button-machine-add-modal').click(() => {
            $(document).find('.is-invalid').removeClass('is-invalid');
            $('#machine-add-error').html();

            if (!checkCustomName($('#machine-name').val())) 
                $('#machine-name').addClass('is-invalid');
            else if (!checkIPv4($('#machine-address').val()) && !checkIPv6($('#machine-address').val()) && !checkURL($('#machine-address').val()))
                $('#machine-address').addClass('is-invalid');
            else if (!checkPort($('#machine-port').val()))
                $('#machine-port').addClass('is-invalid');
            else {
                $.ajax({
                    url: '/api/machines/create',
                    type: 'POST',
                    data: JSON.stringify({
                        custom_name: $('#machine-name').val(),
                        address: $('#machine-address').val(),
                        port: Number($('#machine-port').val()),
                        is_active: $('#active').val() == 'true',
                    }),
                    contentType: 'application/json',
                    success: () => {
                        location.reload()
                    },
                    error: (err) => {
                        if(err.responseText == "Macchina già presente")
                            $('#machine-address').addClass('is-invalid');
                        else
                            $('#machine-add-error').html('<i class="fas fa-exclamation-triangle title="' + err.responseText + '"></i>');
                    }
                })
            }
        })
    })

    $('.add-button').click((e) => {
        $('#machine-group-name').empty();
        $('#machine-group-add-modal').modal('show');
        $('#cancel-button-machine-group-add-modal').click(() => {
            $('#machine-group-add-modal').modal('hide');
        })

        const groupId = e.target.id.split('-')[2];
        $.ajax({
            url: '/api/machines/user?divided=1',
            type: 'GET',
            success: (data) => {
                thisGroup = data.find(elem => elem.id == groupId);
                data.splice(data.indexOf(thisGroup), 1);
                for(group of data) 
                    for (machine of group.machines) {
                        if (!thisGroup.machines.map(elem => elem.id).includes(machine.id)) {
                            $('#machine-group-name').append(
                                '<option value="' + machine.id + '">' + machine.custom_name + " - " + machine.address + ":" + machine.port + '</option>'
                            )
                            thisGroup.machines.push(machine);
                        }
                    }
            }
        }).then(() => {
            $('#confirm-button-machine-group-add-modal').click(() => {
                const id = $('#machine-group-name').val();

                $.ajax({
                    url: '/api/machines/' + id + '/add',
                    type: 'POST',
                    data: {
                        gid: groupId
                    },
                    success: () => {
                        location.reload();
                    }
                })

            })
        })
    })

    $('.machine-delete-from-group-button').click((e) => {
        const id = printed[e.delegateTarget.parentElement.children[0].id];
        $.ajax({
            url: '/api/machines/' + id + '/remove',
            type: 'DELETE',
            data: {
                gid: e.delegateTarget.closest('.card').id
            },
            success: () => {
                location.reload();
            }
        })
    })

    $('.machine-delete-button').click((e) => {
        $.ajax({
            url: '/api/machines/' + printed[e.delegateTarget.parentElement.children[0].id],
            type: 'DELETE',
            success: () => {
                location.reload();
            }
        })
    })

})