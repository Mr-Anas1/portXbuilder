"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuthContext } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const PortfolioContext = createContext();

// In-memory cache for the current session
let portfolioCache = null;

export const PortfolioProvider = ({ children }) => {
  const { user } = useAuthContext();
  const params = useParams();
  const url_name = params?.url_name;
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const supabase = createClientComponentClient();

  // Helper to get cache key
  const getCacheKey = () => {
    if (url_name) return `portfolio_cache_url_${url_name}`;
    if (user?.id) return `portfolio_cache_user_${user.id}`;
    return null;
  };

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const cacheKey = getCacheKey();

      // Check in-memory cache first
      if (portfolioCache && cacheKey && portfolioCache.key === cacheKey) {
        setPortfolio(portfolioCache.data);
        setIsPro(portfolioCache.data?.plan === "pro");
        setLoading(false);
        return;
      }

      // Check localStorage cache
      if (cacheKey) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          setPortfolio(parsed);
          setIsPro(parsed?.plan === "pro");
          // Also update in-memory cache
          portfolioCache = { key: cacheKey, data: parsed };
          setLoading(false);
          return;
        }
      }

      // If we have a url_name, we're viewing a public portfolio
      if (url_name) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id, components, theme, plan")
          .eq("url_name", url_name)
          .single();

        if (userError || !userData) {
          setPortfolio(null);
          setLoading(false);
          return;
        }

        const { data: portfolioData, error: portfolioError } = await supabase
          .from("portfolios")
          .select("*")
          .eq("user_id", userData.id)
          .single();

        if (portfolioError || !portfolioData) {
          setPortfolio(null);
          setLoading(false);
          return;
        }

        setIsPro(userData?.plan === "pro");
        const merged = {
          ...portfolioData,
          components: userData?.components || {},
          theme: userData?.theme || "default",
          plan: userData?.plan || "free",
        };
        setPortfolio(merged);
        // Update caches
        if (cacheKey) {
          localStorage.setItem(cacheKey, JSON.stringify(merged));
          portfolioCache = { key: cacheKey, data: merged };
        }
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

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", user.id)
        .single();

      if (userError || !userData) {
        setError("Failed to fetch user data");
        setLoading(false);
        return;
      }

      setIsPro(userData?.plan === "pro");
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", userData.id)
        .single();

      if (portfolioError || !portfolioData) {
        setPortfolio(null);
        setLoading(false);
        return;
      }

      const merged = {
        ...portfolioData,
        components: userData?.components || {},
        theme: userData?.theme || "default",
        plan: userData?.plan || "free",
      };
      setPortfolio(merged);
      // Update caches
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(merged));
        portfolioCache = { key: cacheKey, data: merged };
      }
    } catch (error) {
      setError("Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  }, [user, url_name]);

  useEffect(() => {
    if (!user && !url_name) {
      setLoading(false);
      return;
    }
    fetchPortfolio();
  }, [user?.id, url_name, fetchPortfolio]);

  // Add a function to update portfolio data without refetching
  const updatePortfolioData = (newData) => {
    setPortfolio((prev) => {
      const updated = {
        ...prev,
        ...newData,
      };
      // Update caches
      const cacheKey = getCacheKey();
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(updated));
        portfolioCache = { key: cacheKey, data: updated };
      }
      return updated;
    });
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
