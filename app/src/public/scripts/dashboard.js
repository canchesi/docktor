const getContainers = ({ address, port, id, machine }) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://' + address + ':' + port + '/api/containers/json?all=1',
            type: 'GET',
            success: (data) => {
                data = JSON.parse(data);
                data.forEach((elem) => {
                    elem.machine = machine;
                });
                resolve(data);
            },
            error: (err) => {
                reject(id);
            }
        });
    });
}

const getVolumes = ({ address, port, id, machine }) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://' + address + ':' + port + '/api/volumes',
            type: 'GET',
            success: (data) => {
                data = JSON.parse(data);
                data.Volumes.forEach((elem) => {
                    elem.machine = machine;
                });
                resolve(data.Volumes);
            },
            error: (err) => {
                reject(id);
            }
        });
    });
}

const dashboardCreate = (data) => {
    var activeVolumes = [0, []];
    var activeMachines = 0;
    var knownActiveMachines = 0;
    var activeContainers = 0;
    (() => {
        return new Promise((resolve, reject) => {
            for (elem of data)
                if (elem.is_active)
                    knownActiveMachines++;
            for (elem of data.sort((a, b) => {a.custom_name.localeCompare(b.custom_name)})) {
                $('#machine-table').append(`
                    <tr>
                        <td>${elem.custom_name}</td>
                        <td>${elem.address}:${elem.port}</td>
                    </tr>
                `)
                if (elem.is_active) {
                    getContainers({
                        address: elem.address,
                        port: elem.port,
                        id: elem.id,
                        machine: elem.custom_name
                    }).then((data) => {
                        data.sort((a, b) => {
                            return -(a.Status.localeCompare(b.Status));
                        })
                        ++activeMachines
                        let actualContainers = parseInt($('#total-containers').html())
                        for (cont of data) {
                            for (vol of cont.Mounts)
                                if (vol.Type == 'volume') {
                                    ++activeVolumes[0];
                                    activeVolumes[1].push(vol.Name);
                                    $('#volume-table').append(`
                                        <tr>
                                            <td>${vol.Name}</td>
                                            <td>${cont.machine}</td>
                                        </tr>
                                    `)
                                }
                            if(cont.State == 'running')
                                ++activeContainers;
                            $('#container-table').append(`
                                <tr>
                                    <td>${cont.Names[0].substring(1)}</td>
                                    <td>${cont.machine}</td>
                                    <td>${cont.State}</td>
                                </tr>
                            `)
                        }
                        $('#active-containers').html(activeContainers);
                        $('#total-containers').html(actualContainers + data.length)
                        $('#active-machines').html(activeMachines)
                        if (activeMachines == knownActiveMachines)
                            resolve();
                    }).catch((id) => {
                        $('#machines-info').addClass('bg-warning').attr('title', 'Una o pi\u00F9 macchine non sono raggiungibili. Controllare gli indirizzi IP e le porte, o in alternativa la connessione con queste.')
                        $.ajax({
                            url: '/api/machines/' + id,
                            type: 'PUT',
                            data: {
                                is_active: false
                            },
                            success: () => {
                                window.scrollTo(0, 0);
                            }
                        });
                        resolve();
                    })
                }
            }
            $('#active-machines').html(activeMachines[0]);
            $('#total-machines').html(data.length);
         })
    })().then(() => {
        for (elem of data)
            if (elem.is_active)
                getVolumes({
                    address: elem.address,
                    port: elem.port,
                    id: elem.id,
                    machine: elem.custom_name
                }).then((data) => {
                    data.sort((a, b) => {
                        return a.Name.localeCompare(b.Name);
                    })
                    let actualVolumes = parseInt($('#total-volumes').html())
                    for (vol of data) {
                        if(!activeVolumes[1].includes(vol.Name))
                            $('#volume-table').append(`
                                <tr>
                                    <td>${vol.Name}</td>
                                    <td>${vol.machine}</td>
                                </tr>
                            `)
                    }
                    $('#total-volumes').html(actualVolumes + data.length)
                    $('#active-volumes').html(activeVolumes[0]);
                    if (activeMachines == knownActiveMachines)
                        $('.overlay').hide();
                })
    })
}

$.ajax({
    url: '/api/machines/user',
    type: 'GET',
    success: (data) => {
        dashboardCreate(data)
    }
})