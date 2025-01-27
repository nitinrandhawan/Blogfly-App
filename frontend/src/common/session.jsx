const StoreSession=(key,value)=>{
    return sessionStorage.setItem(key,JSON.stringify(value))
}

const LookIntoSession=(key)=>{  
return JSON.parse(sessionStorage.getItem(key))
}

const RemoveSession=(key)=>{
    return sessionStorage.removeItem(key)
}

export{
    StoreSession,
    LookIntoSession,
    RemoveSession
}