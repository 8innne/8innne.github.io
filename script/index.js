// 배너 슬라이드
var swiper = new Swiper('.slide ', {
    speed: 1000,//버튼 눌렀을 때 슬라이드가 넘어가는 시간
    autoplay: {
        delay: 2500,//자동으로 넘어가기 전 머무르는 시간
        disableOnInteraction: false,
    },
    loop: true,//슬라이드 무한반복
    navigation: {//화살표 버튼
        nextEl: '.slide .swiper-button-next',
        prevEl: '.slide .swiper-button-prev',
    },
    pagination: {//블릿 버튼
        el: '.slide .swiper-pagination',
        clickable: true,
    },
});

//베스트아이템 갤러리
var swiper = new Swiper('.gallery .gallery_inner ', {
    slidesPerView: 4,//보여지는 갤러리 수
    spaceBetween: 60,//갤러리 사이 간격
    speed: 1500,//버튼을 슬라이드가 넘어가는 시간
    autoplay: {
        delay: 2500,//자동으로 넘어가기 전 머무르는 시간
        disableOnInteraction: false,
    },
    loop: true,//슬라이드 무한반복
    navigation: {//화살표 버튼
        nextEl: '.gallery .swiper-button-next',
        prevEl: '.gallery .swiper-button-prev',
    },
    pagination: {//블릿 버튼
        el: '.gallery .swiper-pagination',
        clickable: true,
    },
});

// thgt now 흘러가는 슬라이드
$(function () {
    // 기본


    // 기본 반대
    $("#scroller2").simplyScroll({
        speed: 1,
        direction:'backwards',
    });
});

// 탑버튼 
$(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 500) {
        $('.top_btn').fadeIn();
    } else {
        $('.top_btn').fadeOut();
    }
});

AOS.init({
    duration:1200
});

$(function () {
    //숨긴 메뉴 보이기 
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var navbarHeight = $('header').outerHeight();

    $(window).scroll(function (event) {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
    }, 250);

    function hasScrolled() {
        var st = $(this).scrollTop();

        // Make sure they scroll more than delta 
        if (Math.abs(lastScrollTop - st) <= delta) return;

        // If they scrolled down and are past the navbar, add class .nav-up. 
        // This is necessary so you never see what is "behind" the navbar. 
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down 
            $('header').addClass('nav-up');
        } else {
            // Scroll Up 
            if (st + $(window).height() < $(document).height()) {
                $('header').removeClass('nav-up');
            }
        }

        lastScrollTop = st;
    }
});

$(function () {
            var polyline = document.querySelector('.drawing_line_polyline');
            var polyPoints = polyline.getAttribute('points');
            var circle = document.querySelector('.drawing_line_circle');
            var circleX = circle.getAttribute('cx');
            var circleY = circle.getAttribute('cy');
            var circleR = circle.getAttribute('r');

            var total = 12;
            var gap = 30;
            var ease = 0.5;
            var debounce_removeLine;
            var debounce_counter = 0;

            var pointer = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                tx: 0,
                ty: 0,
                dist: 0,
                scale: 1,
                speed: 2,
                circRadius: 8,
                updateCrds: function () {
                    if (this.x != 0) {
                        this.dist = Math.abs((this.x - this.tx) + (this.y - this.ty));
                        this.scale = Math.max(this.scale + ((100 - this.dist * 8) * 0.01 - this.scale) * 0.1, 0.25); // gt 0.25 = 4px
                        this.tx += (this.x - this.tx) / this.speed;
                        this.ty += (this.y - this.ty) / this.speed;
                    }
                }
            };

            var points = [];

            $(window).on('mousemove', function (e) {
                pointer.x = e.clientX;
                pointer.y = e.clientY;
                debounce_counter = 0;
                drawLine();

                // debounce
                clearTimeout(debounce_removeLine);
                debounce_removeLine = setTimeout(() => {
                    //console.log('debounce_removeLine', new Date().getTime());
                    debounce_counter = 12;
                    drawLine();
                }, 80);
            })

            $(window).on('mousedown', function (e) {
                pointer.circRadius = 6;
                drawLine();
            });

            $(window).on('mouseup', function (e) {
                pointer.circRadius = 8;
                drawLine();
            });

            function drawLine() {
                pointer.updateCrds();

                points.push({
                    x: pointer.tx,
                    y: pointer.ty
                });
                while (points.length > total) {
                    points.shift();
                    if (points.length > gap) {
                        for (var i = 0; i < 5; i++) {
                            points.shift();
                        }
                    }
                }
                var pointsArr = points.map(point => `${point.x},${point.y}`);
                polyPoints = pointsArr.join(' ');
                polyline.setAttribute('points', polyPoints);

                // circle
                circleX = pointer.x;
                circleY = pointer.y;
                circleR = pointer.scale * pointer.circRadius;

                circle.setAttribute('cx', circleX);
                circle.setAttribute('cy', circleY);
                circle.setAttribute('r', circleR);

                if (debounce_counter > 0) {
                    debounce_counter--;
                    requestAnimationFrame(drawLine);
                }
            };
        });