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
- `/goal add [title] [description?] [is_daily? DEFAULT=FALSE] [frequency?]` - set your own goals 
- `/goal list [user?]` - see a list of your (or someone else's) goals
-  `/goal remove [title]` - remove a goal
- `/fail [goal title]` - admit to a goal failure

### Punishments
- `/punishment suggest [description]`- suggest a punishment 
- `/punishment second [description]` - second a punishment (entering it into the roster) 
- `/punishment remove [description]` - remove a suggested punishment 
- `/punishment list [scope=roster|mine|all]` - list punishments (in the roster, your pending, or all pending) 
- `/forgive [failure description]` - forgive another user's failure (requires 3 forgives before clearing the punishment)
- `/resolve [punishment description]` - mark one of your punishments as resolved after completing 

### Tracking
- `/progress` - see the progress of your tracked goals 
- `/done dailies` - add 1 completion to all of your daily goals 
- `/done goal [title] [count]` - increment completions for a goal 

### Groups
- `/group init` - create a group 
- `/group join [group]` - join a group 
- `/group start [date]` - set a start date for the group 
- `/countdown` - see how much time until/is remaining in your group's challenge 

#### Backlog
- Automate failures for missing target goal metrics
- Progress summary view to see all group members' streaks
