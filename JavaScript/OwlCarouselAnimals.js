$(function () {
    // Owl Carousel
    
        var owl = $(".owl-carousel");
        owl.owlCarousel({
            items: 1,
            margin: 5,
            loop: true,
            center: true,
            nav: true,
            dots: true,
            autoplay: true,
            autoplayTimeout:3000,
        });
});
