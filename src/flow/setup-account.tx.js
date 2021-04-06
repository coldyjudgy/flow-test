// File: ./src/flow/setup-account.tx.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function setupAccount() {
  const txId = await fcl
    .send([
      // Transactions use fcl.transaction instead of fcl.script
      // Their syntax is a little different too
      fcl.transaction`
        import Pixori from 0xdb16a5e14c410280

        transaction {
          // We want the account's address for later so we can verify if the account was initialized properly
          let address: Address


          prepare(account: AuthAccount) {
            // save the address for the post check
            self.address = account.address

            let collection <- ExampleNFT.createEmptyCollection()

            // Only initialize the account if it hasn't already been setup
            if (!Pixori.check(self.address)) {
             account.save<@ExampleNFT.Collection>(<-collection, to: /storage/NFTCollection)
             account.link<&{ExampleNFT.NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)
             }
          }

          // verify that the account has been initialized
          post {
            Pixori.check(self.address): "Account was not setup"
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