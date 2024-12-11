import { signIn, auth, signOut } from "auth/auth"

const Navbar = async () => {
  const session = await auth()

  return (
    <nav className="navbar flex justify-between mt-4 items-center">
        <h1 className="text-[20px] font-mono font-bold">
            triptuned.<span className="text-[#1DB954]">go</span>
        </h1>
        {session === null  
        
        ?

        <form
        action={async () => {
            "use server"
            await signIn("spotify")
        }}
        >
            <button type="submit" className="py-2 px-6 font-mono text-sm font-semibold rounded-full bg-[#1DB954]">Sign in</button>
        </form>

        :

        <form
        action={async () => {
            "use server"
            await signOut()
        }}
        >
            <button type="submit" className="py-2 px-6 font-mono text-sm font-semibold rounded-full bg-red-500">Sign out</button>
        </form>
        }
    </nav>
  )
}

export default Navbar