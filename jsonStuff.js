

// returns the magic string 
const DeconstructJSON = (jsonSlice) =>{
    const start = "https://open.spotify.com/embed/track/";
    const end = "?utm_source=generator";
    const magicNumber = jsonSlice.track.id;
    return(start+ magicNumber + end);
}

const GetMagicNumber = (jsonSlice) =>jsonSlice.track.id

const GetInfoForList = (jsonSlice) =>{
    const imgLink = jsonSlice.track.album.images[1].url;
    const {name} = jsonSlice.track;
    return{imgLink,name};

}



export{DeconstructJSON,GetInfoForList,GetMagicNumber}