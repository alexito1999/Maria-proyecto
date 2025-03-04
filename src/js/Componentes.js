
export function inicializarPopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
}
export function mostrarPopover(element, message) {
    const defaultContent = `<i class="bi bi-exclamation-square-fill" ></i> ${message}`;
    $(element).popover({
        html: true,
        content: defaultContent,
        placement: "bottom",
        trigger: "focus"
    });
    $(element).popover('show');
    /*     setTimeout(function () {
            $(element).popover('hide');
        }, 2000); */
    $(element).on('hidden.bs.popover', function () {
        $(this).popover('dispose');
    });
}