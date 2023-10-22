(define-data-var last-video-nft-id uint u0)
(define-data-var last-channel-share-id uint u0)

(define-constant PLATFORM_ADDRESS 'ST2TVZNXB4D4NCFXJ34FJ283G0JVQJMS2HBYG75W)

(define-map channel-shareholders
   { channel-id: uint, owner: principal }
   { percentage: uint }
)

(define-map channel-shares
   { channel-id: uint, share-id: uint }
   { price: uint, creator: principal, owner: (optional principal) }
)

(define-read-only (get-last-video-nft-id)
    (var-get last-video-nft-id)
)

(define-read-only (get-last-channel-share-id)
    (var-get last-channel-share-id)
)

(define-private (increment-video-nft-id)
    (var-set last-video-nft-id (+ (var-get last-video-nft-id) u1))
)

(define-private (increment-channel-share-id)
    (var-set last-channel-share-id (+ (var-get last-channel-share-id) u1))
)

;; REGISTER AS SHAREHOLDER

(define-public (register-interest (channel-id uint))
    (if (is-some (map-get? channel-shareholders { channel-id: channel-id, owner: tx-sender }))
        (err "Already registered as a shareholder for this channel")
        (begin
            (map-insert channel-shareholders 
                        { channel-id: channel-id, owner: tx-sender }
                        { percentage: u0 })
            (ok tx-sender)
        )
    )
)


;; ADJUSTING SHAREHOLDERS PERCENTAGES

(define-private (adjust-shareholder-percentage (channel-id uint) (shareholder principal) (amount uint))
    (let ((current-percentage (default-to u0 (get percentage (map-get? channel-shareholders { channel-id: channel-id, owner: shareholder })))))
        (map-set channel-shareholders 
                { channel-id: channel-id, owner: shareholder }
                { percentage: (+ current-percentage amount) })
    )
)

;; TRANSFER FUNDS
(define-private (credit-tx-sender (amount uint))
    (as-contract (stx-transfer? amount tx-sender PLATFORM_ADDRESS))
)

;; BUYING CHANNEL SHARES
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



;; SELLING CHANNEL SHARES

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





;; Define a result type to keep track of the process
(define-private (shareholder-payment-result (successful bool) (message (optional (string-ascii 100))))
    {
        successful: successful,
        message: message
    }
)

(define-private (process-shareholder 
                 (current-result (tuple (result shareholder-payment-result) (amt uint)))
                 (share-data (tuple (owner principal) (percentage uint))))
    ;; Extract the accumulator result and amount
    (let ((acc-result (get result current-result))
          (amount (get amt current-result)))
        ;; Check if the previous shareholder payment was successful
        (if (get successful acc-result)
            (let ((shareholder (get owner share-data))
                  (percentage (get percentage share-data))
                  (payment-amount (* (/ percentage u100) amount)))
                
                (if (is-ok (stx-transfer? payment-amount tx-sender shareholder))
                    current-result ;; Continue with next shareholder
                    (tuple (result (shareholder-payment-result false (some "Failed to pay a shareholder"))) (amt amount)))
            )
            ;; If previous payment failed, return the failed result
            current-result
        )
    )
)

(define-public (start-paying-shareholders 
                (shareholders (list 10 (tuple (owner principal) (percentage uint))))
                (amount uint))
    (let ((result (fold process-shareholder shareholders (tuple (result (shareholder-payment-result true none)) (amt amount)))))
        (if (get successful (get result result))
            (ok true)
            (err (unwrap-panic (get message (get result result))))
        )
    )
)

(define-private (distribute-to-shareholders (channel-id uint) (amount uint))
    ;; Fetch the shareholders of a channel
    (let ((shareholders (fetch-shareholders channel-id)))
        ;; Begin paying each shareholder using the `start-paying-shareholders` function
        (match (start-paying-shareholders shareholders amount)
            success (ok true) ;; Successfully distributed to all shareholders
            err-message (err err-message) ;; An error occurred during distribution
        )
    )
)

(define-private (fetch-shareholders (channel-id uint))
    (map-get? channel-shareholders { channel-id: channel-id })
)

;; UPDATE PRICES
(define-public (update-video-nft-price (video-id uint) (new-price uint))
    (let ((nft (unwrap-panic (map-get? video-nfts { video-id: video-id }))))
        (if (is-eq tx-sender (get creator nft))
            (begin
                (map-set video-nfts { video-id: video-id } 
                    { nft-id: (get nft-id nft), 
                      price: new-price, 
                      creator: (get creator nft), 
                      owner: (get owner nft), 
                      video-link: (get video-link nft) })
                (ok new-price)
            )
            (err "Only the creator can update the price")
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

;; TRANSFERING OWNERSHIP
(define-public (transfer-video-nft (video-id uint) (recipient principal))
    (let ((nft (unwrap-panic (map-get? video-nfts { video-id: video-id }))))
        (if (is-eq tx-sender (get owner nft))
            (begin
                (map-set video-nfts { video-id: video-id } 
                    { nft-id: (get nft-id nft), 
                      price: (get price nft), 
                      creator: (get creator nft), 
                      owner: recipient, 
                      video-link: (get video-link nft) })
                (ok recipient)
            )
            (err "Only the owner can transfer the NFT")
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