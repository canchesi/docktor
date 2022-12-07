const getContainers = ({ address, port, id }) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://' + address + ':' + port + '/api/containers/json?all=1',
            type: 'GET',
            success: (data) => {
                resolve(data);
            },
            error: (err) => {
                reject(id);
            }
        });
    });
}
(() => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/api/machines',
            type: 'GET',
            success: (data) => {
                let knownActiveMachines = 0;
                let activeMachines = 0;
                let activeContainers = 0;
                for (elem of data)
                    if (elem.is_active)
                        knownActiveMachines++;
                for (elem of data) {
                    if (elem.is_active) {
                        getContainers({
                            address: elem.address,
                            port: elem.port,
                            id: elem.id
                        }).then((data) => {
                            ++activeMachines
                            let actualContainers = parseInt($('#total-containers').html())
                            for (elem of JSON.parse(data))
                                if(elem.State == 'running')
                                    ++activeContainers;
                            $('#active-containers').html(activeContainers);
                            $('#total-containers').html(actualContainers + JSON.parse(data).length)
                            $('#active-machines').html(activeMachines)
                            if(activeMachines == knownActiveMachines)
                                resolve();
                        }).catch((id) => {
                            $('#machines-info').addClass('bg-warning')
                            if($('#active-machines').html().indexOf('cib-highly') == -1)
                                $('#active-machines').append('<i class="cib-highly" title="Una o più macchine sono irraggiungibili. Controllare gli indirizzi o le macchine."></i>')
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
                $('#active-machines').html(activeMachines);
                $('#total-machines').html(data.length);
            }
        })
    })
})().then(() => {
    $('.overlay').remove();
})