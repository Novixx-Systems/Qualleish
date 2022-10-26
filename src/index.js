import React from 'react';
import ReactDOM from 'react-dom';
import { nanoid } from 'nanoid';
import './index.css';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';
var audio;
function sleep(num) {
	let now = new Date();
	const stop = now.getTime() + num;
	while(true) {
		now = new Date();
		if(now.getTime() > stop) return;
	}
}
class MCVocabularyQuestion {
    constructor(phrase, answerOptions, correctAnswer, qualleish = false) {
        this.phrase = phrase;
        this.answerOptions = answerOptions;
        this.correctAnswer = correctAnswer;
        this.qualleish = qualleish;
        
        this.optionIDsMap = new Map(answerOptions.map(option => [option, `option${nanoid()}`]));
    }
    
    pronounce() {
        // Bad code:
        if (this.qualleish === true) {
            const splitted = this.phrase.split(" ");
            audio = new Audio(splitted[0].toLowerCase().replace("?", "").replace(",", "").replace("!", "").replace(".", "") + '.mp3');
            audio.play();
            audio.addEventListener("ended", function() {
                if (splitted.length > 1) {
                    audio = new Audio(splitted[1].toLowerCase().replace("?", "").replace(",", "").replace("!", "").replace(".", "") + '.mp3');
                    audio.play();
                    audio.addEventListener("ended", function() {
                        if (splitted.length > 2) {
                            audio = new Audio(splitted[2].toLowerCase().replace("?", "").replace(",", "").replace("!", "").replace(".", "") + '.mp3');
                            audio.play();
                            audio.addEventListener("ended", function() {
                                if (splitted.length > 3) {
                                    audio = new Audio(splitted[3].toLowerCase().replace("?", "").replace(",", "").replace("!", "").replace(".", "") + '.mp3');
                                    audio.play();
                                    audio.addEventListener("ended", function() {
                                        if (splitted.length > 4) {
                                            audio = new Audio(splitted[4].toLowerCase().replace("?", "").replace(",", "").replace("!", "").replace(".", "") + '.mp3');
                                            audio.play();
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <div id="parent">
                <button onClick={() => this.pronounce()}>Pronounce</button>
                <MCVocabularyQuestionDisplay
                    vocabularyPhrase={this.phrase}
                    answerOptions={this.answerOptions}
                    optionIDsMap={this.optionIDsMap}
                    correctAnswer={this.correctAnswer}
                    handleNextQuestion={handleNextQuestionMethod} />
            </div>
        );
    }
}

class MCSentenceQuestion {
    constructor(sentence, answerOptions, correctAnswer) {
        this.sentence = sentence;
        this.answerOptions = answerOptions;
        this.correctAnswer = correctAnswer;
        
        this.optionIDsMap = new Map(answerOptions.map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <MCSentenceQuestionDisplay
                sentence={this.sentence}
                answerOptions={this.answerOptions}
                optionIDsMap={this.optionIDsMap}
                correctAnswer={this.correctAnswer}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class AssemblingTranslationQuestion {
    constructor(sentence, wordOptions, translation) {
        this.sentence = sentence;
        this.wordOptions = wordOptions.sort(() => Math.random() - 0.5);
        this.translation = translation;

        this.optionIDsMap = new Map(wordOptions.map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <AssemblingTranslationQuestionDisplay
                sentence={this.sentence}
                wordOptions={this.wordOptions}
                optionIDsMap={this.optionIDsMap}
                translation={this.translation}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class WritingTranslationQuestion {
    constructor(sentence, translation) {
        this.sentence = sentence;
        this.translation = translation;
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <WritingTranslationQuestionDisplay
                sentence={this.sentence}
                answer={this.translation}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class PairsQuestion {
    constructor(firstLanguageWords, targetLanguageWords, matches) {
        this.firstLanguageWords = firstLanguageWords.sort(() => Math.random() - 0.5);
        this.targetLanguageWords = targetLanguageWords.sort(() => Math.random() - 0.5);
        this.matches = matches;

        this.optionIDsMap = new Map((firstLanguageWords.concat(targetLanguageWords)).map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <PairsQuestionDisplay
                firstLanguageWords={this.firstLanguageWords}
                targetLanguageWords={this.targetLanguageWords}
                matches={this.matches}
                optionIDsMap={this.optionIDsMap}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class LessonInformation {
    constructor(lessonName, questionsArray) {
        this.lessonName = lessonName;
        this.questionsArray = questionsArray;
    }
}

class LessonTopBar extends React.Component {
    render() {
        const questionNumber = this.props.questionNumber;

        return (
            <div>
                <div>
                    Quit Lesson
                </div>
                <div>
                    Question {questionNumber}
                </div>
            </div>
        );
    }
}

class AnswerFeedback extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this); // When submit clicked
    }

    handleClick() {
        this.props.handleNextQuestion();
    }

    render() {
        const userAnswer = this.props.userAnswer;
        const correctAnswer = this.props.correctAnswer;
        const answerWasSubmitted = this.props.answerWasSubmitted;

        let feedbackArea;
        if (!answerWasSubmitted) {
            feedbackArea =
                <div> <input type="submit" value="Submit Answer" /> </div>;
        } else {
            if (userAnswer != correctAnswer) {
                const audioElem = new Audio('audio_wrong.mp3');
                audioElem.play();
            }
            else {
                const audioElem = new Audio('audio_correct.mp3');
                audioElem.play();
            }
            feedbackArea = (
                <div>
                    <div> {(userAnswer === correctAnswer) ? 'Correct' : 'Incorrect'} </div>
                    <div> <button onClick={this.handleClick}>Continue</button> </div>
                </div>
            );
        }

        return (
            <section>{feedbackArea}</section>
        );
    }
}

class MCQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(event) {
        this.props.handleInputChange(parseInt(event.target.value, 10));
    }

    handleSubmit(event) {
        this.props.handleSubmit();
        event.preventDefault();
    }

    handleNextQuestion() {
        this.props.handleNextQuestion();
    }

    render() {
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.props.answerSelection;
        const answerWasSubmitted = this.props.answerWasSubmitted;
        const instructions = this.props.instructions;
        const optionItems = options.map((optionText, number) =>
            <li key={optionIDsMap.get(optionText)}>
                <label>
                    {optionText}
                    <input
                        type="radio"
                        name="answerOption"
                        value={(number + 1)}
                        checked={((number + 1) === selection)}
                        onChange={this.handleInputChange} />
                </label>
            </li>
        );

        return (
            <form onSubmit={this.handleSubmit}>
                <section>
                    {instructions}
                    <fieldset>
                        <legend>Select</legend>
                        <ul>
                            {optionItems}
                        </ul>
                    </fieldset>
                </section>
                <AnswerFeedback
                    userAnswer={selection}
                    answerWasSubmitted={answerWasSubmitted}
                    correctAnswer={correctAnswer}
                    handleNextQuestion={this.handleNextQuestion} />
            </form>
        );
    }
}

class MCVocabularyQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {answerSelection: 0, answerWasSubmitted: false};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(selection) {
        this.setState({answerSelection: selection});
    }

    handleSubmit() {
        this.setState({answerWasSubmitted: true});
    }

    handleNextQuestion() {
        this.setState({answerSelection: 0, answerWasSubmitted: false});
        this.props.handleNextQuestion();
    }

    render() {
        const vocabularyPhrase = this.props.vocabularyPhrase;
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.state.answerSelection;
        const answerWasSubmitted = this.state.answerWasSubmitted;
        const instructions = <p>{`${vocabularyPhrase}`}</p>;

        return (
            <MCQuestionDisplay
                answerOptions={options}
                optionIDsMap={optionIDsMap}
                correctAnswer={correctAnswer}
                answerSelection={selection}
                answerWasSubmitted={answerWasSubmitted}
                instructions={instructions}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                handleNextQuestion={this.handleNextQuestion} />
        );
    }
}

class MCSentenceQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {answerSelection: 0, answerWasSubmitted: false};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(selection) {
        this.setState({answerSelection: selection});
    }

    handleSubmit() {
        this.setState({answerWasSubmitted: true});
    }

    handleNextQuestion() {
        this.props.handleNextQuestion();
    }

    render() {
        const sentence = this.props.sentence;
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.state.answerSelection;
        const answerWasSubmitted = this.state.answerWasSubmitted;
        const instructions = <div><h1>Select the correct translation</h1><p>{sentence}</p></div>;

        return (
            <MCQuestionDisplay
                answerOptions={options}
                optionIDsMap={optionIDsMap}
                correctAnswer={correctAnswer}
                answerSelection={selection}
                answerWasSubmitted={answerWasSubmitted}
                instructions={instructions}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                handleNextQuestion={this.handleNextQuestion} />
        );
    }
}

class AssemblingTranslationQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userAnswer: [], answerWasSubmitted: false};

        this.handleAddWord = this.handleAddWord.bind(this);
        this.handleRemoveWord = this.handleRemoveWord.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({userAnswer: '', answerWasSubmitted: false});
        this.props.handleNextQuestion();
    }

    handleAddWord(event) {
        const updatedAnswer = this.state.userAnswer.concat(event.target.value);
        this.setState({userAnswer: updatedAnswer});
    }

    handleRemoveWord(event) {
        const updatedAnswer = this.state.userAnswer.filter((word) => word !== event.target.value);
        this.setState({userAnswer: updatedAnswer});
    }

    handleSubmit(event) {
        this.setState({answerWasSubmitted: true});
        event.preventDefault();
    }

    render() {
        const sentence = this.props.sentence;
        const translation = this.props.translation;
        const wordOptions = this.props.wordOptions;
        const optionIDsMap = this.props.optionIDsMap;
        
        const userAnswer = this.state.userAnswer;
        const userAnswerSentence = `${userAnswer.join(' ')}.`;
        const userAnswerWordButtons = userAnswer.map((word) =>
            <button
                onClick={this.handleRemoveWord}
                key={`user${optionIDsMap.get(word)}`}
                value={word}>
                {word}
            </button>
        );
        const wordOptionButtons = wordOptions.map((word) =>
            <button
                onClick={this.handleAddWord}
                key={optionIDsMap.get(word)}
                value={word}
                disabled={userAnswer.includes(word)}>
                {word}
            </button>
        );
        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Translate this sentence</h1>
                <p>{sentence}</p>
                <div>
                    {userAnswerWordButtons}
                </div>
                <div>
                    {wordOptionButtons}
                </div>
                <AnswerFeedback
                    userAnswer={userAnswerSentence}
                    answerWasSubmitted={this.state.answerWasSubmitted}
                    correctAnswer={translation}
                    handleNextQuestion={this.handleNextQuestion} />
            </form>
        );
    }
}

class WritingTranslationQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userAnswer: '', answerWasSubmitted: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({userAnswer: '', answerWasSubmitted: false});
        this.props.handleNextQuestion();
    }

    handleChange(event) {
        this.setState({userAnswer: event.target.value});
    }

    handleSubmit(event) {
        this.setState({answerWasSubmitted: true});
        event.preventDefault();
    }

    render() {
        const sentence = this.props.sentence;
        const answer = this.props.answer;
        return (
            <div id="parent">
                <form onSubmit={this.handleSubmit}>
                    <h1>Translate this sentence</h1>
                    <p>{sentence}</p>
                    <div>
                        <label>
                            Write answer:
                            <textarea value={this.state.answerText} onChange={this.handleChange} id="answ" rows="10" cols="50" />
                        </label>
                        <br />
                    </div>
                    <AnswerFeedback
                        userAnswer={this.state.userAnswer.toLowerCase()}
                        answerWasSubmitted={this.state.answerWasSubmitted}
                        correctAnswer={answer.toLowerCase()}
                        handleNextQuestion={this.handleNextQuestion} />
                </form>
                <button onClick={() => document.getElementById('answ').value += 'ź'}>ź</button>
                <button onClick={() => document.getElementById('answ').value += 'Ź'}>Ź</button>
                <button onClick={() => document.getElementById('answ').value += 'ē'}>ē</button>
                <button onClick={() => document.getElementById('answ').value += 'Ē'}>Ē</button>
                <button onClick={() => document.getElementById('answ').value += '†'}>†</button>
            </div>
        );
    }
}

class PairsWordCell extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, language) {
        this.props.onClick(event.target.value, language);
    }

    render() {
        const word = this.props.word;
        const selected = this.props.selected;
        const alreadyMatched = this.props.alreadyMatched;
        const matchCorrect = this.props.matchCorrect;
        const matchIncorrect = this.props.matchIncorrect;
        const language = this.props.language;
        let classesArray = [];
        const possibleClasses = ['pairWordSelected', 'pairAlreadyMatched', 'pairMatchCorrect', 'pairMatchIncorrect'];
        [(selected && !(matchCorrect || matchIncorrect)), alreadyMatched, (selected && matchCorrect && !alreadyMatched), (selected && matchIncorrect && !alreadyMatched)].forEach((property, propertyIndex) =>
            {if (property)
                {classesArray.push(possibleClasses[propertyIndex])}
            }
        );
        const buttonClassNames = classesArray.join(' ');

        return (
            <th>
                <button
                    onClick={(event) => this.handleClick(event, language)}
                    value={word}
                    disabled={alreadyMatched || matchCorrect || matchIncorrect}
                    className={buttonClassNames}>
                    {word}
                </button>
            </th>
        )
    }
}

class PairsQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {firstLanguageWordsMatched: [], firstLanguageSelection: '', targetLanguageSelection: ''};

        this.handleNextQuestion = this.handleNextQuestion.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleWordSelection = this.handleWordSelection.bind(this);
    }

    handleNextQuestion() {
        this.setState({firstLanguageWordsMatched: [], firstLanguageSelection: '', targetLanguageSelection: ''});
        this.props.handleNextQuestion();
    }

    handleContinue(event) {
        if (event.target.name === 'correctContinue') {
            let firstLWMArray = this.state.firstLanguageWordsMatched;
            firstLWMArray.push(this.state.firstLanguageSelection);
            this.setState({firstLanguageWordsMatched: firstLWMArray, firstLanguageSelection: '', targetLanguageSelection: ''});
        } else {
            this.setState({firstLanguageSelection: '', targetLanguageSelection: ''});
        }
    }

    handleWordSelection(word, language) {
        const selectionInFirstLanguage = (language === 'firstLanguage');
        const languageKey = (selectionInFirstLanguage ? 'firstLanguageSelection' : 'targetLanguageSelection');
        const otherLanguageWord = (selectionInFirstLanguage ? this.state.targetLanguageSelection : this.state.firstLanguageSelection);
        if (otherLanguageWord === '') {
            if (word === this.state[languageKey]) {
                this.setState({[languageKey]: ''});
            } else {
                this.setState({[languageKey]: word});
            }
        } else {
            this.setState({[languageKey]: word});
        }
    }

    render() {
        const firstLanguageWords = this.props.firstLanguageWords;
        const targetLanguageWords = this.props.targetLanguageWords;
        const matches = this.props.matches;
        const optionIDsMap = this.props.optionIDsMap;
        const firstLWordsMatched = this.state.firstLanguageWordsMatched;
        const firstLanguageSelection = this.state.firstLanguageSelection;
        const targetLanguageSelection = this.state.targetLanguageSelection;
        const targetLWordsMatched = firstLWordsMatched.map(firstLWord => matches.get(firstLWord));
        const matchAttempted = !((firstLanguageSelection === '') || (targetLanguageSelection === ''));
        const matchCorrect = (matchAttempted && (targetLanguageSelection === this.props.matches.get(firstLanguageSelection)));
        const matchIncorrect = (matchAttempted && (targetLanguageSelection !== this.props.matches.get(firstLanguageSelection)));
        const allMatched = matchCorrect && (firstLWordsMatched.length >= (matches.size - 1));

        const wordButtonsTable = firstLanguageWords.map((firstLanguageWord, wordIndex) =>
            <tr key={optionIDsMap.get(firstLanguageWord)}>
                <PairsWordCell
                    word={firstLanguageWord}
                    selected={firstLanguageWord === firstLanguageSelection}
                    alreadyMatched={firstLWordsMatched.includes(firstLanguageWord)}
                    matchCorrect={matchCorrect}
                    matchIncorrect={matchIncorrect}
                    language='firstLanguage'
                    onClick={this.handleWordSelection} />
                <PairsWordCell
                    word={targetLanguageWords[wordIndex]}
                    selected={targetLanguageWords[wordIndex] === targetLanguageSelection}
                    alreadyMatched={targetLWordsMatched.includes(targetLanguageWords[wordIndex])}
                    matchCorrect={matchCorrect}
                    matchIncorrect={matchIncorrect}
                    language='targetLanguage'
                    onClick={this.handleWordSelection} />
            </tr>
        );

        let answerFeedbackArea = '';
        if (matchCorrect && !allMatched) {
            answerFeedbackArea = (<div>
                <p>Match correct!</p>
                <button name='correctContinue' onClick={this.handleContinue}>Click to continue</button>
            </div>);
        }
        if (matchIncorrect) {
            answerFeedbackArea = (<div>
                <p>Match incorrect</p>
                <button name='incorrectContinue' onClick={this.handleContinue}>Click to continue</button>
            </div>);
        }
        if (allMatched) {
            answerFeedbackArea = (<div>
                <p>Excellent!</p>
                <button onClick={this.handleNextQuestion}>Click to continue</button>
            </div>);
        }

        return (
            <div>
                <h1>Match the pairs</h1>
                <table>
                    <tbody>
                        {wordButtonsTable}
                    </tbody>
                </table>
                {answerFeedbackArea}
            </div>
        );
    }
}

class LessonDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {questionNumber: 1};

        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({
            questionNumber: (this.state.questionNumber + 1)
        });
    }

    render() {
        if ((this.state.questionNumber - 1) == CURRENT_LESSON.questionsArray.length) {
            return (<AppDisplay />);
        }
        const currentQuestion = CURRENT_LESSON.questionsArray[(this.state.questionNumber - 1)];
        const currentQuestionDisplay = currentQuestion.displayQuestion(this.handleNextQuestion);
        return (
            <div>
                <div>
                    <LessonTopBar
                        questionNumber={this.state.questionNumber} />
                </div>
                <div>
                    {currentQuestionDisplay}
                </div>
            </div>
        );
    }
}

class MenusTopBar extends React.Component {
    render() {
        return (
            <div>
                <p>Learn Qualleish</p>
                <br /><p>Copyright (c) 2022 Novixx Systems</p>
            </div>
        );
    }
}

class LessonSelectionDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.handleClickLesson = this.handleClickLesson.bind(this);
    }

    handleClickLesson(event) {
        this.props.onNavigationSelect('lesson', event.target.name);
    }

    render() {
        return (
            <div>
                <div>Select Lesson</div>
                <div><button onClick={this.handleClickLesson} name='LESSON_SIMPLE'>Simple Words</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_PEOPLE'>Family</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_SIMPLE_SENTENCES'>Simple Sentences</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_QUESTIONS'>Questions</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_VACATION'>Vacation</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_SIMPLE_TWO'>Simple Words 2</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_SENTENCES_TWO'>Simple Sentences 2</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_SIMPLE_THREE'>Word and Sentence practice</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_COMPUTERS'>Digital</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_WORLD'>The World</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_GENERAL'>General Conversations</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_GREETINGS'>Greetings</button></div>
                <div><button onClick={this.handleClickLesson} name='LESSON_INTRODUCE'>Introduce</button></div>
            </div>
        );
    }
}

class MenusBottomBar extends React.Component {
    render() {
        return (
            <p></p>
        );
    }
}

class MenuDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.handleNavigationSelect = this.handleNavigationSelect.bind(this);
    }

    handleNavigationSelect(navigationCategory, navigationSelection) {
        this.props.onNavigationSelect(navigationCategory, navigationSelection);
    }

    render() {
        return (
            <div>
                <MenusTopBar />
                <LessonSelectionDisplay onNavigationSelect={this.handleNavigationSelect} />
                <MenusBottomBar />
            </div>
        );
    }
}

class AppDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentDisplay: 'lesson-select-menu', lessonID: 'menu'};
        document.title = "Qualleish";
        this.handleNavigationSelect = this.handleNavigationSelect.bind(this);
    }

    handleNavigationSelect(navigationCategory, navigationSelection) {
        switch(navigationCategory) {
            case 'lesson':
                CURRENT_LESSON = eval(navigationSelection);
                this.setState({
                    currentDisplay: 'lesson-display',
                    lessonID: navigationSelection
                });
                break;
            case 'menu':
                this.setState({
                    currentDisplay: navigationSelection,
                    lessonID: 'menu'
                });
                break;
            default:
                this.setState({
                    currentDisplay: 'lesson-select-menu',
                    lessonID: 'menu'
                });
        }
    }

    render() {
        const currentDisplay = this.state.currentDisplay;
        let display;
        switch (currentDisplay) {
            case 'lesson-select-menu':
                display = <MenuDisplay onNavigationSelect={this.handleNavigationSelect} />;
                break;
            case 'lesson-display':
                display = <LessonDisplay
                            lessonID={this.state.lessonID} />;
                break;
            default:
                display = <MenuDisplay onNavigationSelect={this.handleNavigationSelect} />;
        }
        return (
            <div>{display}</div>
        );
    }
}
// people
const PQ1 = new PairsQuestion(['father', 'mother', 'brother', 'sister'], ['f†der', 'modor', 'b†der', 'g†ter'],
    new Map([['father', 'f†der'], ['mother', 'modor'], ['brother', 'b†der'], ['sister', 'g†ter']]));
