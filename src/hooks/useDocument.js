import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { 
    doc,
    onSnapshot
} from 'firebase/firestore';

export const useDocument = (collection, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    
    // realtime data for ducument
    useEffect(() => {
        const unsub = onSnapshot(doc(db, collection, id), (snapshot) => {
            if(snapshot.data()) {
                setDocument({...snapshot.data(), id: snapshot.id})
                setError(null)
            } else {
                setError('no such document exists')
            }
            
        }, (err) => {
            console.log(err.message)
            setError('failed to get document')
        })

        return () => unsub();

    }, [collection, id])
    
    return { document, error }
}
