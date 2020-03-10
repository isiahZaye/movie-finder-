import React, { Component } from 'react';
import Movie from './Movie';

class Quiz extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: [
        ['Year','Which of these movies was released in X?','Title',1],
        ['Title','What year was X released?','Year',2],
        ['Title','Who directed X?','Director',3],
        ['Director','What movie did X direct?','Title',4],
        ['Plot','What movie does this plot line belong to? X','Title',5],
        ['Title','What genre is X (movie)?','Genre',6],
        ['Genre','Which of these movies is X (genre)?','Title',7],
			  ['Actors','What movie did X star in?','Title',8],
        ['Title','Who acted in X (movie)?','Actors',9],
        ['Runtime','Which of these movies is the shortest?','Title',10],
        ['Runtime','Which movie is the longest?','Title',11],
        ['BoxOffice','Which movie made the most money?','Title',12],
        ['BoxOffice','What movie made the least money?','Title',13],
				['imdbRating','Which movie received the best rating?','Title',14],
        ['imdbRating','Which movie received the worst rating?','Title',15],
        ['Country','Which movie was not made in the USA?','Title',16],
        ['Awards','Which movie has X (awards)','Title',17]
      ],
      qNum: 0,
      quiz: false,
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      answer: [],
      points: 1
    }
    this.handleClick = this.handleClick.bind(this)
    this.quizStart = this.quizStart.bind(this)
    this.handleAnswer = this.handleAnswer.bind(this)
  }

  handleClick() {
    this.setState({quiz: !this.state.quiz})
    console.log('handleClick')
    this.quizStart()
  }

  quizStart() {
    console.log('quizStart')
    let movies = this.props.data
    let moviesCopy = [...movies]
    let answer, wrongAnswerOne, wrongAnswerTwo, wrongAnswerThree, wrongAnswerFour;

    const randomNum = (array) => Math.floor(Math.random() * array.length)

    const lookForQuestion = () => {
      console.log('lookForQuestion')
      let numAnswers = movies.length < 5 ? movies.length : 5
      let question = this.state.questions[randomNum(this.state.questions)]
      let [qProp, qString] = question
      let checkPotentialQuestion = movies.filter(m => m[qProp] !== 'N/A')
      if (movies.length < 5 && checkPotentialQuestion.length >= movies.length && movies.length > 0) {
        while (numAnswers) {
          let itemSet = setAnswers(checkPotentialQuestion, qProp, numAnswers)
          checkPotentialQuestion.splice(itemSet, 1)
          numAnswers--
          console.log('looping')
        }
        console.log('test1')
      } else if (movies.length >= 5 && checkPotentialQuestion.length >= 5) {
        while (numAnswers) {
          let itemSet = setAnswers(checkPotentialQuestion, qProp, numAnswers)
          checkPotentialQuestion.splice(itemSet, 1)
          numAnswers--
          console.log('looping')
        }
        console.log('test2')
      } else {
        console.log('test3')
        lookForQuestion()
      }
      return question
    }

    const setAnswers = (checkPotentialQuestion, qProp, whichAnswer) => {
      let randomIndex = randomNum(checkPotentialQuestion)
      switch (whichAnswer) {
        case 5:
          wrongAnswerFour = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        case 4:
          wrongAnswerThree = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        case 3:
          wrongAnswerTwo = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        case 2:
          wrongAnswerOne = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        case 1:
          answer = [checkPotentialQuestion[randomIndex][qProp],
          checkPotentialQuestion[randomIndex]]
          break;
        default:
          console.log('error')
      }
      return randomIndex
    }

    let actualQuestion = lookForQuestion()
    console.log(answer)
    console.log(wrongAnswerOne)
    console.log(wrongAnswerTwo)
    console.log(wrongAnswerThree)
    console.log(wrongAnswerFour)
    console.log(actualQuestion)
    let answerArray = [answer, wrongAnswerOne, wrongAnswerTwo, wrongAnswerThree, wrongAnswerFour]

    let answerIndex = randomNum(answerArray)
    this.setState({ question: actualQuestion, answer: answer, option1: answerArray[answerIndex] })
    answerArray.splice(answerIndex, 1)

    answerIndex = randomNum(answerArray)
    this.setState({ option2: answerArray[answerIndex] })
    answerArray.splice(answerIndex, 1)

    answerIndex = randomNum(answerArray)
    this.setState({ option3: answerArray[answerIndex] })
    answerArray.splice(answerIndex, 1)

    answerIndex = randomNum(answerArray)
    this.setState({ option4: answerArray[answerIndex] })
    answerArray.splice(answerIndex, 1)

    answerIndex = randomNum(answerArray)
    this.setState({ option5: answerArray[answerIndex] })
    answerArray.splice(answerIndex, 1)
  }

  handleAnswer(answer) {
    let [ , aObject ] = this.state.answer
    let [ aProp ] = this.state.question
    if(aObject[aProp] === answer) {
      this.setState(prevState => {
        return { points: prevState.points + 1 }
      })
      this.quizStart()
    } else {
      this.setState({quiz: !this.state.quiz, points: 1})
    }
  }
  render() {
    let { option1, option2, option3, option4, option5 } = this.state
    let [ qProp, question, aProp, qId ] = this.state.question
    let [ answerValue, answerObj ] = this.state.answer
    let correctAnswer;

    console.log(question)
    console.log(this.state.question)

    if (question) {

      correctAnswer = answerObj[aProp]

      const sortingNumberAnswers = () => {
        let sortThis = []
        option1 && sortThis.push(option1[1][qProp])
        option2 && sortThis.push(option2[1][qProp])
        option3 && sortThis.push(option3[1][qProp])
        option4 && sortThis.push(option4[1][qProp])
        option5 && sortThis.push(option5[1][qProp])
        if (typeof sortThis[0] === 'string') {
          return sortThis.map(s => s.split(' min')[0])
        }
        return sortThis
      }

      if (question.includes('released') ||
          question.includes('direct') ||
          question.includes('plot') ||
          question.includes('genre') ||
          question.includes('movies is') ||
          question.includes('star') ||
          question.includes('acted') ||
          question.includes('USA') ||
          question.includes('movie has')) {


        console.log('made it there')
        let [ qPieceOne, qPieceTwo ] = question.split('X')
        question = `${qPieceOne} ${answerValue} ${qPieceTwo}`
      } else if (question.includes('shortest') ||
                 question.includes('least money') ||
                 question.includes('worst rating')) {
        let sortThis = sortingNumberAnswers()
        correctAnswer = sortThis.filter(m => m !== 'N/A').sort((a,b) => a - b)[0]
        console.log(sortThis)
        console.log(correctAnswer)
        console.log('^^^')
      } else if (question.includes('longest') ||
                 question.includes('most money') ||
                 question.includes('best rating')) {
        let sortThis = sortingNumberAnswers()
        correctAnswer = sortThis.filter(m => m !== 'N/A').sort((a,b) => b - a)[0]
        console.log(sortThis.sort((a,b) => b - a))
        console.log(correctAnswer)
        console.log('^^')
      }
    }

    if (!this.state.quiz) {
      return (
        this.props.data.length > 2 ? <div onClick={this.handleClick} className='quiz-button'>Quiz!</div> : ''
      )
    } else {
      return (
        <div className='quiz'>
          <h1>Question {this.state.points}: </h1>
          <h3>{question}</h3>
          <ul>
            {option1 ? <li onClick={() => this.handleAnswer(option1[1][qProp])}>{option1[1][aProp]}</li> : ''}
            {option2 ? <li onClick={() => this.handleAnswer(option2[1][qProp])}>{option2[1][aProp]}</li> : ''}
            {option3 ? <li onClick={() => this.handleAnswer(option3[1][qProp])}>{option3[1][aProp]}</li> : ''}
            {option4 ? <li onClick={() => this.handleAnswer(option4[1][qProp])}>{option4[1][aProp]}</li> : ''}
            {option5 ? <li onClick={() => this.handleAnswer(option5[1][qProp])}>{option5[1][aProp]}</li> : ''}
          </ul>
        </div>
      )
    }
  }
}

export default Quiz;
