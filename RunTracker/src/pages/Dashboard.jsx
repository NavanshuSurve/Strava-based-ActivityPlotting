
import "./Dashboard.css";
import { Link } from "react-router-dom";
import ActivityList from "../components/ActivityList";
import GlobalMap from "../components/globalMap";

export default function Dashboard() {
 

  return (
    <>
      <div className="dashboard">
        <ActivityList/>

        <div className="map-side">
          <GlobalMap />
        </div>
      </div>
    </>
  );
}