const PQ2 = new WritingTranslationQuestion('The mother is queen.', 'Źe modor equ cwen.');
const PQ3 = new MCVocabularyQuestion('father', ['r†der', 'se f†der', 'b†der', 'f†der'], 4);
const PQ4 = new MCVocabularyQuestion('the mother', ['se mujer', 'un modor', 'źe modor', 'se modor'], 3);
const PQ5 = new MCSentenceQuestion("The king is in heaven", ['Se king equ on heofonum.', 'Es king equ on heofonum.', 'Se king equ on heven.'], 1);
const PQ6 = new AssemblingTranslationQuestion('I am the king.', ['Mē', 'se', 'Mei', 'yo', 'king', 'cwen', 'un'], 'Mē se king.');
// end people
// simple
const SQ1 = new MCVocabularyQuestion('king', ['cwen', 'king', 'amaza', 'kynge'], 2);
const SQ2 = new MCVocabularyQuestion('you', ['þu', 'un', 'ðe', 'yo'], 1);
const SQ3 = new MCVocabularyQuestion('queen', ['cwen', 'so king', 'ðe', 'nada'], 1);
const SQ4 = new MCVocabularyQuestion('the king', ['ða king', 'so king', 'se king', 'kingse'], 3);
const SQ5 = new PairsQuestion(['queen', 'king', 'you', 'me', 'the (masculine)', 'the (feminine)'], ['cwen', 'king', 'þu', 'mē', 'se', 'źe'],
    new Map([['queen', 'cwen'], ['king', 'king'], ['you', 'þu'], ['me', 'mē'], ['the (masculine)', 'se'], ['the (feminine)', 'źe']]));
