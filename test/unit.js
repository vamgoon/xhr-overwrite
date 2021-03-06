require('should');

var overwriteXhr,
    methods = {
        open: function () {
            return this.xhr.open();
        },
        send: function () {
            return this.xhr.send();
        }
    };

before(function () {
    /* mock global environment */
    window = {};
    window.XMLHttpRequest = function () {
        this.DONE = 4;
        this.timeout = 0;
        this.abort = function () {
            return 'XMLHttpRequest.abort';
        };
        this.open = function () {
            return 'XMLHttpRequest.open';
        };
        this.send = function () {
            return 'XMLHttpRequest.send';
        };
        this.readyState = 0;
        this.onreadystatechange = null;
        this.mockReadStateChange = function (state) {
            this.readyState = state;
            if (this.onreadystatechange) {
                this.onreadystatechange();
            }
        };
    };
    /* overwrite */
    require('../index')(methods);
    overwriteXhr = new window.XMLHttpRequest();
});

it('should copy method', function () {
    overwriteXhr.open.should.equal(methods.open);
});

it('should proxy method', function () {
    overwriteXhr.abort().should.equal('XMLHttpRequest.abort');
    overwriteXhr.open().should.equal('XMLHttpRequest.open');
    overwriteXhr.send().should.equal('XMLHttpRequest.send');
});

it('should update config field when invoke send', function () {
    overwriteXhr.timeout = 1000;
    overwriteXhr.send();
    overwriteXhr.xhr.timeout.should.equal(overwriteXhr.timeout);
});

it('should copy const', function () {
    overwriteXhr.DONE.should.equal(4);
});

it('should proxy callback', function (done) {
    overwriteXhr.onreadystatechange = function () {
        this.readyState.should.equal(2);
        done();
    };
    setTimeout(function () {
        overwriteXhr.xhr.mockReadStateChange(2);
    }, 500);
});