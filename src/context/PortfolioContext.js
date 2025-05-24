"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { useParams } from "next/navigation";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const user = useUser();
  const params = useParams();
  const url_name = params?.url_name;
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    if (!user && !url_name) {
      console.log("No user or url_name available, skipping fetch");
      setLoading(false);
      return;
    }

    console.log("Fetch parameters:", {
      url_name,
      userId: user?.id,
      isUsingUrlName: !!url_name,
    });

    try {
      // First, let's check if the portfolio exists
      const { data: portfolio, error: portfolioError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("url_name", url_name)
        .maybeSingle();

      console.log("Portfolio query result:", {
        data: portfolio,
        error: portfolioError,
        url_name,
      });

      if (portfolioError) {
        console.error("Error fetching portfolio:", portfolioError);
        setPortfolio(null);
        setLoading(false);
        return;
      }

      if (!portfolio) {
        console.log("No portfolio found with url_name:", url_name);
        setPortfolio(null);
        setLoading(false);
        return;
      }

      // If we found a portfolio, get the user data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("components, theme")
        .eq("id", portfolio.user_id)
        .single();

      console.log("User data query result:", {
        data: userData,
        error: userError,
        userId: portfolio.user_id,
      });

      if (userError) {
        console.error("Error fetching user data:", userError);
        setPortfolio(null);
        setLoading(false);
        return;
      }

      setPortfolio({
        ...portfolio,
        ...userData,
      });
    } catch (error) {
      console.error("Unexpected error in fetchPortfolio:", error);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!url_name && !user) return; // wait until one is available

    // optionally add a tiny timeout (debounce-style) to wait for Supabase to initialize on client
    const timeout = setTimeout(() => {
      console.log("PortfolioContext useEffect triggered with:", {
        user: user?.id,
        url_name,
        loading,
      });
      fetchPortfolio();
    }, 100); // adjust if needed

    return () => clearTimeout(timeout);
  }, [user, url_name]);

  return (
    <PortfolioContext.Provider
      value={{ portfolio, loading, refetchPortfolio: fetchPortfolio }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
