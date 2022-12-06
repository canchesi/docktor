const getContainers = (address, port, id) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://' + address + ':' + port + '/api/containers/json',
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

$.ajax({
    url: '/api/machines',
    type: 'GET',
    success: (data) => {
        let activeMachines = 0;
        let containers = 0;
        for (elem of data) {
            if (elem.is_active){
                activeMachines++;
                getContainers(elem.address, elem.port, elem.id).then((data) => {
                    containers += JSON.parse(data).length;
                    $('#containers-info').find('.info-box-number').html(containers);
                }).catch((id) => {
                    $('#machines-info').addClass('bg-warning')
                    $('#active-machines').html(--activeMachines).append('<i class="cib-highly" title="Una o più macchine sono irraggiungibili. Controllare gli indirizzi o le macchine."></i>')
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
                })
            }
        }
        $('#active-machines').html(activeMachines);
        $('#total-machines').html(data.length);
    }
})
