'use client'

import {
  Card, CardContent, CardActions, CardMedia, Button, Grid, Typography
} from '@mui/material'
import { Box } from '@mui/system'
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  bufferCVFromString
} from '@stacks/transactions'
import { StacksTestnet, StacksMainnet } from '@stacks/network'

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
    // for mainnet, use `StacksMainnet()`
    const network = new StacksTestnet()

    // Add an optional post condition
    // See below for details on constructing post conditions
    const postConditionAddress = 'SP2ZD731ANQZT6J4K3F5N8A40ZXWXC1XFXHVVQFKE'
    const postConditionCode = FungibleConditionCode.GreaterEqual
    const postConditionAmount = 1000000n
    const postConditions = [
      makeStandardSTXPostCondition(postConditionAddress, postConditionCode, postConditionAmount)
    ]

    const txOptions = {
      contractAddress: 'SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X',
      contractName: 'contract_name',
      functionName: 'contract_function',
      functionArgs: [bufferCVFromString(video)],
      senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
      validateWithAbi: true,
      network,
      postConditions,
      anchorMode: AnchorMode.Any
    }

    const transaction = await makeContractCall(txOptions)

    const broadcastResponse = await broadcastTransaction(transaction, network)
    const txId = broadcastResponse.txid
  }

  return (
    <Grid container spacing={3}>
      {videos.map((video) => (
        <Grid item xs={12} sm={6} md={4} key={video.id}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={video.image}
              alt={video.title}
              title={video.title}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {video.title}
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary" component="p">
                  Price:
                  {video.price}
                  {' '}
                  STX
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Views:
                  {' '}
                  {video.views}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Likes:
                  {' '}
                  {video.likes}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" fullWidth onClick={() => buyNFT(video)}>
                Buy NFT
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default FanVideoGrid
