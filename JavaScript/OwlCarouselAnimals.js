$(function() {
    var owl = $(".owl-carousel");
    owl.owlCarousel({
        items: 3,
        margin: 20,
        loop: true,
        center: true,
        nav: true,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                center: false
            },
            600: {
                items: 2,
                center: false
            },
            1000: {
                items: 3,
                center: true
            }
        }
    });
    $('.owl-prev').html('<i class="fas fa-chevron-left"></i>');
    $('.owl-next').html('<i class="fas fa-chevron-right"></i>');
});