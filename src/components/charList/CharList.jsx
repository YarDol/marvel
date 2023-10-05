import { useState, useEffect, useRef } from 'react';
import './charList.scss';
import useMarvelService from '../../services/marvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Helmet } from 'react-helmet';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(true);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
     
    useEffect(() => {
        if (newItemLoading && !charEnded) {
            onRequest();
        }
    }, [newItemLoading]);
    
    const onScroll = (event) => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight
        ) {
            setNewItemLoading(true);
        }
    };
    
    const onRequest = () => {
        initialLoading ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset).then(onCharactersLoaded).finally(() => setNewItemLoading(false));
    };
    
    const onCharactersLoaded = (newCharList) => {
        setInitialLoading(false);
        setCharList((charList) => [...charList, ...newCharList]);
        setOffset((offset) => offset + 9);
        setCharEnded(newCharList.length < 9 ? true : false);
    };

    const itemsRef = useRef([]);

    const onFocus = (id) => {
        itemsRef.current.forEach(item => item.classList.remove('char__item_selected'));
        itemsRef.current[id].classList.add('char__item_selected');
        itemsRef.current[id].focus();
    }

    function renderCharacters(){
      const { onCharSelected } = props;

    return (
      <>
        <ul className='char__grid'>
          <TransitionGroup component={null}>
            {charList.map((item, i) => {
              let pathArr, imgStyle;
              if (item.thumbnail) {
                pathArr = item.thumbnail.split('/');
                imgStyle =
                  pathArr[pathArr.length - 1] === 'image_not_available.jpg'
                    ? { objectFit: 'fill' }
                    : null;
              }

              return (
                <CSSTransition timeout={300} classNames='char__item' mountOnEnter unmountOnExit>
                  <li
                    ref={(el) => (itemsRef.current[i] = el)}
                    tabIndex={0}
                    className='char__item'
                    key={i}
                    onClick={() => {
                      onCharSelected(item.id);
                      onFocus(i);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        onCharSelected(item.id);
                        onFocus(i);
                      }
                    }}
                  >
                    <img style={imgStyle} src={item.thumbnail} alt={item.name} />
                    <div className='char__name'>{item.name}</div>
                  </li>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </ul>
      </>
      );
    }

    const items = renderCharacters(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
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