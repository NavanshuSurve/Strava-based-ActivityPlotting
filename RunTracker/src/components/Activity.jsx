
import { useEffect, useState } from "react";
import api from "../api";
import Map from "./Map";

export default function Activity({id, name}) {
  
  const [streams, setStreams] = useState(null);
  
  useEffect(() => {
    api.get(`/api/activities/${id}`,{withCredentials:true}).then(res => {
      setStreams(res.data);
    });
  }, [id]);

  if (!streams) return <p>Loading activity...</p>;

const handlePlot=()=>{
  
    console.log("posting the plotting")
    api.post(`/api/globalmap`,{name,data:streams.latlng.data})
   .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
  
  


  
}
const handleDelete=()=>{
  
    console.log("deleting the plotting")
    api.delete(`/api/globalmap`,{data:{name}})
   .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
  
  


  
}
  
  return (
    <div>
      <h1>{name}</h1>
      <Map latlng={streams.latlng.data} />
      <button onClick={handlePlot}>{`Plot ${name}`  }</button>
      <button onClick={handleDelete}>{`Delete ${name}`  }</button>
    </div>
  );
}
