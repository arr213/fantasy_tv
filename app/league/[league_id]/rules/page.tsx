

export default function RulesPage() {

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Fantasy Survival Explainer / FAQ</h1>
            <p className="mb-4">Welcome to the Big Brother Fantasy League! Get ready to test your prediction skills and enjoy the excitement of Big Brother with your friends. This year, the league will follow "survivor" rules, modeled after a fantasy football survivor league. Here's everything you need to know to get started:</p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">How It Works</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Weekly Submissions:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>Each week, you'll submit the name of one houseguest who you believe will <strong>NOT</strong> be evicted that week.</li>
                <li>Submissions are due before the live eviction episode (usually every Thursday) for the following round. You are predicting 1-week in advance.</li>
                <li>Submissions are locked before knowing the results of the HOH competition or who was evicted in the previous round.</li>
                <li>The first safe-from-eviction guess is due 7/25 right before the episode of the eviction starts. This week is an exception. You have more time to decide because we didn't know the cast earlier.</li>
                <li>The second safe-from-eviction guess is also due on 7/25 right before the first live-eviction episode.</li>
                <li>The third safe-from-eviction guess is due on 8/1, at the start of the 2nd live eviction episode. You will always be guessing 1-week in advance.</li>
                <li>You can order your lineup so that future houseguest submissions follow the order you set.</li>
                <li>If you don't update your lineup, the next person in line will automatically be submitted for the following week.</li>
                <li>Lineups are locked at the beginning of the live eviction episode. Changes made after the live episode starts may not take effect.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Survival:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>If your chosen houseguest is not evicted, your team survives for another week and remains in the running to win the main prize pot.</li>
                <li>If your chosen houseguest is evicted, your team is out for the season. However, you can still submit guesses each week for a chance to win the consolation prize.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">No Repeats:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>You cannot choose a houseguest more than once. After you have used a player, you can't pick them again for the rest of the season.</li>
                <li>You may run out of options if your remaining players have already been evicted.</li>
                <li>Later in the game, you will need to have players left in order to continue competing. So if you think a player will last long in the game, don't choose them too early.</li>
                <li>The most ideal situation is when a player gets evicted one round after you have chosen them. That way you will still have the most players to choose from later in the game.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Shoot the Moon:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>After a single strike, you are out of the running for the main prize, but you can compete for the consolation prize.</li>
                <li>Each week, you will continue to submit guesses for who is "safe-from-eviction." If you guess the evicted houseguest the most times, you will earn your entry fee back.</li>
                <li>If a team has no players left to submit, it will not be counted as a point towards the </li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Entry Fee and Prize:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>The entry fee is $20.</li>
                <li>There is a $20 consolation prize for the team that makes the most strikes (i.e., submits the player who gets evicted the most number of times). If there is a tie, the prize will be split.</li>
                <li>The remaining prize pot will be split among the people who last the longest in the league. If more than one team ties for the longest weeks without a single strike, those teams will split the pot evenly.</li>
            </ul>
        
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Winner Determination:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>The team that lasts the longest without being eliminated wins the main prize.</li>
                <li>The team with the most strikes wins the consolation prize.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Example Cases</h2>

            <h3 className="text-xl font-semibold mt-4 mb-2">Example 1:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>Week 1: You choose Houseguest A. Houseguest A is not evicted. Your team survives.</li>
                <li>Week 2: You choose Houseguest B. Houseguest B is evicted. Your team is out for the season.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Example 2:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>Week 1: You choose Houseguest A. Houseguest A is not evicted. Your team survives.</li>
                <li>Week 2: You choose Houseguest C. Houseguest C is not evicted. Your team survives.</li>
                <li>Week 3: You choose Houseguest D. Houseguest D is evicted. Your team is out for the season from the main prize. You now aim for making the most strikes.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Example 3 (Consolation Prize):</h3>
            <ul className="list-disc list-inside mb-4">
                <li>Week 1: You choose Houseguest E. Houseguest E is evicted. Strike count: 1.</li>
                <li>Week 2: You choose Houseguest F. Houseguest F is evicted. Strike count: 2.</li>
                <li>Week 9: You choose Houseguest G. Houseguest G is evicted. Strike count: 6.</li>
                <li>Week 10: You have no players left to choose. Strike count remains 6.</li>
                <li>You win the consolation prize for having the most strikes.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Frequently Asked Questions</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">What if a player wins their way back into the house?</h3>
            <p className="mb-4">Once a player is eliminated, the teams that do not survive that round will not be brought back if the player returns.</p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">What counts as an eviction?</h3>
            <ul className="list-disc list-inside mb-4">
                <li>If a player quits or otherwise leaves the game, it counts as an eviction and one round of the fantasy league.</li>
                <li>If a player leaves the house by stepping out the front door, they are eliminated.</li>
                <ul className="list-disc list-inside ml-6">
                <li>Example: Jax was voted out in season 25, but the eviction vote was canceled before he stepped out of the house. This would not count as an elimination.</li>
                <li>Example: Victor was evicted, then won his way back into the house in a battle-back competition. His earlier eviction still counts in our league.</li>
                </ul>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">What if someone quits mid-week?</h3>
            <p className="mb-4">If someone quits in the middle of the week, for example during the first HOH, it counts as the first eviction. The person evicted at the end of the week will then count as the 2nd evicted. You are just guessing the order they leave the game. Whenever someone leaves, it will be compared against your lineup at the time of the previous live-episode.</p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Contact Us</h3>
            <p className="mb-4">For any questions or more information, please contact us at <a href="mailto:contact@fantasybigbrother.com" className="text-blue-500">contact@fantasybigbrother.com</a>.</p>
        </div>

    )
}