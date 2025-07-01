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

      // If we have a url_name, we're viewing a public portfolio
      if (url_name) {
        // Always fetch fresh data for public portfolio page
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
        setLoading(false);
        return;
      }

      // Dashboard (authenticated user) view: use cache
      if (portfolioCache && cacheKey && portfolioCache.key === cacheKey) {
        setPortfolio(portfolioCache.data);
        setIsPro(portfolioCache.data?.plan === "pro");
        setLoading(false);
        return;
      }

      if (cacheKey) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          setPortfolio(parsed);
          setIsPro(parsed?.plan === "pro");
          portfolioCache = { key: cacheKey, data: parsed };
          setLoading(false);
          return;
        }
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
  }, [user, url_name, getCacheKey, supabase]);

  useEffect(() => {
    if (!user && !url_name) {
      setLoading(false);
      return;
    }
    fetchPortfolio();
  }, [user, url_name, fetchPortfolio]);

  // Add a function to update portfolio data without refetching
  const updatePortfolioData = async (newData) => {
    // Synchronously update state and cache
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
    // Invalidate public cache for /portfolio/[url_name]
    let urlName = null;
    if (user?.url_name) {
      urlName = user.url_name;
    } else if (user?.id) {
      const { data: userData } = await supabase
        .from("users")
        .select("url_name")
        .eq("clerk_id", user.id)
        .single();
      urlName = userData?.url_name;
    }
    if (urlName) {
      const publicCacheKey = `portfolio_cache_url_${urlName}`;
      localStorage.removeItem(publicCacheKey);
      if (portfolioCache && portfolioCache.key === publicCacheKey) {
        portfolioCache = null;
      }
    }
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
