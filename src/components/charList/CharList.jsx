import { Component } from 'react';
import './charList.scss';
import marvelService from '../../services/marvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    }

    MarvelService = new marvelService();

    componentDidMount(){
        this.MarvelService.getAllCharacters()
        .then(this.onCharLoaded).catch(this.onError);
    }

    onCharLoaded = (charList) => {
        this.setState({charList, loading: false, error: false});
    }

    onError = () => {
        this.setState({loading: false, error: true});
    }

    renderCharacters(arr){
        const items =  arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li 
                    className="char__item"
                    key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render(){     
        const {charList, loading, error} = this.state;
        const items = this.renderCharacters(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {content}
                {spinner}
                {errorMessage}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;