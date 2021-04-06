// File: ./src/flow/setup-account.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function setupAccount() {
  const txId = await fcl
    .send([
      // Transactions use fcl.transaction instead of fcl.script
      // Their syntax is a little different too
      fcl.transaction`
        import Pixori from 0x05f5f6e2056f588b

        transaction {
          prepare(account: AuthAccount) {
   
              let collection <- Pixori.createEmptyCollection()
  
              account.save<@Pixori.Collection>(<-collection, to: /storage/NFTCollection)
              account.link<&{Pixori.NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)
    
          }
      }
      `,
      fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
      fcl.proposer(fcl.authz), // current user acting as the nonce
      fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
      fcl.limit(35), // set the compute limit
    ])
    .then(fcl.decode)

  return fcl.tx(txId).onceSealed()
}