const SQ6 = new MCVocabularyQuestion('is', ['eq', 'equ', 'es', 'el'], 2);
// end simple
// simple SENTENCES
const SEQ1 = new MCVocabularyQuestion('listen to me', ['uhoore mē', 'ahoradon mē', 'ahoore mē', 'ahoora mē'], 4);
const SEQ2 = new MCVocabularyQuestion('Hie ahoradon mē!', ['He heard me!', 'They heard me!', 'It heard me!', 'She heard me!'], 2, true);
const SEQ3 = new MCVocabularyQuestion('The queen is king', ['Se cwen equ cwen', 'Źe cwen equ king', 'Se cwen equ cwing', 'Se cwen equ king'], 2);
const SEQ4 = new MCVocabularyQuestion('The king is queen', ['Źe king equ cwen', 'Se king equ cwen', 'Se king equ so king', 'Źe cwen equ king'], 2);
const SEQ5 = new MCVocabularyQuestion('In Qualleish, if you are talking about\nsomething masculine, you use "Se" for the english word "The" and\notherwise you use "Źe"\n\nTrue or false?', ['True', 'False'], 1);
const SEQ6 = new WritingTranslationQuestion('Listen to the king.', 'Ahoora se king.');
const SEQ7 = new AssemblingTranslationQuestion('I am the queen.', ['Mē', 'se', 'de', 'un', 'king', 'cwen', 'źe'], 'Mē źe cwen.');
// end simple SENTENCES
// questions
const QQ1 = new MCSentenceQuestion("Are you sure?", ['Qi þu iwis?', 'þu iwis?', 'Qi iwis?'], 1);
const QQ2 = new AssemblingTranslationQuestion('Is the king sure?', ['equ', 'Se', 'king', 'Qi', 'iwis', 'qi', 'þu', '?'], 'Se king equ iwis ?.');
const QQ3 = new MCVocabularyQuestion('no', ['neh', 'yhas', 'nee', 'ne'], 1);
const QQ4 = new MCVocabularyQuestion('yes', ['yhas', 'je', 'ja', 'ne'], 2);
const QQ5 = new MCSentenceQuestion("Is the king in heaven?", ['Se king equ on heofonum?', 'Es king equ on heofonum?', 'Equ se king on heofonum?'], 1);
const QQ6 = new AssemblingTranslationQuestion('Are you the queen?', ['Þu', 'se', 'Iwis', 'źe', 'king', 'cwen', '?'], 'Þu źe cwen ?.');
// end questions
// vacation
const VQ1 = new MCVocabularyQuestion('A cup of coffee, please.', ['A coffeye, pofa.', 'Een koffie, pofa.', 'A coffeye, please.', 'Mē ahoora coffee.'], 1);
const VQ2 = new MCVocabularyQuestion('Mē gonne vakation!', ['I am going on a vacation!', 'I am vacation!', 'We are going on a vacation!', 'I am not going on a vacation!'], 1, true);
const VQ3 = new WritingTranslationQuestion('Please', 'Pofa');
const VQ4 = new AssemblingTranslationQuestion('You are going on a vacation.', ['Mē', 'Þu', 'gonne', 'vakation', 'king', 'pofa', 'źe'], 'Þu gonne vakation.');
const VQ5 = new MCVocabularyQuestion('I want a glass of water.', ['Mē n†d cwen.', 'Mē n†d ajua.', 'Mē pofa ajua.', 'Mē n†d vakation.'], 2);
const VQ6 = new WritingTranslationQuestion('They are on vacation.', 'Hie qi vakation.');
const VQ7 = new PairsQuestion(['vacation', 'please', 'you', 'king', 'sure'], ['vakation', 'pofa', 'þu', 'king', 'iwis'],
    new Map([['vacation', 'vakation'], ['please', 'pofa'], ['you', 'þu'], ['king', 'king'], ['sure', 'iwis']]));
