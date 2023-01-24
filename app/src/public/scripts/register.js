const checkEmail = (email) => {
    return email.toLowerCase().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/);
};

const checkPassword = (password) => {
    return password.length >= 8;
}

const checkPasswordMatch = (password, passwordConf) => {
    return password === passwordConf;
}

const checkGender = (gender) => {
    return gender === 'M' || gender === 'F';
}

const checkDate = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    return birthDate < today;
}

const checkInfo = (data) => {
    const { user, info } = data;
    const checkPassword = $('#conferma-password').val()
    
    if (!checkEmail(user.email)) {
        $('#email').removeClass('is-valid').addClass('is-invalid');
        return false;
    } else if (!checkPassword(user.passwd)) {
        $('#password').removeClass('is-valid').addClass('is-invalid');
        return false;
    } else if (!checkPasswordMatch(user.passwd, checkPassword)) {
        $('#conferma-password').removeClass('is-valid').addClass('is-invalid');
        return false;
    } else if (!checkGender(info.gender)) {
        $('#gender').removeClass('is-valid').addClass('is-invalid');
        return false;
    } else if (!checkDate(info.birth_date)) {
        $('#data').removeClass('is-valid').addClass('is-invalid');
        return false;
    }
    
    return true;
}

$('input').val('');
$('#register-button').click(() => {
    $('.is-invalid').removeClass('is-invalid'); 
    const data = {
        user: {
            email: $('#email').val(),
            passwd: $('#password').val(),
        },
        info: {
            first_name: $('#nome').val(),
            last_name: $('#cognome').val(),
            gender: $('#sesso').val(),
            birth_date: new Date($('#data-di-nascita').val())
        }
    }
    if (checkInfo(data)) {
        $.ajax({
            url: '/api/register',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: () => {
                window.location.href = '/login';
            }
        })
    } else {
        console.log(data);
    }
});