import { useClerk } from "@clerk/nextjs";

export default function CustomUserSettings() {
  const { openUserProfile } = useClerk();

  return <button onClick={() => openUserProfile()}>Settings</button>;
}
