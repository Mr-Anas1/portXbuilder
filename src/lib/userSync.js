export const syncUserData = async (clerkUser) => {
  if (!clerkUser) {
    console.error("No clerkUser provided to syncUserData");
    return null;
  }

  try {
    const response = await fetch("/api/sync-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clerkUser),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error syncing user:", error);
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error in syncUserData:", error);
    return null;
  }
};
