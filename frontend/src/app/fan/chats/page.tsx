'use client'

import { faker } from '@faker-js/faker'
import { useState } from 'react'

interface Creator {
  id: string;
  name: string;
  avatarUrl: string;
}

// Generate a list of creators using faker
const generateCreators = (count: number) => {
  const creators = []
  for (let i = 0; i < count; i++) {
    creators.push({
      id: faker.string.uuid(),
      name: faker.internet.displayName(),
      avatarUrl: faker.image.avatar()
    })
  }
  return creators
}

const creators = generateCreators(10)

const CreatorsTab: React.FC = () => {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)

  return (
    <div className="flex">
      <ul className="w-72 border-r border-gray-200">
        {creators.map((creator) => (
          <li key={creator.id} onClick={() => setSelectedCreator(creator)} className="cursor-pointer hover:bg-gray-100 px-4 py-2 flex items-center">
            <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full mr-4" />
            <span>{creator.name}</span>
          </li>
        ))}
      </ul>

      {selectedCreator && (
        <div className="flex-1 p-4">
          <h6 className="font-semibold mb-4">
            Group Chat with
            {' '}
            {selectedCreator.name}
          </h6>
          <div className="border border-gray-200 rounded p-4 mb-4" style={{ height: '400px' }}>
            {/* Placeholder for chat messages */}
          </div>
          <div className="border-t border-gray-200 pt-4 flex items-center">
            <input type="text" placeholder="Type your message…" className="flex-grow px-4 py-2 mr-4 border rounded focus:outline-none focus:border-blue-500" />
            <button className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
              <i className="fas fa-paper-plane" />
              {' '}
              {/* You can use Font Awesome or any other icon library */}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatorsTab
