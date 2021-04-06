// File: ./src/setup-init-cluster.js

import {useEffect} from "react"
import {useCurrentUser} from "./hooks/current-user"
import {useSetup} from "./hooks/setup"

const fmtBool = bool => (bool ? "yes" : "no")

export function SetupInitCluster({address}) {
  const cu = useCurrentUser()
  const init = useSetup(address) 
  useEffect(() => init.check(), [address]) //

  if (address == null) return null

  return (
    <div>
      <h3>Setup?: {address}</h3>
      <ul>
        <li>
          <strong>Profile: </strong>
          {init.isIdle && <span>{fmtBool(init.set)}</span>}
          {!init.set && cu.addr === address && init.isIdle && (
            <button disabled={init.isProcessing} onClick={init.exec}>
              Setup Account
            </button>
          )}
          {init.isProcessing && <span>PROCESSING</span>}
        </li>
      </ul>
    </div>
  )
}
