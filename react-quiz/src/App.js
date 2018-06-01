import React, { Component } from 'react';
import update from 'react-addons-update';
import logo from './logo.svg';
import './App.css';
import Question from './components/Question';
import Quiz from './components/Quiz';
import Result from './components/Result';
import quizQuestions from './DummyData/quizQuestions';

class App extends Component {

  constructor(props){
      super(props);
      this.state = {
       counter: 0,
       questionId: 1,
       question: '',
       answerOptions: [],
       answer: '',
       answersCount: {
         True: 0,
         False: 0,
       },
       result: ''
      };
      this.handleAnswerSelected = this.handleAnswerSelected.bind(this);

    }
    componentWillMount() {
        const shuffledAnswerOptions = quizQuestions.map((question) => this.shuffleArray(question.answers));

        this.setState({
          question: quizQuestions[0].question,
          answerOptions: shuffledAnswerOptions[0]
        });
      }
      shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };
  setNextQuestion() {
 const counter = this.state.counter + 1;
 const questionId = this.state.questionId + 1;
 this.setState({
   counter: counter,
   questionId: questionId,
   question: quizQuestions[counter].question,
   answerOptions: quizQuestions[counter].answers,
   answer: ''
 });
}
  setUserAnswer(answer) {
    const updatedAnswersCount = update(this.state.answersCount, {
      [answer]: {$apply: (currentValue) => currentValue + 1}
    });

    this.setState({
      answersCount: updatedAnswersCount,
      answer: answer
    });
  }
  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
  }
  setResults (result) {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount["True"]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);
     this.setState({ result: maxAnswerCount });

 }
  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (this.state.questionId < quizQuestions.length) {
        setTimeout(() => this.setNextQuestion(), 300);
      } else {
        setTimeout(() => this.setResults(this.getResults()), 300);
      }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return (
      <Result quizResult={this.state.result} />
    );
  }
  render() {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Definition Quiz</h2>
          </div>
          {this.state.result ? this.renderResult() : this.renderQuiz()}
        </div>
      )
    }
}

export default App;
