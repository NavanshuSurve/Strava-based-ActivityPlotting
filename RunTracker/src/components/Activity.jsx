
import { useEffect, useState } from "react";
import api from "../api";
import Map from "./Map";

export default function Activity({id}) {
  
  const [streams, setStreams] = useState(null);

  useEffect(() => {
    api.get(`/api/activities/${id}`).then(res => {
      setStreams(res.data);
    });
  }, [id]);

  if (!streams) return <p>Loading activity...</p>;

const handleClick=()=>{
  api.post(`/api/globalmap`,{key:streams.latlng.data})
   .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
}
  
  return (
    <div onClick={handleClick}>
      <h1>Activity Route</h1>
      <Map latlng={streams.latlng.data} />
    </div>
  );
}
