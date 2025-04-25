// src/context/AuthContext.js
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser);

      if (currentUser) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (!error) setUserData(data);
      }

      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser);

        if (currentUser) {
          supabase
            .from("users")
            .select("*")
            .eq("id", currentUser.id)
            .single()
            .then(({ data, error }) => {
              if (!error) setUserData(data);
            });
        } else {
          setUserData(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
