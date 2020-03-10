import React, { Component } from 'react';
import Movie from './Movie'

class MovieList extends Component {

  render() {
    let data = this.props.data
    return (
      <div className='movie-list'>
        {data.hasOwnProperty('Search') ? data.Search.filter(m => m.Poster !== 'N/A').map((m, i) => <Movie key={i} data={m} getMovieInfo={this.props.getMovieInfo}/>) : <div className='title-page'>Find movies to watch. Randomly or otherwise.</div>}
      </div>
    )
  }
}

export default MovieList;
