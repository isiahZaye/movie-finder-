import React, { Component } from 'react';

class Movie extends Component {
  /*
  constructor(props) {
    super(props)
    this.state = { message: 0 }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.set
    alert('clicked it')
  }
  */
  render() {
    let movie = this.props.data
    return (
      <div className='movie'>
        <img src={movie.Poster} alt='' onClick={() => this.props.getMovieInfo(movie.imdbID)}/>
      </div>
    )
  }
}

export default Movie;
