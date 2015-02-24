/** @jsx React.DOM */

var PLList = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        $.ajax({
            url: 'playlists',
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
                    <li>
                    <a href={ "v.htm?pl=" + pl }>{pl}</a>
                    </li>);
                   });
        return (
                <ul className="nav nav-pills">
                {plNodes}
            </ul>
        );
    }
});

React.render(
        <PLList/>,
    document.getElementById('content')
);
