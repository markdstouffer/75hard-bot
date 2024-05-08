# 75HARD Discord Bot
A project to support my server (theoretically applicable to any server) in our self-improvement goals. 
[75 HARD](https://andyfrisella.com/pages/75hard-info) is a 75 day "mental toughness" program which challenges its
participants to complete daily physical and mental exercises. It's a very demanding and strict program, demanding the participant
restart the 75 days entirely if they fail one day. 

This bot supports a more personalized and lenient program:
Users may set their own list of goals and update them within a 2-week (to be implemented) leniency period.
The group may create their own list of "punishments", incentivizers for a participant to not fail a goal.
If a goal is failed (`/fail`), a random punishment from the list is selected and announced.
To allow for extenuating circumstances, a group (3+ approvals) may forgive (`/forgive`) a failure and the punishment is cleared.

### Goals
- Set your own goals with `/goal add [title] [description?] [is_daily? DEFAULT=TRUE]`
- See a list of your (or someone else's) goals with `/goal list [user?]`
- Remove a goal with `/goal remove [title]`
- Admit to a goal failure with `/fail [goal title]`

### Punishments
- Suggest a punishment with `/punishment suggest [description]`
- Second a punishment (entering it into the roster) with `/punishment second [description]`
- Remove a suggested punishment with `/punishment remove [description]`
- Forgive another user's failure with `/forgive [failure description]` (requires 3 forgives before clearing the punishment)



#### Backlog
- Implement goal tracking
  - Allow users to enter in goal metrics (e.g. 'completed 5 HIIT workouts this week')
  - Automate failures for missing their target metrics
- Progress commands
  - Dependent on above goal tracking
  - See your own & others' progress on goals
  - Summary view to see all group members' streaks
