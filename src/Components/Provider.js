import React, { Component } from 'react';

export const MyContext = React.createContext()

class Provider extends Component {

  constructor() {
    super()
    this.state = {
      modal: false,
      movieModal: [],
      maybe: [],
      definitely: [],
      watched: [],
      currentPage: '',
      totalPages: '',
      type: 'not-random',
      title: '',
      year: '',
      data: [],
      dataBackup: [],
      wordBank: '',
      isLoaded: false,
      quote: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.randomPageFetch = this.randomPageFetch.bind(this)
    this.getMovieInfo = this.getMovieInfo.bind(this)
    this.categorize = this.categorize.bind(this)
    this.quoteToFillTheSpace = this.quoteToFillTheSpace.bind(this)
  }

  handleChange(e) {
    let value = e.target.value
    let change = e.target.name
    if (change === 'type') {
      this.setState({ type: value })
    } else if (change === 'title') {
      this.setState({ title: value })
    } else {
      this.setState({ year: value })
    }
  }

  randomPageFetch(apiKey, specificPage, movieType, revert = true) {
    let fullUrl = 'http://www.omdbapi.com/?s=' + this.state.title + '&page=' + specificPage + movieType + '&apikey=' + apiKey
    console.log(specificPage)
    fetch(fullUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        let checkForPosters;
        if (data.hasOwnProperty('Search')) { checkForPosters = data.Search.some(m => m.Poster !== 'N/A') }
        if (checkForPosters) {
          this.setState({data: data, currentPage: specificPage})
        } else {
          if (revert) {
            console.log('reverting to backup')
            this.setState({data: this.state.dataBackup, currentPage: 1})
          }
        }
        console.log(data)
        console.log(this.state.title)
        console.log('we made it')
      })
  }

  handleSubmit(e) {
    e.preventDefault()
    let maxFetch = 10;
    let specificPage = ''
    let apiKey = '3d7eed43'
    let movieType = '&type=movie'
    let year = ''

    if (this.state.year.length === 4 && !isNaN(year)) {
      year = '&y=' + this.state.year
    }

    let fullUrl = 'http://www.omdbapi.com/?s=' + this.state.title + movieType + year + '&apikey=' + apiKey
    /* Random Movie selected. Use the random word API to fetch a word */
    if (this.state.type === 'random-movie') {
      const attemptRandomMovieSearch = () => {
        let wordBank = this.state.wordBank
        let random = Math.floor(Math.random() * wordBank.length)
        let randomWord = wordBank[random]
        this.setState({title: randomWord})
        console.log(this.state.wordBank[random])
        fullUrl = 'http://www.omdbapi.com/?s=' + randomWord + movieType + '&apikey=' + apiKey
            /* Word retrieved, look for movies with that word as their title */
            fetch(fullUrl)
              .then(response => response.json())
              .then(data => {
                let pageCount;
                let checkForPosters;
                /* If successful, an object with property Search will come back */
                if (data.hasOwnProperty('Search')) {
                  pageCount = Math.ceil(Number(data.totalResults) / 10)
                  checkForPosters = data.Search.some(m => m.Poster !== 'N/A')
                }
                specificPage = Math.floor(Math.random() * pageCount) + 1
                /* Fetch again, this time with a random page endpoint */
                if (pageCount && checkForPosters) {
                  this.setState({dataBackup: data, totalPages: pageCount })
                  this.randomPageFetch(apiKey, specificPage, movieType)
                } else {
                /* If no object with property Search, there was an error. Remove word from wordBank. Start over. */
                  maxFetch--
                  let wordBankCopy = [...wordBank]
                  wordBankCopy.splice(random, 1)
                  this.setState({ wordBank: wordBankCopy })
                  if (maxFetch) {
                    attemptRandomMovieSearch()
                  } else {
                    alert('No movies found. Better luck next time.')
                  }
                }
              })
      }
      attemptRandomMovieSearch();
    } else if (this.state.type === 'random-page') {
      console.log(this.state.type)
      fetch(fullUrl)
        .then(response => response.json())
        .then(data => {
          let pageCount;
          data.hasOwnProperty('Error') ? console.log('Error!!!') : pageCount = Math.ceil(Number(data.totalResults) / 10)
          specificPage = Math.floor(Math.random() * pageCount) + 1
          if (pageCount !== 1 && pageCount > 1) {
            this.setState({dataBackup: data, totalPages: pageCount })
            this.randomPageFetch(apiKey, specificPage, movieType)
          }
        })
    } else {
      let pageCount;
      if (this.state.title !== '') {
        fetch(fullUrl)
          .then(response => response.json())
          .then(data => {
            if (data.hasOwnProperty('Search')) {
              pageCount = Math.ceil(Number(data.totalResults) / 10)
            }
            specificPage = Math.floor(Math.random() * pageCount) + 1
            this.setState({ data: data, currentPage: 1, totalPages: pageCount })
          });
      }
    }
  }

