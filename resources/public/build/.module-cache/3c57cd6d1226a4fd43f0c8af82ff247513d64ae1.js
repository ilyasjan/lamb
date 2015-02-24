/** @jsx React.DOM */

var PLList = React.createClass({displayName: "PLList",
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        $.ajax({
            url: 'playlists-demo',
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
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
                    React.createElement("a", {href:  "v.htm?pl=" + pl}, pl)
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
