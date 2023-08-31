
const marvelCh = 'https://gateway.marvel.com:443/v1/public/characters?apikey=84a7e137899c4df45fe7eadcd6444d15';

class marvelService {
    getResource = async (url) => {
        let res = await fetch(url);
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
    
        return await res.json();
    };

    getAllCharacters = () => {
        return this.getResource(marvelCh);

    }
}

export default marvelService;