// end vacation
// SIMPLE 2
const S2Q1 = new MCVocabularyQuestion('Crazy', ['Amaz', 'Gek', 'Cryzy', 'Ahoorab'], 1);
const S2Q2 = new WritingTranslationQuestion('Please', 'Pofa');
const S2Q3 = new MCVocabularyQuestion('Milk', ['Cadre', 'C†dre', 'Minuto', 'Je'], 2);
const S2Q4 = new AssemblingTranslationQuestion('Milk, Please', ['mē', 'Þu', 'C†dre', 'vakation', 'cwen', 'pofa', 'źe'], 'C†dre pofa.');
const S2Q5 = new MCVocabularyQuestion('I', ['Mē', 'Ne', 'Zi', 'Se'], 1);
const S2Q6 = new MCVocabularyQuestion('Mē źe cwen.', ['I am the queen.', 'I am the king.', 'I am not the queen.', 'Are you the queen?'], 1, true);
// end SIMPLE 2
// sentences 2
const SS2Q1 = new MCVocabularyQuestion('C†dre, pofa.', ['Milk, please.', 'Water, please.', 'Cats, please.', 'Me, please.'], 1, true);
const SS2Q2 = new MCVocabularyQuestion('Hie qi vakation.', ['He is on vacation.', 'She is on vacation.', 'They are on vacation.', 'I am on vacation.'], 3, true);
const SS2Q3 = new MCVocabularyQuestion('The queen is crazy', ['Źe cwen equ amaz', 'Se cwen equ amaz', 'Se cwen equ ajua', 'Źe cwen equ yhas'], 1);
const SS2Q4 = new MCVocabularyQuestion('The king says: "Please"', ['Se king grites: "Pofa"', 'Se king cwen: "Pofa"', 'Se king yhas: "Pofa"', 'Źe king grites: "Pofa"'], 1);
const SS2Q5 = new MCVocabularyQuestion('The queen says: "No"', ['Se cwen grites: "Neh"', 'Se cwen grites: "No"', 'Źe cwen grites: "No"', 'Źe cwen grites: "Neh"'], 4);
const SS2Q6 = new WritingTranslationQuestion('Listen to the king.', 'Ahoora se king.');
const SS2Q7 = new AssemblingTranslationQuestion('The crazy milk.', ['mē', 'amaz', 'de', 'un', 'neh', 'c†dre', 'Źe'], 'Źe amaz c†dre.');
// end sentences 2
// SIMPLE 3
const S3Q1 = new MCVocabularyQuestion('Say', ['Grite', 'Gek', 'Sae', 'Se'], 1);
const S3Q2 = new WritingTranslationQuestion('Say', 'Grite');
const S3Q3 = new PairsQuestion(['say', 'says', 'please', 'yes', 'no'], ['grite', 'grites', 'pofa', 'je', 'neh'],
    new Map([['say', 'grite'], ['says', 'grites'], ['please', 'pofa'], ['yes', 'je'], ['no', 'neh']]));
