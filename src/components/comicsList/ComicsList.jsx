import { useState, useEffect, useRef } from 'react';
import './comicsList.scss';
import Spinner from '../spinner/Spinner';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

const ComicsList = (props) => {
    return (
        <div className="comics__list">
            {/* <img src={uw} alt="ultimate war" className="comics__item-img"/>
                <div className="comics__item-name">ULTIMATE X-MEN VOL. 5: ULTIMATE WAR TPB</div>
                <div className="comics__item-price">9.99$</div> */}
            <button className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;