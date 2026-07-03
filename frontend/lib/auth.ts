import { getServerSession } from "next-auth"

export async function getSession() { return await getServerSession() }
export async function getCurrentUser() { const s = await getSession(); return s?.user }
export async function getAccessToken() { const s = await getSession(); return (s as any)?.accessToken }