const S3Q4 = new AssemblingTranslationQuestion('Milan says that you are crazy!', ['Milan', 'grites', 'þu', 'qi', 'amaz', 'pofa', 'grite', '!'], 'Milan grites þu qi amaz !.');
const S3Q5 = new MCVocabularyQuestion('Þu', ['Me', 'You', 'His', 'Their'], 2, true);
const S3Q6 = new MCVocabularyQuestion('Þu źe cwen?', ['I am the queen', 'I am the king?', 'Are you the king', 'Are you the queen?'], 4, true);
const S3Q7 = new MCVocabularyQuestion('You are crazy!', ['Þu amaz!', 'Þu qi amaz!', 'Þu qi yhas!', 'Þu yhas!'], 2);
const S3Q8 = new WritingTranslationQuestion('Crazy', 'Amaz');
const S3Q9 = new WritingTranslationQuestion('Yes', 'Je');
const S3Q10 = new WritingTranslationQuestion('Neh, mē źe cwen!', 'No, I am the queen!');
// end SIMPLE 3
// digital
const DQ1 = new MCVocabularyQuestion('Computer', ['þomputadoll', 'Gek', 'Sae', 'Se'], 1);
const DQ2 = new WritingTranslationQuestion('Say', 'Grite');
const DQ3 = new MCVocabularyQuestion('Źe þomputadoll', ['The computer', 'This computer', 'Your computer', 'My computer'], 1, true);
const DQ4 = new AssemblingTranslationQuestion('The computer is amazing!', ['Źe', 'þomputadoll', 'equ', 'hanya', 'amaz', 'pofa', 'Se', '!'], 'Źe þomputadoll equ hanya !.');
const DQ5 = new MCVocabularyQuestion('Þu qi þomputadoll', ['You are a computer doll', 'You are a computer', 'You suck', 'You are weird'], 2, true);
const DQ6 = new MCVocabularyQuestion('The internet', ['Źe intern†t', 'Se intern†t', 'Se willkome', 'Se Nedderlends'], 1);
const DQ7 = new MCVocabularyQuestion('Þomputadoll', ['Computer', 'Internet', 'You', 'Yes'], 1, true);
const DQ8 = new WritingTranslationQuestion('Internet', 'Intern†t');
// end digital
// world
const WQ1 = new MCVocabularyQuestion('Se Nedderlends', ['Germany', 'The Netherlands', 'The United States', 'Spain'], 2, true);
const WQ2 = new WritingTranslationQuestion('The Netherlands', 'Se Nedderlends');
const WQ3 = new MCVocabularyQuestion('Germany', ['Germaan', 'Germenn', 'Se Nedderlends', 'G†mas'], 1);
const WQ4 = new AssemblingTranslationQuestion('I live in The Netherlands', ['Źe', 'þomputadoll', 'woone', 'Mē', 'amaz', 'pofa', 'Se', 'Nedderlends'], 'Mē woone Se Nedderlends.');
// end world
// GENERAL CONVERSATIONS
const GEQ1 = new MCVocabularyQuestion('Today', ['Toddē', 'Vandagh', 'Jaare', 'Dēs'], 1);
const GEQ2 = new WritingTranslationQuestion('Today is my vacation!', 'Toddē equ mē vakation!');
const GEQ3 = new MCVocabularyQuestion('Źe toilette equ vol', ['The toilet is empty', 'The toilet is full', 'The toilet is cool', 'My house is a toilet'], 2, true);
const GEQ4 = new MCVocabularyQuestion('English', ['Ingelise', 'Engles', 'Angelsh', 'Angels'], 1);
const GEQ5 = new MCVocabularyQuestion('Dutch', ['Nedderase', 'Nederlands', 'Nederlends', 'Dutce'], 1, true);
const GEQ6 = new WritingTranslationQuestion('I live in The Netherlands', 'Mē woone Se Nedderlends');
const GEQ7 = new MCVocabularyQuestion('I live in Germany', ['Mē woone Germaan', 'Mē woone Germenn', 'Mē woone G†mas', 'Me woone Austerē'], 1, true);
const GEQ8 = new AssemblingTranslationQuestion('I live in Austria', ['Źe', 'Þomputadoll', 'woone', 'Mē', 'amaz', 'pofa', 'Se', 'Austerē'], 'Mē woone Austerē.');
// end GENERAL CONVERSATIONS
// greetings
const GQQ1 = new MCVocabularyQuestion('Welcome', ['Willkome', 'Hallo', 'Hanya', 'Germaan'], 1);
const GQQ2 = new AssemblingTranslationQuestion('Welcome, Milan.', ['Willkome', 'se', 'Źe', 'Milan', 'Frank', 'Mark'], 'Willkome Milan.');
const GQQ3 = new MCVocabularyQuestion('Hello!', ['Henlo!', 'Hello!', 'Germaan!', 'Hallo!'], 4);
const GQQ4 = new MCVocabularyQuestion('Sorry', ['Hanya', 'Sorry', 'Þomputadoll', 'Cwen'], 2);
const GQQ5 = new MCVocabularyQuestion('Mē n†d c†dre, pofa.', ['I want milk, please.', 'I need milk, please.', 'I do not want milk, please.', 'What is milk?'], 1, true);
const GQQ6 = new AssemblingTranslationQuestion('I am going to the toilet.', ['Mē', 'gonne', 'źe', 'toilette', 'neh', 'je', 'se'], 'Mē gonne źe toilette.');
// end GREETINGS
// greetings
const IQQ1 = new MCVocabularyQuestion('I am Milan', ['Mē nym equ Milan', 'Mē nym is Milan', 'Mē Milan', 'Soy Milan'], 1);
const IQQ2 = new AssemblingTranslationQuestion('Hello, I am Frank!', ['Willkome', 'Hallo', 'Źe', 'nym', 'Frank', 'Mē', ',', '!', 'equ'], 'Hallo , Mē nym equ Frank !.');
const IQQ3 = new MCVocabularyQuestion('Hello!', ['Henlo!', 'Hello!', 'Germaan!', 'Hallo!'], 4);
const IQQ4 = new MCVocabularyQuestion('I am new here.', ['Mē nieuw ah†re', 'Mē ah†re', 'Þu nieuw ah†re', 'Cwen mē ah†re'], 1);
const IQQ5 = new MCVocabularyQuestion('You are a man.', ['Þu qi g†mas', 'Þu qi germenn', 'C†dre, pofa.', 'Equ germenn'], 2, true);
const IQQ6 = new MCVocabularyQuestion('You are a woman.', ['Þu qi womannes.', 'Þu qi g†mas.', 'Toilette, pofa.', 'Þu qi c†dre.'], 2, true);
const IQQ7 = new AssemblingTranslationQuestion('I am going to The Netherlands.', ['Mē', 'gonne', 'Se', 'toilette', 'Nedderlends', 'je', 'se'], 'Mē gonne Se Nedderlends.');
const IQQ8 = new PairsQuestion(['toilet', 'man', 'woman', 'hello', 'I'], ['toilette', 'germenn', 'g†mas', 'hallo', 'mē'],
    new Map([['toilet', 'toilette'], ['man', 'germenn'], ['woman', 'g†mas'], ['hello', 'hallo'], ['I', 'mē']]));
