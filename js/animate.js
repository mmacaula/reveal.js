(function() {

    var animateObj = {};

    var translate = 100;
    var width = 50;
    var duration = 1000;

    function findBlock(el) {
        return $(el).parent().find('.block');
    }

    function animate(el, options) {
        var deferred = Q.defer();
        $(el).animate(options, {
            queue: false,
            duration: duration,
            complete: function() {
                deferred.resolve();
            }
        });

        return deferred.promise;
    }

    function animateRight(el) {
        return animate(el, {left: '+=' + translate + 'px'});
    }

    function animateLeft(el) {
        return animate(el, {left: '-=' + translate + 'px'})
    }

    function animateDown(el) {
        return animate(el, {top: '+=' + translate + 'px'});
    }

    function animateUp(el) {
        return animate(el, {top: '-=' + translate + 'px'});
    }

    function animateWide(el){
        return animate(el, {width: '+='+ width + 'px'});
    }
    function animateThin(el){
        return animate(el, {width: '-='+ width + 'px'});
    }
    function opacityHalf(el){
        return animate(el, {opacity : 0.5});
    }

    function opacityFull(el){
        return animate(el, {opacity : 1});
    }

    animateObj.animate = animate;
    animateObj.animateUp = animateUp;
    animateObj.animateDown = animateDown;
    animateObj.animateLeft = animateLeft;
    animateObj.animateRight = animateRight;
    animateObj.animateWide = animateWide;


    $(function() {

        window.animate = animateObj;

        $('#example-done').click(function() {
            var block = findBlock(this);

            animateDown(block)
                .then(function() {
                    return Q.all([
                        animateUp(block),
                        animateRight(block)

                    ]);
                }).then(function(){
                    return Q.all([
                        animateWide(block),
                        opacityHalf(block)
                    ])
                }).then(function(){
                    return Q.all([
                        animateThin(block),
                        opacityFull(block),
                        animateLeft(block)
                    ])
                });
        });

        $('#example1').click(function(){
           var element = findBlock(this);
            $(element).animate({
                top : '+=50px'
            }, 1000, function() {
                $(element).animate({
                    top: '-=50px'
                }, 1000);
            });
        });
        $('#example2').click(function(){
            var element = findBlock(this);
            $(element).animate({
                top : '+=50px'
            }, 1000, function() {
                $(element).animate({
                    top: '-=50px',
                    left : '+=50px'
                }, 1000, function(){
                    $(element).animate({
                        width : '+=50px',
                        opacity : 0.5
                    }, 1000, function(){
                        $(element).animate({
                            opacity : 1.0,
                            left : '-50px',
                            width : '-=50px'
                        }, 1000)
                    })
                });
            });
        });
        $('#example3').click(function(){
            var element = findBlock(this);
            var leftFull = function() {
                $(element).animate({
                    opacity: 1.0,
                    left: '-50px',
                    width: '-=50px'
                }, 1000)
            };
            var wideSeeThrough = function(cb) {
                $(element).animate({
                    width: '+=50px',
                    opacity: 0.5
                }, 1000, cb)
            };
            var upRight = function(cb) {
                $(element).animate({
                    top: '-=50px',
                    left: '+=50px'
                }, 1000, cb);
            };

            $(element).animate({
                top : '+=50px'
            }, 1000, upRight(wideSeeThrough(leftFull)));
        });
        $('#example4').click(function(){
            var element = findBlock(this);
            var leftFull = function() {
                $(element).animate({
                    opacity: 1.0,
                    left: '-50px',
                    width: '-=50px'
                }, 1000)
            };
            var wideSeeThrough = function(cb) {
                $(element).animate({
                    width: '+=50px',
                    opacity: 0.5
                }, 1000, cb)
            };
            var upRight = function(cb) {
                $(element).animate({
                    top: '-=50px',
                    left: '+=50px'
                }, 1000, cb);
            };

            $(element).animate({
                top : '+=50px'
            }, 1000, _.partial(upRight, _.partial(wideSeeThrough,leftFull)));
        });
    })

})();