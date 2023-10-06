import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './singlePage.scss';
import useMarvelService from '../../services/marvelService';
import setContent from '../../utils/setContent';
import AppBanner from "../appBanner/AppBanner";


const SinglePage = ({Component, dataType}) => {
    const {id} = useParams();
    const [data, setData] = useState(null);
    const {getComics, getCharacter, clearError, processing, setProcess} = useMarvelService();

    useEffect(() => {
        updateData()
    }, [id])

    const updateData = () => {
        clearError();

        switch (dataType) {
            case 'comic':
                getComics(id).then(onDataLoaded).then(() => setProcess('confirmed'));
                break;
            case 'character':
                getCharacter(id).then(onDataLoaded).then(() => setProcess('confirmed'));
        }
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    return (
        <>
            <AppBanner/>
            {setContent(processing, Component, data)}
        </>
    )
}

export default SinglePage;