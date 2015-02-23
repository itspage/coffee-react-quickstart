global.$ = require('jquery')

var Link;

Link = require('react-router').Link;

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
    getInitialState: function() {
        return {y: [65, 59, 80, 81, 56, 55, 40], x: ["January", "February", "March", "April", "May", "June", "July"]};
    },
    componentDidMount: function() {
        var url = "http://localhost:8000/api/v1/reporting/visits/?from=2014-01-01&to=2016-01-01&tag=nearby";
        $.ajax({
            url: url,
            headers: {"Authorization": "Bearer tokentoken"},
            dataType: 'json',
            success: function(data) {
                var x = [];
                var y = [];
                var i;
                for (i in data)
                {
                    x.push(data[i].date);
                    y.push(data[i].count);
                }
                this.setState({x: x, y: y});

                // Chart.noConflict restores the Chart global variable to it's previous owner
                // The function returns what was previously Chart, allowing you to reassign.
                var Chart = require('../../bower_components/Chart.js/Chart.js');
                var Chartjs = Chart.noConflict();

                var data = {
                    labels: this.state.x,
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: this.state.y
                        }
                    ]
                };
                var ctx = document.getElementById("myChart").getContext("2d");
                this.state.chart = new Chart(ctx).Line(data);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
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