  switchPage(input) {
    console.log('switchPage')
    let didPageTurn;
    let apiKey = '3d7eed43'
    let movieType = '&type=movie'

    const pageTurn = () => {
      console.log('pageTurn')
      this.setState(prevState => {
        return { currentPage: prevState.currentPage + input }
      })
    }

    let currentPage = this.state.currentPage
    let totalPages = this.state.totalPages
    if (input === 1) {
      if (currentPage < totalPages) { pageTurn() }
      didPageTurn = true
      console.log('forward')
    } else {
      if (currentPage > 1) { pageTurn() }
      didPageTurn = true
      console.log('backward')
    }
    if (didPageTurn) { this.randomPageFetch(apiKey, currentPage + input, movieType, false) }
    console.log(this.state.currentPage + ' after randomPageFetch')
  }

  getMovieInfo(id) {
    let saveInfo;
    let apiKey = '3d7eed43'
    let fullPlot = '&plot=full'
    let fullUrl = 'http://www.omdbapi.com/?i=' + id + fullPlot + '&apikey=' + apiKey
    this.setState({modal: !this.state.modal })
    fetch(fullUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        saveInfo = data
        this.setState({movieModal: data})
      })
  }

  categorize(category, movie) {
    let { maybe, definitely, watched } = this.state
    let copyDef = [...definitely]
    let copyMay = [...maybe]
    let copyWat = [...watched]

    const checker = (array) => {
      let saveIndexHere;
      return [array.some((m,i) => {
        if (m.imdbID === movie.imdbID) {
          console.log(i + ' is the index')
          saveIndexHere = i
          return true
        }
        return false
      }), saveIndexHere]
    }

    if (category === 'maybe' && maybe.every(m => m.imdbID !== movie.imdbID)) {
      this.setState(prevState => {
        let [checkDef, indexDef] = checker(copyDef)
        let [checkWat, indexWat] = checker(copyWat)
        if (checkDef) { copyDef.splice(indexDef, 1) }
        if (checkWat) { copyWat.splice(indexWat, 1) }
        return {maybe: [...prevState.maybe, movie], definitely: copyDef, watched: copyWat }
      })
    } else if (category === 'definitely' && definitely.every(m => m.imdbID !== movie.imdbID)) {
      this.setState(prevState => {
        let [checkMay, indexMay] = checker(copyMay)
        let [checkWat, indexWat] = checker(copyWat)
        if (checkMay) { copyMay.splice(indexMay, 1) }
        if (checkWat) { copyWat.splice(indexWat, 1) }
        return {definitely: [...prevState.definitely, movie], maybe: copyMay, watched: copyWat }
      })
    } else if (category === 'watched' && watched.every(m => m.imdbID !== movie.imdbID)) {
      this.setState(prevState => {
        let [checkDef, indexDef] = checker(copyDef)
        let [checkMay, indexMay] = checker(copyMay)
        if (checkDef) { copyDef.splice(indexDef, 1) }
        if (checkMay) { copyMay.splice(indexMay, 1) }
        return {watched: [...prevState.watched, movie], definitely: copyDef, maybe: copyMay }
      })
    } else {
      console.log('should be deleted')
      this.setState(prevState => {
        let [checkDef, indexDef] = checker(copyDef)
        let [checkMay, indexMay] = checker(copyMay)
        let [checkWat, indexWat] = checker(copyWat)
        if (checkDef) { copyDef.splice(indexDef, 1) }
        if (checkMay) { copyMay.splice(indexMay, 1) }
        if (checkWat) { copyWat.splice(indexWat, 1) }
        return {watched: copyWat, definitely: copyDef, maybe: copyMay }
      })
    }
  }

  quoteToFillTheSpace() {
    fetch('https://thesimpsonsquoteapi.glitch.me/quotes')
      .then(response => response.json())
      .then(data => {
        this.setState({ quote: data })
        console.log(data)
      })

  }

  componentDidMount() {
    fetch('https://random-word-api.herokuapp.com/all')
      .then(response => response.json())
      .then(data => {
        let random = Math.floor(Math.random() * this.state.wordBank.length)
        this.setState({ wordBank: data })
        console.log(this.state.wordBank[random])
      })

  }

  render() {
    let data = this.state.data

    let inputArea = (
      <div className='inputs'>
        <form onSubmit={this.handleSubmit}>
          <label>Title: <input type='text' name='title' value={this.state.title} onChange={this.handleChange} /></label>
          <label>Year: <input type='text' name='year' onChange={this.handleChange} /></label>
          <button>SEARCH</button>
        </form>
        <select name='type' onChange={this.handleChange}>
          <option value='not-random'>Most Relevant</option>
          <option value='random-page'>Random Page Results (with your title)</option>
          <option value='random-movie'>Random Movies (with random title)</option>
        </select>
      </div>
    )

    let pageScroll = (
      <div className='scroll-container'>
      <div className='scroll'>
        <div onClick={() => this.switchPage(-1)}>Backward</div>
        <span>{`${this.state.currentPage} / ${this.state.totalPages}`}</span>
        <div onClick={() => this.switchPage(1)}>Forward</div>
      </div>
      </div>
    )

    return (
      <MyContext.Provider
        value={this.state}
        handleChange={this.handleChange}
        randomPageFetch={this.randomPageFetch}
        handleSubmit={this.handleSubmit}
        switchPage={this.switchPage}
        getMovieInfo={this.getMovieInfo}
        categorize={this.categorize}
        quoteToFillTheSpace={this.quoteToFillTheSpace}
      >
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

export default Provider;
