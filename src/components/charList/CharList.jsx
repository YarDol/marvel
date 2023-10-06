import { useState, useEffect, useRef, useMemo } from 'react';
import './charList.scss';
import useMarvelService from '../../services/marvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const setContent = (processing, Component, newItemLoading) => {
  switch(processing){
      case 'waiting':
          return <Spinner/>
          break;
      case 'loading':
          return newItemLoading ? <Component/> : <Spinner/>
          break;
      case 'confirmed':
          return <Component/>;
          break;
      case 'error':
          return <ErrorMessage/>
          break;
      default: 
      throw new Error('Unexpected process state ');
  }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(true);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, processing, setProcess} = useMarvelService();

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
        getAllCharacters(offset).then(onCharactersLoaded).then(() => setProcess('confirmed')).finally(() => setNewItemLoading(false));
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
                <CSSTransition key={item.id} timeout={300} classNames='char__item' mountOnEnter unmountOnExit>
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

    const elements = useMemo(() => {
      return setContent(processing, () => renderCharacters(), newItemLoading);
      // eslint-disable-next-line
    }, [processing]);

    return (
        <div className="char__list">
            {elements}
            {!CharList.length ? null : (
            <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
            )}
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;