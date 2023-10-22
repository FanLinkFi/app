;; Shareholders related maps and variables
(define-data-var last-channel-share-id uint u0)
(define-constant PLATFORM_ADDRESS 'ST2TVZNXB4D4NCFXJ34FJ283G0JVQJMS2HBYG75W)

(define-map channel-shareholders
   { channel-id: uint, owner: principal }
   { percentage: uint }
)

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

(define-private (adjust-shareholder-percentage (channel-id uint) (shareholder principal) (amount uint))
    (let ((current-percentage (default-to u0 (get percentage (map-get? channel-shareholders { channel-id: channel-id, owner: shareholder })))))
        (map-set channel-shareholders 
                { channel-id: channel-id, owner: shareholder }
                { percentage: (+ current-percentage amount) })
    )
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
