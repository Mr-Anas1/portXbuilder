"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const user = useUser();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      console.log("Fetching portfolio for user ID:", user.id);

      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching portfolio:", error.message);
      }

      console.log("Portfolio data:", data);

      setPortfolio(data);
      setLoading(false);
    };

    fetchPortfolio();
  }, [user]);

  return (
    <PortfolioContext.Provider value={{ portfolio, loading }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
