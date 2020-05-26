import React, {useState, useEffect} from 'react';
import discover from '../backend-requests/discoverSongs';
import styles from '../static/css/discover.module.css';
import likeSong from '../backend-requests/likesong';


function Discover() {
    
    useEffect(() => {
        fetchItems();
    }, []);
    
    const [items, setItems] = useState([]); 
    const fetchItems = async () => {
        const data = await discover();
        setItems(data);
    };
    
    const likesong = (name) => {
        try {
            console.log(name);
            likeSong(name);
            alert('Liked')
        } catch(e) {
            console.log('Could not like');   
        }
    };
    return(
      <div>
        <h1 className={styles.fontClassh1}>Songs found for you </h1>
        {items.map(item => (
            <h3 className={styles.fontClassh3}>
                {item.name} <span onClick={(e) => {likesong(item.name)}}  className={styles.like}>&#128156;</span>
            </h3>
        )) }
      </div>
    );
}

export default Discover;