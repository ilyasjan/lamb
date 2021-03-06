/** @jsx React.DOM */
var demoModule = {
    init: function() {
        this.els = {};
        this.cacheElements();
        this.initVideo();
        this.createListOfVideos();
        this.bindEvents();
        this.overwriteConsole();
    },
    overwriteConsole: function() {
        console._log = console.log;
        console.log = this.log;
    },
    log: function(string) {
        demoModule.els.log.append('<p>' + string + '</p>');
        console._log(string);
    },
    cacheElements: function() {
        this.els.$playlist = $('div.playlist > ul');
        this.els.$next = $('#next');
        this.els.$prev = $('#prev');
        this.els.log = $('div.panels > pre');
    },
    initVideo: function() {
        this.player = videojs('video');
        this.player.playList(videos);
    },
    createListOfVideos: function() {
        var html = '';
        for (var i = 0, len = this.player.pl.videos.length; i < len; i++) {
            html += '<li data-videoplaylist="' + i + '">' +
                //       '<span class="number">' + (i + 1) + '</span>'+
                //           '<span class="poster"><img src="'+ videos[i].poster +'"></span>' +
                '<span class="title">' + videos[i].title + '</span>' +
                '</li>';
        }
        this.els.$playlist.empty().html(html);
        this.updateActiveVideo();
    },
    updateActiveVideo: function() {
        var activeIndex = this.player.pl.current;

        this.els.$playlist.find('li').removeClass('active');
        this.els.$playlist.find('li[data-videoplaylist="' + activeIndex + '"]').addClass('active');
    },
    bindEvents: function() {
        var self = this;
        this.els.$playlist.find('li').on('click', $.proxy(this.selectVideo, this));
        this.els.$next.on('click', $.proxy(this.nextOrPrev, this));
        this.els.$prev.on('click', $.proxy(this.nextOrPrev, this));
        this.player.on('next', function(e) {
            console.log('Next video');
            self.updateActiveVideo.apply(self);
        });
        this.player.on('prev', function(e) {
            console.log('Previous video');
            self.updateActiveVideo.apply(self);
        });
        this.player.on('lastVideoEnded', function(e) {
            console.log('Last video has finished');
        });
    },
    nextOrPrev: function(e) {
        var clicked = $(e.target);
        this.player[clicked.attr('id')]();
    },
    selectVideo: function(e) {
        var clicked = e.target.nodeName === 'LI' ? $(e.target) : $(e.target).closest('li');

        if (!clicked.hasClass('active')) {
            console.log('Selecting video');
            var videoIndex = clicked.data('videoplaylist');
            this.player.playList(videoIndex);
            this.updateActiveVideo();
        }
    }
};

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}


function renderVP(p){
    jQuery.ajax({
        url: 'playlist-content?pl=' + p,
        dataType: 'json',
        type: 'GET',
        success: function(data, status, header, something) {
            var videos = data;
            demoModule.init();
        },
        error: function(xhr, status, err) {
            //console.error(status, err.toString());
        }
    });
}
var pl = getUrlParameter('pl');
if (!pl)
    pl = "";
else
    renderVP(pl);


var PLList = React.createClass({displayName: "PLList",
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        $.ajax({
            url: 'playlists',
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
                if (pl== "" && data && data.length >0)
                    renderVP(data[0]);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        var plNodes = this.state.data.map(
            function (pl) {return (
                    React.createElement("li", null, 
                    React.createElement("a", {href:  "index.htm?pl=" + pl}, pl)
                    ));
                          });
        return (
                React.createElement("ul", {className: "nav nav-pills"}, 
                plNodes
            )
        );
    }
});

React.render(
        React.createElement(PLList, null),
    document.getElementById('content')
);
