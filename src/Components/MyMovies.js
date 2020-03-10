import React, { Component } from 'react';
import Movie from './Movie'
import Quiz from './Quiz'

class MyMovies extends Component {
  componentDidMount() {
    let { watched } = this.props.data
    watched && this.props.newQuote()
  }
  render() {
    let { watched, quote } = this.props.data
    return (
      <div className='movie-list'>
        {watched.length > 0 ? <Quiz data={watched} /> : ''}
        {watched ? watched.map((m, i) => <Movie key={i} data={m} getMovieInfo={this.props.getMovieInfo}/>) : ''}
        {watched.length === 0 ? <div className='quote'>{quote ? <div><span className='marks'>"</span>{quote[0].quote}<span className='marks'>"</span></div> : ''}</div> : ''}
      </div>
    )
  }
}

export default MyMovies;
