"use client"

import React, {createContext, useContext, useEffect, useState } from "react"

// Definiton de l objet ville 

type City = {
    id : string,
    name : string,
    slug :string
}

type CityContextType = {
    selectedCity : City | null,
    setCity : (city:City) => void,
    searchQuery: string, // <-- Nouveau
    setSearchQuery: (query: string) => void; // <-- Nouveau
    selectedCategory: string,
    setCategory: (cat: string) => void
}
const cityContext = createContext<CityContextType | undefined>(undefined)

export function CityProvider({children}:{children:React.ReactNode}){

    const [selectedCity, setSelectedCity] = useState<City | null>(null)
    const [searchQuery, setSearchQuery,] = useState(''); // <-- Nouveau
    const [selectedCategory, setSelectedCategory] = useState('All')

    // charger la ville depuis le navigateur au demarage 
    useEffect(() =>{
        const savedCity = localStorage.getItem('user-selected-city')
        if(savedCity){
            setTimeout(() => {
                setSelectedCity(JSON.parse(savedCity))
            },0)
            
        }
    },[])

    const setCity = (city:City) => {
        setSelectedCity(city)
        localStorage.setItem('user-selected-city',JSON.stringify(city))
    }

    return(
        <cityContext.Provider value={{selectedCity, setCity,searchQuery, setSearchQuery,selectedCategory,setCategory:setSelectedCategory}}>
            {children}
        </cityContext.Provider>
    )
    
        
}

export function useCity() {

    const context  = useContext(cityContext)

    if(context === undefined){
        throw new Error('useCity doit être utilisé dans un CityProvider')
    }
    const {selectedCity, setCity,searchQuery, setSearchQuery,selectedCategory,setCategory} = context 

    return {selectedCity, setCity,searchQuery, setSearchQuery,selectedCategory,setCategory}
}