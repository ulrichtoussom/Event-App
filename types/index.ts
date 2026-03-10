
export interface cities {
    id : number ,
    name : string,
    slug : string, 
    is_active : boolean,
    create_at : Date ,
    image_url : string,
    description : string, 
    lat : number ,
    lng : number 

}

export type Events = {
    id : number,
    image_url : string,
    title : string,
    category : string,
    description:string

}