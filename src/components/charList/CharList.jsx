import { Component } from 'react';
import './charList.scss';
import marvelService from '../../services/marvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    MarvelService = new marvelService();

    componentDidMount(){
        if (this.state.offset < 219) {
            this.onRequest();
          }
          window.addEventListener("scroll", this.onScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
      }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.MarvelService.getAllCharacters(offset)
        .then(this.onCharLoaded).catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9){
            ended = true;
        }

        this.setState(({offset, charList}) => ({charList: [...charList, ...newCharList], 
        loading: false, 
        error: false, 
        newItemLoading: false,
        offset: offset + 9,
        charEnded: ended}));
    }

    onError = () => {
        this.setState({loading: false, error: true});
    }

    onScroll = () => {
        if (this.state.offset < 219) return;
        if (this.state.newItemLoading) return;
        if (this.state.charEnded)
          window.removeEventListener("scroll", this.onScroll);
     
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
          this.onRequest(this.state.offset);
        }
      };

    itemsRef = [];

    setRef = (ref) => {
        this.itemsRef.push(ref);
    }

    onFocus = (id) => {
        this.itemsRef.forEach(item => item.classList.remove('char__item_selected'));
        this.itemsRef[id].classList.add('char__item_selected');
        this.itemsRef[id].focus();
    }

    renderCharacters(arr){
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={item.id}
                    onClick={() => {
                        this.props.onCharSelected(item.id)
                        this.onFocus(i);
                    }}
                    onKeyPress={(e) => {
                        if(e.key === ' ' || e.key === "Enter"){
                            e.preventDefault();
                            this.props.onCharSelected(item.id);
                            this.onFocus(i);
                        }
                    }}>
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
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderCharacters(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {content}
                {spinner}
                {errorMessage}
                <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;