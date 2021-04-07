// File: ./src/hooks/setup.js

import {atomFamily, useRecoilState} from "recoil"
import {isSetup} from "../flow/is-setup.script"
import {setupAccount} from "../flow/setup-account.tx"

const IDLE = "IDLE"
const PROCESSING = "PROCESSING"

// atomFamily is a function that returns a memoized function
// that constructs atoms. This will allow us to define the
// behaviour of the atom once and then construct new atoms
// based on an id (in this case the address)
const $setup = atomFamily({
  key: "SETUP::PIXORI::STATE",
  default: null,
})

const $setupStatus = atomFamily({
  key: "SETUP::PIXORI::STATUS",
  default: PROCESSING,
})

export function useSetup(address) {
  const [set, setSetup] = useRecoilState($setup(address))
  const [status, setStatus] = useRecoilState($setupStatus(address))

  // check if the supplied address is initialized
  async function check() {
    setStatus(PROCESSING)
    // isInitialized is going to throw an error if the address is null
    // so we will want to avoid that. Because React hooks can't be 
    // dynamically added and removed from a React node, you will find that 
    // this sort of logic will leak into our hooks. We could get around this
    // by changing our isInitialized function to return null instead of 
    // throwing an error.
    if (address != null) await isSetup(address).then(setSetup)
    setStatus(IDLE)
  }

  // attempt to initialize the current address
  async function exec() {
    setStatus(PROCESSING)
    await setupAccount()
    setStatus(IDLE)
    await check()
  }

  return {
    set,
    check,
    exec,
    isIdle: status === IDLE,
    isProcessing: status === PROCESSING,
    status,
    IDLE,
    PROCESSING,
  }
}