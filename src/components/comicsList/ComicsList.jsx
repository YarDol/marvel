import {useState, useEffect, useMemo} from 'react';
import useMarvelService from '../../services/marvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './comicsList.scss';
import { Link } from 'react-router-dom';

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

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {getAllComics, processing, setProcess} = useMarvelService();

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (newItemLoading && !comicsEnded) {
            onRequest(offset, true);
        }
    }, [newItemLoading]);

    const onScroll = (event) => {
        if (
            window.innerHeight + window.scrollY >=  document.documentElement.clientHeight
        ) {
            setNewItemLoading(true);
        }
    };

    const onRequest = (offset) => {
        initialLoading ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded).then(() => setProcess('confirmed')).finally(() => setNewItemLoading(false));
    }

    const onComicsListLoaded = (newComicsList) => {
        setInitialLoading(false);
        setComicsList([...comicsList, ...newComicsList]);
        setOffset(offset + 8);
        setComicsEnded(newComicsList.length < 8 ? true : false);
    }

    function renderItems (arr) {
        const items = arr.map((item, i) => {
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const elements = useMemo(() => {
        return setContent(processing, () => renderItems(comicsList), newItemLoading);
        // eslint-disable-next-line
      }, [processing]);

    return (
        <div className="comics__list">
            {elements}
            {!ComicsList.length ? null : (
            <button 
                disabled={newItemLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
            )}
        </div>
    )
}

export default ComicsList;