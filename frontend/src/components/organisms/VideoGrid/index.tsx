'use client'

import { openContractCall } from '@stacks/connect'
import {
  AnchorMode,
  broadcastTransaction,
  bufferCVFromString,
  FungibleConditionCode,
  makeContractCall,
  makeStandardSTXPostCondition,
  stringUtf8CV
} from '@stacks/transactions'
import { StacksMainnet, StacksTestnet } from '@stacks/network'

interface Video {
  id: string;
  title: string;
  image: string;
  price: number;
  views: number;
  likes: number;
}

interface FanVideoGridProps {
  videos: Video[];
  onBuyClick?: (video: Video) => void;
}

const FanVideoGrid: React.FC<FanVideoGridProps> = ({ videos, onBuyClick }) => {
  async function buyNFT(video: string) {
    const network = new StacksTestnet()

    try {
      const options = {
        contractAddress: 'ST12KGMZCKXERR1VG1TFEQQZ3VQXSMVVC3J31S604',
        contractName: 'nft-factory',
        functionName: 'claim',
        functionArgs: [],
        network,
        onFinish: ({ txId }) => console.log(txId)
      }

      await openContractCall(options)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="rounded shadow-lg overflow-hidden">
          <img src={video.image} alt={video.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h6 className="font-semibold mb-2">{video.title}</h6>
            <p className="text-gray-500 text-sm mb-1">
              Price:
              {' '}
              {video.price}
              {' '}
              STX
            </p>
            <p className="text-gray-500 text-sm mb-1">
              Views:
              {' '}
              {video.views}
            </p>
            <p className="text-gray-500 text-sm mb-2">
              Likes:
              {' '}
              {video.likes}
            </p>
            <button onClick={() => buyNFT(video)} className="w-full py-2 px-4 bg-blue-600 text-white rounded mt-2 hover:bg-blue-700">
              Buy NFT
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FanVideoGrid
