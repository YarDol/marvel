import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {request, clearError, processing, setProcess} = useHttp();

    const getAllCharacters = async (offset = process.env.REACT_API_baseOffset) => {
        const res = await request(`${process.env.REACT_APP_apiBase}characters?limit=9&offset=${offset}&${process.env.REACT_APP_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${process.env.REACT_APP_apiBase}characters?name=${name}&${process.env.REACT_APP_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${process.env.REACT_APP_apiBase}characters/${id}?${process.env.REACT_APP_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 0) => {
        const res = await request (`${process.env.REACT_APP_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${process.env.REACT_APP_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComics = async (id) => {
        const res = await request(`${process.env.REACT_APP_apiBase}comics/${id}?${process.env.REACT_APP_apiKey}`);
        return _transformComics(res.data.results[0]);
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

    const _transformComics = (comics) => {
        return {
            id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
        }
    }

    return {processing, setProcess, getAllCharacters, getCharacter, getAllComics, getComics, clearError, getCharacterByName}
}

export default useMarvelService;