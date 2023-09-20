import {useState, useEffect} from 'react';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './comicsList.scss';
import { Link } from 'react-router-dom';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [newItemLoading, setNewItemLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

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
            .then(onComicsListLoaded).finally(() => setNewItemLoading(false));
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

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                disabled={newItemLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;