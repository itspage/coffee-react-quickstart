global.$ = require('jquery')

var Link;

Link = require('react-router').Link;

require(['../../bower_components/Chart.js/Chart.js'], function(Chart){
    // Chart.noConflict restores the Chart global variable to it's previous owner
    // The function returns what was previously Chart, allowing you to reassign.
    var Chartjs = Chart.noConflict();

    var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: [28, 48, 40, 19, 86, 27, 39]
            }
        ]
    };
    var ctx = document.getElementById("myChart").getContext("2d");
    var myNewChart = new Chart(ctx).Line(data);
});

var HealthCheck = React.createClass({
    getInitialState: function() {
        return {status: "DOWN"};
    },
    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            crossDomain: true,
            dataType: 'json',
            success: function(data) {
                var upOrDown = "DOWN";
                if (data.ok) {
                    upOrDown = "UP";
                }
                this.setState({status: upOrDown});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <h1>Server is {this.state.status}!!</h1>
        );
    }
});

var MyChart = React.createClass({
    render: function() {
        return (
            <canvas id="myChart" width="600" height="400"></canvas>
        );
    }
});

module.exports = React.createClass({
    displayName: 'HelloWorld',
    render: function() {
        return (
            <div>
            <HealthCheck url="http://localhost:8000/api/v1/healthcheck/" />
            <MyChart />
            </div>
        )
    }
});


