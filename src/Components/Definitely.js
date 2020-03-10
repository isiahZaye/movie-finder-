import React, { Component } from 'react';
import Movie from './Movie'

class Definitely extends Component {
  componentDidMount() {
    let { definitely } = this.props.data
    definitely && this.props.newQuote()
  }
  render() {
    let { definitely, quote } = this.props.data
    return (
      <div className='movie-list'>
        {definitely ? definitely.map((m, i) => <Movie key={i} data={m} getMovieInfo={this.props.getMovieInfo}/>) : ''}
        {definitely.length === 0 ? <div className='quote'>{quote ? <div><span className='marks'>"</span>{quote[0].quote}<span className='marks'>"</span></div> : ''}</div> : ''}
      </div>
    )
  }
}

export default Definitely;
