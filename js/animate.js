(function() {
    var animateObj = {};

    var translate = 100;
    var width = 50;
    var duration = 1000;

    function findBlock(el) {
        return $(el).parent().find('.block');
    }

    function findInput(el) {
        return $(el).parent().find('input')[0];
    }

    function findOutput(el){
        return $(el).parent().find('.output');
    }

    function animate(el, options) {
        var deferred = Q.defer();
        $(el).animate(options, {
            queue: false,
            duration: duration,
            complete: function() {
                deferred.resolve(el);
            }
        });

        return deferred.promise;
    }

    function fetch(url){
        return Promise.resolve($.getJSON(url));
    }

    function fetchUser(user){
        return fetch('https://api.github.com/users/'+user)
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

    function animateUpRight(el){
        return Q.all([animateUp(el), animateRight(el)])
            .then(function(){
                return el;
            });
    }

    function animateWideHalf(el){
        return Q.all([animateWide(el), opacityHalf(el)])
            .then(function(){
                return el;
            });
    }

    function leftFull(el){
        return Q.all([animateThin(el), opacityFull(el), animateLeft(el)]).then(function(){
            return el;
        });
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

        var fetchAndRender = function() {
            var button = this;
            var input = findInput(this);
            return fetchUser(input.value)
                .then(function(json) {
                    findOutput(button)[0].innerHTML = JSON.stringify(json, undefined, 2);//json.avatar_url;
                });

        };

        function renderImage(el, json){
            $(el).html('<img src="'+json.avatar_url+'">');
            return el;
        }
        $('#example5').click(fetchAndRender);
        $('#input5').keypress(function(e) {
            if(e.which == 13) {
                fetchAndRender.call(this);
            }
        });

        var run6 = function() {
            var block = findBlock(this);
            var input = findInput(this);
            return animateDown(block)
                .then(animateUpRight)
                .then(function(el) {
                    return fetchUser(input.value)
                        .then(function(json) {
                            return renderImage(el, json);
                        });
                })
                .then(animateWideHalf)
                .then(leftFull)
                .fail(function(err) {
                    console.log(err.stack);
                });

        };

        var run7 = function() {
            var block = findBlock(this);
            var input = findInput(this);
            return animateDown(block)
                .then(animateUpRight)
                .then(function(el) {
                    return fetchUser(input.value)
                        .then(function(json) {
                            return renderImage(el, json);
                        }, function(error){
                            $(el).html('x');
                            return el;
                        })
                })
                .then(animateWideHalf)
                .then(leftFull)
                .fail(function(err) {
                    console.log(err.stack);
                });

        };
        $('#example6,#example8').click(run6);
        $('#input6').keypress(function(e) {
            if(e.which == 13) {
                run6.call(this);
            }
        });
        $('#example7').click(run7);
        $('#input7').keypress(function(e) {
            if(e.which == 13) {
                run7.call(this);
            }
        });
    })

})();