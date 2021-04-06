// File: ./src/flow/is-setup.script.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function isSetup(address) {
  if (address == null)
    throw new Error("isSetup(address) -- address required")

  return fcl
    .send([
      fcl.script`
        import Pixori from 0xdb16a5e14c410280

        pub fun main(address: Address): Bool {
          return Pixori.check(address)
        }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode)
}