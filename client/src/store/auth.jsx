import { createContext, useContext, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from the listener
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("user Data :", user);

  return (
    //value = function pass
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const useContextValue = useContext(AuthContext);
  if (!useContextValue) {
    throw new Error("userAuth used outside the provider");
  }

  return useContextValue;
};


// import React, { createContext, useContext, useState, useEffect } from "react";
// import { auth } from "../firebase/config";
// import { onAuthStateChanged } from "firebase/auth";
// import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const db = getFirestore();

//   useEffect(() => {
//     const fetchUserData = async (user) => {
//       //same as findById
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (userDoc) {
//         const userData = userDoc.data();
//         console.log("User logged in:", {
//           uid: user.uid,
//           email: user.email,
//           role: userData.role,
//         });
//         setUser({
//           uid: user.uid,
//           email: user.email,
//           role: userData.role,
//         });
//       } else {
//         // Initialize user data if it doesn't exist
//         const defaultRole = "user";
//         await setDoc(doc(db, "users", user.uid), {
//           email: user.email,
//           role: defaultRole,
//         });
//         console.log("User logged in and additional data initialized:", {
//           uid: user.uid,
//           email: user.email,
//           role: defaultRole,
//         });
//         setUser({
//           uid: user.uid,
//           email: user.email,
//           role: defaultRole,
//         });
//       }
//       setLoading(false);
//     };

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         fetchUserData(user);
//       } else {
//         setUser(null);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [db]);

//   const isLoggedIn = !!user;
//   return (
//     <AuthContext.Provider value={{ isLoggedIn, user }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const contextValue = useContext(AuthContext);
//   if (!contextValue) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return contextValue;
// };
