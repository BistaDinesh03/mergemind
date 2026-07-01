import { getServerSession } from "next-auth"

export async function getSession() {
  return await getServerSession()
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function getAccessToken() {
  const session = await getSession()
  return session?.accessToken
}
