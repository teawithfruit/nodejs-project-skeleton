/* @jsx React.DOM */

var React = require('react');
var chartjs = require('react-chartjs');

var File = require('./File.jsx');

module.exports = React.createClass({
  handleDensity: function() {
    console.log('den');
  },

  render: function() {
    return (
      <div>React Skeleton</div>
    );
  }
});