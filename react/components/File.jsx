/* @jsx React.DOM */

var React = require('react');

var style = {
  display: 'none'
};

module.exports = React.createClass({
  handleClick: function() {
    var chooser = document.querySelector('#fileDialog');
    chooser.addEventListener("change", function(evt) {
      console.log(this.value);
    }, false);

    chooser.click();
  },

  render: function() {
    return (
      <span>
        <input style={style} type="file" id="fileDialog" multiple />
        <button type="button" onClick={this.handleClick}>{this.props.title}</button>
      </span>
    );
  }
});