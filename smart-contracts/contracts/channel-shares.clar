;; Channel Shares related variables
(define-data-var last-channel-share-id uint u0)
(define-constant PLATFORM_ADDRESS 'ST2TVZNXB4D4NCFXJ34FJ283G0JVQJMS2HBYG75W)

(define-map channel-shares
   { channel-id: uint, share-id: uint }
   { price: uint, creator: principal, owner: (optional principal) }
)

(define-constant SHARE_PRICE 1000000) ;; 1M microSTX for simplicity
(define-constant SHARE_PERCENTAGE 1)

(define-public (buy-channel-share (channel-id uint) (share-id uint))
    (let ((share (unwrap-panic (map-get? channel-shares { channel-id: channel-id, share-id: share-id }))))
        (if (is-eq (get price share) SHARE_PRICE)
            (begin
                (stx-transfer? (* PLATFORM_FEE_PERCENTAGE SHARE_PRICE) tx-sender PLATFORM_ADDRESS)
                (stx-transfer? (- SHARE_PRICE (* PLATFORM_FEE_PERCENTAGE SHARE_PRICE)) tx-sender (get creator share))
                (adjust-shareholder-percentage channel-id tx-sender SHARE_PERCENTAGE)
                (map-set channel-shares { channel-id: channel-id } 
                        { share-id: (get share-id share), 
                          price: (get price share), 
                          creator: (get creator share), 
                          owner: tx-sender })
                (ok tx-sender)
            )
            (err "Incorrect share price")
        )
    )
)

(define-public (sell-channel-share (channel-id uint))
    (let ((share (unwrap-panic (map-get? channel-shares { channel-id: channel-id }))))
        (if (and (is-eq (get owner share) tx-sender) (> (get percentage (map-get? channel-shareholders { channel-id: channel-id, owner: tx-sender })) u0))
            (begin
                (adjust-shareholder-percentage channel-id tx-sender (- SHARE_PERCENTAGE))
                (credit-tx-sender (* SHARE_PRICE (- u100 PLATFORM_FEE_PERCENTAGE)))
                (map-set channel-shares { channel-id: channel-id } 
                        { share-id: (get share-id share), 
                          price: (get price share), 
                          creator: (get creator share), 
                          owner: none }) ;; Marking the share as available
                (ok tx-sender)
            )
            (err "Either not an owner or no shares left to sell")
        )
    )
)

(define-public (update-channel-share-price (channel-id uint) (new-price uint))
    (let ((share (unwrap-panic (map-get? channel-shares { channel-id: channel-id }))))
        (if (is-eq tx-sender (get creator share))
            (begin
                (map-set channel-shares { channel-id: channel-id } 
                    { share-id: (get share-id share), 
                      price: new-price, 
                      creator: (get creator share), 
                      owner: (get owner share) })
                (ok new-price)
            )
            (err "Only the creator can update the price")
        )
    )
)

(define-public (transfer-channel-share (channel-id uint) (recipient principal))
    (let ((share (unwrap-panic (map-get? channel-shares { channel-id: channel-id }))))
        (if (is-eq tx-sender (get owner share))
            (begin
                (map-set channel-shares { channel-id: channel-id } 
                    { share-id: (get share-id share), 
                      price: (get price share), 
                      creator: (get creator share), 
                      owner: recipient })
                (ok recipient)
            )
            (err "Only the owner can transfer the share")
        )
    )
)