
import { useEffect, useState } from "react";
import api from "../api";
import Activity from "../components/Activity";

export default function ActivityList() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api.get("/api/activities").then((res) => setActivities(res.data));
  }, []);

  return (
      
        <div className="your-activities">
          {
          activities.map((act) => (
            <Activity key={act.id} id={act.id} name={act.name} />
            
            
          ))}
          
        </div>

      
  );
}
