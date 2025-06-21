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

      // If we have a url_name, we're viewing a public portfolio
      if (url_name) {
        // Get user data by url_name
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, components, theme, plan")
          .eq("url_name", url_name)
          .single();

        if (userError) {
          console.error("Error fetching user by url_name:", userError);
          setPortfolio(null);
          setLoading(false);
          return;
        }

        if (!userData) {
          setPortfolio(null);
          setLoading(false);
          return;
        }

        // Get portfolio data
        const { data: portfolioData, error: portfolioError } = await supabase
          .from("portfolios")
          .select("*")
          .eq("user_id", userData.id)
          .single();

        if (portfolioError) {
          setPortfolio(null);
          setLoading(false);
          return;
        }

        // Set pro status
        setIsPro(userData?.plan === "pro");

        // Merge portfolio data with user data
        setPortfolio({
          ...portfolioData,
          components: userData?.components || {},
          theme: userData?.theme || "default",
        });
        setLoading(false);
        return;
      }

      // If we're in the dashboard (no url_name), we need authentication
      if (!user) {
        setPortfolio(null);
        setIsPro(false);
        setLoading(false);
        return;
      }

      // Get user data from Supabase
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single();

      if (userError) {
        setError("Failed to fetch user data");
        setLoading(false);
        return;
      }

      // Set pro status
      setIsPro(userData?.plan === "pro");

      // Get portfolio data
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", userData.id)
        .single();

      if (portfolioError) {
        setPortfolio(null);
        setLoading(false);
        return;
      }

      // Merge portfolio data with user data
      setPortfolio({
        ...portfolioData,
        components: userData?.components || {},
        theme: userData?.theme || "default",
      });
    } catch (error) {
      setError("Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add a small delay to ensure Supabase is initialized
    const timeout = setTimeout(() => {
      fetchPortfolio();
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, url_name]);

  // Add a function to update portfolio data without refetching
  const updatePortfolioData = (newData) => {
    setPortfolio((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        loading,
        error,
        fetchPortfolio,
        isPro,
        refetchPortfolio: fetchPortfolio,
        updatePortfolioData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
