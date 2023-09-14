import { useState, useEffect, useRef } from 'react';
import './charList.scss';
import marvelService from '../../services/marvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(true);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);


    const MarvelService = new marvelService();

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
      }, []);
     
      useEffect(() => {
        if (newItemLoading) {
            onRequest();
        }
      }, [newItemLoading])
     
      const onScroll = (event) => {
        if (
          window.innerHeight + window.pageYOffset >= document.body.offsetHeight
        ) {
            setNewItemLoading(true);
        }
      };
     
      const onRequest = () => {
        onCharactersLoading();
        MarvelService.getAllCharacters(offset).then(onCharactersLoaded).catch(onError).finally(() => setNewItemLoading(false));
      };
     
      const onCharactersLoading = () => {
        setNewItemLoading(true);
      };
     
      const onCharactersLoaded = (newCharList) => {
        setCharList((charList) => [...charList, ...newCharList]);
        setLoading(false);
        setError(false);
        setOffset((offset) => offset + 9);
        setCharEnded(newCharList.length < 9 ? true : false);
      };

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const itemsRef = useRef([]);

    const onFocus = (id) => {
        itemsRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRef.current[id].classList.add('char__item_selected');
        itemsRef.current[id].focus();
    }

    function renderCharacters(arr){
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemsRef.current[i] = el}
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id)
                        onFocus(i);
                    }}
                    onKeyPress={(e) => {
                        if(e.key === ' ' || e.key === "Enter"){
                            e.preventDefault();
                            props.onCharSelected(item.id);
                            onFocus(i);
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

    const items = renderCharacters(charList);
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
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;