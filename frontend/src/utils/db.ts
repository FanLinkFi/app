import { faker } from '@faker-js/faker'

const generateFakeVideos = (num: number) => Array.from({ length: num }).map(() => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  image: faker.image.url(),
  nftsBought: faker.number.int({ min: 0, max: 3 }),
  price: faker.number.int({ min: 1, max: 100 }),
  views: faker.number.int({ min: 100, max: 100000 }),
  likes: faker.number.int({ min: 1, max: 100 })
}))

export const videos = generateFakeVideos(5)
