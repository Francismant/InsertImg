import { useContext } from "react";
import { UserContext } from "../../context";

export default function Homepage() {
  const { user } = useContext(UserContext);
  return (
    <div className="flex-fill">
      <h1>Homepage</h1>
      {user && (
        <img src={`http://localhost:8000/${user.avatar}`} alt="" />
      )}
    </div>
  );
}
