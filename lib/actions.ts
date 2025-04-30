"use server"

import { cookies } from "next/headers"

type GameResult = {
  game: string
  result: string
}

export async function saveGameResult(result: GameResult) {
  try {
    // Get user ID from cookies or create a new one
    const cookieStore = await cookies();
    let userId = cookieStore.get("userId")?.value

    if (!userId) {
      userId = Math.random().toString(36).substring(2, 15)
      cookieStore.set("userId", userId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      })
    }

    // In a real app, you would save this to a database
    console.log(`Saved game result for user ${userId}: ${result.game} - ${result.result}`)

    // For now, we're just logging the result
    // In a real implementation, you would use your database integration to store this data

    return { success: true }
  } catch (error) {
    console.error("Error saving game result:", error)
    return { success: false, error: "Failed to save game result" }
  }
}
