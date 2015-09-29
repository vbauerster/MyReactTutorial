import React from 'react';
import marked from 'marked';
import $ from 'jquery';

//var data = [
  //{author: "Pete Hunt", text: "This is one comment"},
  //{author: "Jordan Walke", text: "This is *another* comment!"}
//];

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({ data: data });
      }.bind(this),
      //error: function(xhr, status, err) {
        //console.error(this.props.url, status, err.toString());
      //}.bind(this)
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  },
  getInitialState: function() {
    return { data: [] };
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map((comment, i) => (
      <Comment key={i} author={comment.author}>{comment.text}</Comment>
    ));
    return (
      <div className="commentList">{commentNodes}</div>
    );
  }
});

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">{this.props.author}</h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});


var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm">Hello world! I am a CommentForm</div>
    );
  }
});

React.render(
  <CommentBox url="/api/comments" pollInterval={3000} />,
  document.getElementById('app')
);
