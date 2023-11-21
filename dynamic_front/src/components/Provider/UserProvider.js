import { useState } from "react";
import { UserContext } from "../../context";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  console.log(user);

  return(
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
