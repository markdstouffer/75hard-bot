export type CompleteProgress = {
    completions: number
    goal_id: number
    id: number
    user_id: number
    week_start: string
    goals: {
        title: string
        frequency: number | null
    }
    users: { discord_id: string }
}