const IQQ9 = new MCVocabularyQuestion('I am a human.', ['Mē equ humen.', 'Mē equ c†dre.', 'Þu nieuw c†dre.', 'Mē equ mens.'], 4);
// end GREETINGS
const LESSON_SIMPLE = new LessonInformation('Simple Words', [SQ1, SQ2, SQ3, SQ4, SQ5, SQ6]);
const LESSON_PEOPLE = new LessonInformation('Family', [PQ1, PQ2, PQ3, PQ4, PQ5, PQ6]);
const LESSON_SIMPLE_SENTENCES = new LessonInformation('Simple Sentences', [SEQ1, SEQ2, SEQ3, SEQ4, SEQ5, SEQ6, SEQ7]);
const LESSON_QUESTIONS = new LessonInformation('Questions', [QQ1, QQ2, QQ3, QQ4, QQ5, QQ6]);
const LESSON_VACATION = new LessonInformation('Vacation', [VQ1, VQ2, VQ3, VQ4, VQ5, VQ6, VQ7]);
const LESSON_SIMPLE_TWO = new LessonInformation('Simple Words 2', [S2Q1, S2Q2, S2Q3, S2Q4, S2Q5, S2Q6, SQ2]);
const LESSON_SENTENCES_TWO = new LessonInformation('Simple Sentences 2', [SS2Q1, SS2Q2, SS2Q3, SS2Q4, SS2Q5, SS2Q6, SS2Q7, SEQ1]);
const LESSON_SIMPLE_THREE = new LessonInformation('Simple Words 3', [S3Q1, S3Q2, S3Q3, S3Q4, S3Q5, S3Q6, S3Q7, S3Q8, S3Q9, S3Q10]);
const LESSON_COMPUTERS = new LessonInformation('Digital', [DQ1, DQ2, DQ3, DQ4, DQ5, DQ6, DQ7, DQ8]);
const LESSON_WORLD = new LessonInformation('The World', [WQ1, WQ2, WQ3, WQ4]);
const LESSON_GENERAL = new LessonInformation('General Conversations', [GEQ1, GEQ2, GEQ3, GEQ4, GEQ5, GEQ6, GEQ7, GEQ8]);
const LESSON_GREETINGS = new LessonInformation('Greetings', [GQQ1, GQQ2, GQQ3, GQQ4, GQQ5, GQQ1, GQQ6]);
const LESSON_INTRODUCE = new LessonInformation('Introduce', [IQQ1, IQQ2, IQQ3, IQQ4, IQQ5, IQQ6, IQQ7, IQQ8, IQQ9]);
var CURRENT_LESSON = new LessonInformation('NULL', []);
ReactDOM.render(
    <AppDisplay />,
        document.getElementById('root')
);