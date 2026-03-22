import api from "./axios"

export type TraceabilityRecordStatus = 'pending' | 'signing' | 'confirmed'

export interface TraceabilityRecord {
  id: string
  userId: string
  productId: string | null
  client: string
  batchId: string
  shipmentId: string
  slaughterDate: string | null
  guideId: string | null
  imageUrl: string | null
  documentUrl: string | null
  status: TraceabilityRecordStatus
  createdAt: string
  updatedAt: string
}

export interface TraceabilityRecordListResponse {
  records: TraceabilityRecord[]
  total: number
}

export interface CreateTraceabilityRecordBody {
  client: string
  batchId: string
  shipmentId: string
  slaughterDate?: string | null
  guideId?: string | null
  productId?: string | null
  imageUrl?: string | null
  documentUrl?: string | null
  ipfsHash?: string | null
}

export interface UpdateTraceabilityRecordBody {
  client?: string
  batchId?: string
  shipmentId?: string
  slaughterDate?: string | null
  guideId?: string | null
}

const LOCAL_REGISTROS_KEY = 'registros-cache'

export async function getRegistros(params?: {
  take?: number
  skip?: number
  status?: TraceabilityRecordStatus
  productId?: string
}): Promise<TraceabilityRecordListResponse> {
  const searchParams = new URLSearchParams()
  if (params?.take != null) searchParams.set('take', String(params.take))
  if (params?.skip != null) searchParams.set('skip', String(params.skip))
  if (params?.status) searchParams.set('status', params?.status)
  if (params?.productId) searchParams.set('productId', params?.productId)
  const query = searchParams.toString()
  const url = query ? `/traceability/registros?${query}` : '/traceability/registros'

  try {
    const res = await api.get<TraceabilityRecordListResponse>(url)
    // cache successful response to local storage for offline use
    try {
      localStorage.setItem(LOCAL_REGISTROS_KEY, JSON.stringify(res.data))
    } catch { }
    return res.data
  } catch (err) {
    // fallback to cached data if available
    try {
      const cached = localStorage.getItem(LOCAL_REGISTROS_KEY)
      if (cached) {
        return JSON.parse(cached) as TraceabilityRecordListResponse
      }
    } catch { }
    throw err
  }
}

export async function createRegistro(body: CreateTraceabilityRecordBody): Promise<TraceabilityRecord> {
  const res = await api.post<TraceabilityRecord>('/traceability/registros', body)
  const record = res.data
  // also update cache so new entry appears offline
  try {
    const cachedJson = localStorage.getItem(LOCAL_REGISTROS_KEY)
    if (cachedJson) {
      const cache: TraceabilityRecordListResponse = JSON.parse(cachedJson)
      cache.records.unshift(record)
      cache.total = cache.records.length
      localStorage.setItem(LOCAL_REGISTROS_KEY, JSON.stringify(cache))
    }
  } catch { }
  return record
}

export async function updateRegistro(
  id: string,
  body: UpdateTraceabilityRecordBody
): Promise<TraceabilityRecord> {
  const res = await api.patch<TraceabilityRecord>(`/traceability/registros/${id}`, body)
  return res.data
}
