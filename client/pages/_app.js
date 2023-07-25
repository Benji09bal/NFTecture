import '../styles/globals.css'
import Link from 'next/link'
import '../styles/globals.css';


function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-image">
    <nav className="border-b p-4">
      <Link href="/index.js">
        <p className="text-6xl font-bold text-red cursor-pointer">NFTecture.</p>
      </Link>
        <p className="text-6xl font-bold text-white my-paragraph">La plateforme qui encapsule l'architecture</p>
        <div className="flex mt-2">
          <Link href="/" className="mr-8 text-teal-400">
              Tous les NFTs
          </Link>
          <Link href="/create-and-list-nft" className="mr-8 text-teal-400">
             Créer / lister mes créations  
          </Link>
          <Link href="/my-nfts" className="mr-8 text-teal-400">
             Ma collection
          </Link>
          <Link href="/my-listed-nfts" className="mr-8 text-teal-400">
              Ma galerie de vente
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
