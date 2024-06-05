// import { createContext, useContext, useState } from "react";
// import { auth } from "../firebase/config";
// import { onAuthStateChanged } from "firebase/auth";
// import { useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser({
//           id: user.uid,
//           email: user.email,
//         });
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe(); // Cleanup function to unsubscribe from the listener
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   console.log("user Data :", user);

//   return (
//     //value = function pass
//     <AuthContext.Provider value={{ user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const useContextValue = useContext(AuthContext);
//   if (!useContextValue) {
//     throw new Error("userAuth used outside the provider");
//   }

//   return useContextValue;
// };

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("get firebase user data:", userData);
          setUser({
            uid: user.uid,
            email: user.email,
            role: userData.role,
          });
        } else {
          const defaultRole = "user";
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: defaultRole,
          });
          console.log("User logged in and additional data initialized:", {
            uid: user.uid,
            email: user.email,
            role: defaultRole,
          });
          setUser({
            uid: user.uid,
            email: user.email,
            role: defaultRole,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [db]);

  const isLoggedIn = !!user;
  return (
    <AuthContext.Provider value={{ isLoggedIn, user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contextValue = useContext(AuthContext);
  if (!contextValue) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return contextValue;
};
