import SpotifySignInButton from "./components/spotifyButton";
import LogoutButton from "./components/logoutButton";
import { auth } from "auth/auth";

export default async function Home() {
  const session = await auth();
  console.log(session)
  return (
    <div className="w-3/5 flex flex-col m-auto space-y-8 items-center">
      <div className="mt-20 space-y-4 font-mono">
        <h1 className="text-3xl font-bold">
          Welcome to triptuned
        </h1>
        <p className="mb-3 text-left text-white-500 dark:text-white-400 leading-wide">
          Ever wanted to create spotify playlist for a drive you are planning? It could be a drive to work, home or even a cross country trip with your friends. 
        </p>

        <p className="mb-3 text-left text-white-500 dark:text-white-400 leading-wide">
          We have you covered! For starters just login to your spotify account below and follow next steps.
        </p>

      </div>
      { session === null ? <SpotifySignInButton /> : <LogoutButton></LogoutButton>}
    </div>
  );
}
