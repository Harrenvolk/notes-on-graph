import axios from 'axios';
import {getJWT} from '../helpers/getJwt';

const artistsFromTag = async (tag) => {
    const res = await axios({
        method: 'GET',
        url: `/tags/artists/${tag}`,
        headers: {
            'Authorization': "Bearer " + getJWT()
        }
    });
    if(res.status === 200) {
        return res.data
    } else {
        throw new Error("Incorrect token")
    }
}

export default artistsFromTag;