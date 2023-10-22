import { videos } from '@/utils/db'

type NFT = {
  id: string;
  title: string;
  image: string;
}

console.log(videos)
const mockNFTs: NFT[] = [videos[0]]

const MyWallet: React.FC = () => (
  <div className="p-4">
    <h1 className="text-xl font-semibold mb-6">My NFTs</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {mockNFTs.map((nft) => (
        <div key={nft.id} className="border rounded overflow-hidden">
          <img src={nft.image} alt={nft.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="font-medium truncate">{nft.title}</h2>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default MyWallet
