import React, { Component } from 'react';
import Movie from './Movie'

class Maybe extends Component {
  componentDidMount() {
    let { maybe } = this.props.data
    maybe && this.props.newQuote()
  }
  render() {
    let { maybe, quote } = this.props.data

    return (
      <div className='movie-list'>
        {maybe ? maybe.map((m, i) => <Movie key={i} data={m} getMovieInfo={this.props.getMovieInfo}/>) : ''}
        {maybe.length === 0 ? <div className='quote'>{quote ? <div><span className='marks'>"</span>{quote[0].quote}<span className='marks'>"</span></div> : ''}</div> : ''}
      </div>
    )
  }
}

export default Maybe;
