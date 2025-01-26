"use client"
import { CardModal } from "../modals/card-modal"
import { useState ,useEffect} from "react";

export const ModalProvider=()=>{
    const [isMounted,setIsMounted]=useState(false);
    useEffect(()=>{
        setIsMounted(true);

    },[]);
    if(!isMounted){
        return null;
    }
    return(
        <>
        <CardModal/>
        </>
    )
}