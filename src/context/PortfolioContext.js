"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { user } = useAuthContext();
  const params = useParams();
  const url_name = params?.url_name;
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const supabase = createClientComponentClient();

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setPortfolio(null);
        setIsPro(false);
        return;
      }

      // Get user data from Supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError);
        setError("Failed to fetch user data");
        return;
      }

      // Set pro status
      setIsPro(userData?.plan === "pro");

      let portfolioData = null;
      let portfolioError = null;

      // If we have a user ID, try to get their portfolio
      if (user?.id) {
        // First get the user's Supabase ID from the users table
        const response = await fetch("/api/sync-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Error syncing user:", error);
          setLoading(false);
          return;
        }

        const syncedUserData = await response.json();

        if (!syncedUserData) {
          console.error("No user data found");
          setLoading(false);
          return;
        }

        // Then get the portfolio using the Supabase user ID
        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .eq("user_id", syncedUserData.id)
          .maybeSingle();

        portfolioData = data;
        portfolioError = error;
      }

      // If no portfolio found by user_id and url_name is available, try searching by url_name
      if (!portfolioData && url_name) {
        // First get the user by url_name
        const { data: userByUrl, error: userError } = await supabase
          .from("users")
          .select("id, components, theme")
          .eq("url_name", url_name)
          .maybeSingle();

        if (userError) {
          console.error("Error fetching user by url_name:", userError);
          setPortfolio(null);
          setLoading(false);
          return;
        }

        if (!userByUrl) {
          console.log("No user found with url_name:", url_name);
          setPortfolio(null);
          setLoading(false);
          return;
        }

        // Then get the portfolio using the user's ID
        const { data, error } = await supabase
          .from("portfolios")
          .select("*")
          .eq("user_id", userByUrl.id)
          .maybeSingle();

        portfolioData = data;
        portfolioError = error;
        userData = userByUrl;
      }

      console.log("Portfolio query result:", {
        data: portfolioData,
        error: portfolioError,
        url_name,
        userId: user?.id,
      });

      if (portfolioError) {
        console.error("Error fetching portfolio:", portfolioError);
        setPortfolio(null);
      }

      if (!portfolioData) {
        console.log("No portfolio found with user_id or url_name");
        setPortfolio(null);
      }

      // Merge portfolio data with user data, using default values if user data is not found
      setPortfolio({
        ...portfolioData,
        components: userData?.components || {},
        theme: userData?.theme || "default",
      });
    } catch (error) {
      console.error("Error in fetchPortfolio:", error);
      setError("Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!url_name && !user) return; // wait until one is available

    // Add a small delay to ensure Supabase is initialized
    const timeout = setTimeout(() => {
      console.log("PortfolioContext useEffect triggered with:", {
        user: user?.id,
        url_name,
        loading,
      });
      fetchPortfolio();
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, url_name]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        loading,
        error,
        fetchPortfolio,
        isPro,
        refetchPortfolio: fetchPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
