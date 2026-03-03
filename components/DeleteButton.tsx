
'use client'

import {deleteEvent} from  '@/app/users/dashboard/actions'
import { useState } from 'react'

export default function DeleteButton({ id } : { id:string}){
    const [isdeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {

        if(!confirm("Es-tu sûr de vouloir supprimer cet événement ?")) return 
        setIsDeleting(true)

        try {
            await deleteEvent(id)
            
        } catch (error) {
            alert("Impossible de supprimer l'événement")
            setIsDeleting(false)
        } finally{
            setIsDeleting(false)
        }
    }

    return(
        <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-600 font-medium text-sm disabled:opacity-50"
        >
            { isdeleting ? 'Suppression ...' : 'Supprimer'}
        </button>
    )
    
}