const ClerkLayout=({children}:{
    children:React.ReactNode;
})=>{
    return(
        <div className="h-full  mt-5 flex items-center justify-center">
            {children}
        </div>
        
    )
}

export default ClerkLayout;