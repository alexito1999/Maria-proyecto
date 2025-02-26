$(document).ready(() => init());
function init() {
    $('#tab-login').click(() => {
        $('#tab-login').addClass('active')
        $('#tab-register').removeClass('active')
        $('#pills-register ').removeClass('show')
        $('#pills-register ').removeClass('active')
        $('#pills-login ').addClass('show')
        $('#pills-login ').addClass('active')
        console.log('remove')
    })
    $('#tab-register').click(() => {
        $('#tab-login').removeClass('active')
        $('#tab-register').addClass('active')
        $('#pills-login ').removeClass('show')
        $('#pills-login ').removeClass('active')
        $('#pills-register ').addClass('show')
        $('#pills-register ').addClass('active')
    })
}