import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import type { paths } from './api-schema'
export const apiclient = createFetchClient<paths>({ baseUrl: '/api/v1/' })
export const api = createClient(apiclient)
