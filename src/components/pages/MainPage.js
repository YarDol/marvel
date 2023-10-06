import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearchForm from "../charSearchForm/charSearchForm";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";
import { useState } from "react";
import { Helmet } from "react-helmet";
import decoration from '../../resources/img/vision.png';

const MainPage = () => {

    
    const  [selectedChar, setChar] = useState(null);

    const onCharSelected = (id) => {
        setChar(id);
    }


    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal"/>
                <title>Marvel information portal</title>
            </Helmet>
            <ErrorBoundary><RandomChar/></ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary><CharList onCharSelected={onCharSelected}/></ErrorBoundary>
                <ErrorBoundary>
                    <aside style={{ position: 'sticky', top: '25px' }}>
                        <CharInfo charId={selectedChar}/>
                        <CharSearchForm />
                    </aside>
                </ErrorBoundary>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
                        
        </>
    )
}

export default MainPage;