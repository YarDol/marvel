import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const getAllCharacters = async (offset = process.env.REACT_API_baseOffset) => {
        const res = await request(`${process.env.REACT_APP_apiBase}characters?limit=9&offset=${offset}&${process.env.REACT_APP_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${process.env.REACT_APP_apiBase}characters/${id}?${process.env.REACT_APP_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: (char.name.length > 22) ? `${char.name.slice(0, 18)}...` : char.name,
            description: char.description ? char.description.length > 230 ? char.description.slice(0, 230) + '...' : char.description : 'No description',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.slice(0, 10)
        }
    }

    return {loading, error, getAllCharacters, getCharacter, clearError}
}

export default useMarvelService;