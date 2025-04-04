import Landing from './(nondashboard)/landing/page'
import Navbar from "@/components/Navbar"
import { NAVBAR_HEIGHT } from "@/lib/constants"

export default function Home() {
  return <div className='h-full w-full'>
      <Navbar />
      <main className={`h-full flex w-full flex-col`} style={{paddingTop: `${NAVBAR_HEIGHT}px`}}>
        <Landing />
      </main>
    </div>
}
