import { getPayload } from 'payload'

let payloadPromise: ReturnType<typeof getPayload> | undefined

export function getPayloadClient(): ReturnType<typeof getPayload> {
  if (!payloadPromise) {
    payloadPromise = import('@payload-config').then(({ default: config }) => getPayload({ config }))
  }

  return payloadPromise
}
