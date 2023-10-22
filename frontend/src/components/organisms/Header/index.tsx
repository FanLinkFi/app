import Link from 'next/link'
import ConnectWallet from '@/components/molecules/ConnectWallet'
import CustomTabs from './tabs'

type Props = {
  isCreator?: boolean,
}

const Header = ({ isCreator = false }: Props) => (
  <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
    <div className="flex items-center">
      {/* You can replace the <h6> with an <img> for your logo */}
      <h6 className="text-lg font-semibold">
        Your App Logo
      </h6>

      {!isCreator && (
        <div className="ml-4">
          <CustomTabs />
        </div>
      )}
    </div>

    <div className="flex items-center">
      <ConnectWallet isCreator={isCreator} />
    </div>
  </div>
)

export default Header
