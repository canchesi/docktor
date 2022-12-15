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
                data.push(data.splice(data.indexOf(data.find(elem => elem.is_private)), 1)[0]);
                for (let i = 0; i < data.length; i++) {
                    var len = 0;
                    if (!data[i].is_private) {
                        len = Object.values(data[i].machines).length;
                        if (len == 0)
                            len = [3, 8];
                        else if (len < 4)
                            len = [6, 4];
                        else 
                            len = [12, 2];
                    }
                    toPrint.push('');
                    data[i].machines = data[i].machines.sort((a, b) => a.is_active == b.is_active ? a.custom_name.localeCompare(b.custom_name) : b.is_active - a.is_active);
                    toPrint[i] +=
                        '<div class="card card-primary col-' + (len ? len[0] : 12) + ' mr-3 mt-3 pr-3 verdana" style="border-left: 5px solid var(' + (data[i].is_private ? "--dark" : "--color-secondary") + '); width: auto;"> \
                            <div class="content-header ml-2"> \
                                <h3 class="">' + (data[i].is_private ? 'Macchine dell\'utente' : data[i].name) + '</h3> \
                            </div> \
                            <div class="content ml-3"> \
                                <div class="row" style="">'
                    if (data[i].machines.length == 0 || data[i].machines.map(elem => elem.id).every(elem => Object.values(printed).includes(elem)))
                        toPrint[i] += '<div class="col-12 mb-2"><h4>Nessuna macchina</h4></div>'
                    else
                        for (machine of data[i].machines) {
                            if(i == data.length - 1 && Object.values(printed).includes(machine.id))
                                continue;
                            toPrint[i] +=
                                    '<div class="col-' + (len ? len[1] : 2) + '"> \
                                        <div class=" btn info-box machine-btn" id="' + machineCounter + '" style="border-left: 4px solid var(--' + (machine.is_active ? "success" : "danger") + ')"> \
                                            <span class="info-box-icon bg-' + (machine.is_active ? `success` : `danger`) + '"><i class="fas fa-server"></i></span> \
                                            <div class="info-box-content"> \
                                                <span class="info-box-number"> ' + machine.custom_name + ' </span> \
                                                <span class="info-box-text courier">' + ( machine.address + ':' + machine.port) + '</span> \
                                            </div> \
                                        </div> \
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
})