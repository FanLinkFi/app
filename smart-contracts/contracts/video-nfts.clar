;; Implementing the SIP009 trait for NFT
(impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.nft-trait.nft-trait)

;; Declare the NFT for videos
(define-non-fungible-token VIDEO-NFT uint)

;; Other data vars and constants
(define-data-var last-video-nft-id uint u0)
(define-constant PLATFORM_ADDRESS 'ST2TVZNXB4D4NCFXJ34FJ283G0JVQJMS2HBYG75W)

;; Map to store video metadata and prices
(define-map video-metadata
    { video-id: uint }
    {
      price: uint,
      creator: principal,
      video-link: (string-ascii 256)
    }
)

(define-read-only (get-last-video-nft-id)
    (var-get last-video-nft-id)
)

(define-private (increment-video-nft-id)
    (var-set last-video-nft-id (+ (var-get last-video-nft-id) u1))
)

;; Minting a new Video NFT
(define-public (mint-video-nft (video-link (string-ascii 256)) (price uint))
  (let ((next-id (nft-get-next-token-id VIDEO-NFT)))
    (begin
      (map-insert video-metadata { video-id: next-id } { price: price, creator: tx-sender, video-link: video-link })
      (nft-mint? VIDEO-NFT next-id tx-sender))))

;; Update video NFT price
(define-public (update-video-nft-price (video-id uint) (new-price uint))
  (let ((nft-data (unwrap-panic (map-get? video-metadata { video-id: video-id })))
        (nft-owner (nft-get-owner? VIDEO-NFT video-id)))
    (if (and (is-eq tx-sender nft-owner) (is-eq tx-sender (get creator nft-data)))
      (begin
        (map-set video-metadata 
          { video-id: video-id } 
          { price: new-price, creator: (get creator nft-data), video-link: (get video-link nft-data) })
        (ok new-price))
      (err "Only the creator can update the price"))))

;; Transfer video NFT to a specified principal
(define-public (transfer-video-nft (video-id uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (nft-get-owner? VIDEO-NFT video-id)) (err u403))
    (nft-transfer? VIDEO-NFT video-id tx-sender recipient)))
