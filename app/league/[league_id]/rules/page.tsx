

export default function RulesPage() {

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Fantasy Survival Explainer / FAQ</h1>
            <p className="mb-4">Welcome to the Big Brother Fantasy League! Get ready to test your prediction skills and enjoy the excitement of Big Brother with your friends. This year, the league will follow "survivor" rules, modeled after a fantasy football survivor league. Here's everything you need to know to get started:</p>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">How It Works</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Weekly Submissions:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>Each week, you'll submit the name of one houseguest who you believe will <strong>NOT</strong> be evicted that week.</li>
                <li>Submissions are due before the live eviction episode (usually every Thursday) for the following round.</li>
                <li>Submissions are locked before knowing the results of the HOH competition or who was evicted in the previous round.</li>
                <li>The first safe-from-eviction guess is due when the premiere starts.</li>
                <li>The second safe-from-eviction guess is due on the night of the first live eviction at the start of the live eviction.</li>
                <li>You can order your lineup so that future houseguest submissions follow the order you set.</li>
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
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Shoot the Moon:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>After a single mistake, you are out of the running for the main prize, but you can compete for the consolation prize.</li>
                <li>Each week, you will continue to submit guesses for who is "safe-from-eviction." If you guess the evicted houseguest the most times, you will earn your entry fee back.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Entry Fee and Prize:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>The entry fee is $20.</li>
                <li>There is a $20 consolation prize for the team that makes the most mistakes (i.e., submits the player who gets evicted the most number of times). If there is a tie, the prize will be split.</li>
                <li>The remaining prize pot will be split among the people who last the longest in the league. If more than one team ties for the longest weeks without a single mistake, those teams will split the pot evenly.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Additional Features</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Lineup Order:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>You can order your lineup of houseguests. The first person in your lineup will be submitted as your pick for the week.</li>
                <li>If you don't update your lineup, the next person in line will automatically be submitted for the following week.</li>
                <li>Lineups are locked at the beginning of the live eviction episode. Changes made after the live episode starts may not take effect.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Weekly Updates:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>You will receive weekly emails with updates on:</li>
                <ul className="list-disc list-inside ml-6">
                <li>Which teams are still in the running</li>
                <li>Who they have submitted for the upcoming round</li>
                <li>How many players each team has left</li>
                <li>How many mistakes each team has made</li>
                </ul>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Additional Rules</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Mistakes Count:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>Teams that are out of the season can still submit houseguests each week.</li>
                <li>If a team has no players left to submit, it will not be counted as a mistake.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Winner Determination:</h3>
            <ul className="list-disc list-inside mb-4">
                <li>The team that lasts the longest without being eliminated wins the main prize.</li>
                <li>The team with the most mistakes (most evicted houseguests) wins the consolation prize.</li>
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
                <li>Week 3: You choose Houseguest D. Houseguest D is evicted. Your team is out for the season from the main prize. You now aim for making the most mistakes.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Example 3 (Consolation Prize):</h3>
            <ul className="list-disc list-inside mb-4">
                <li>Week 1: You choose Houseguest E. Houseguest E is evicted. Mistake count: 1.</li>
                <li>Week 2: You choose Houseguest F. Houseguest F is evicted. Mistake count: 2.</li>
                <li>Week 9: You choose Houseguest G. Houseguest G is evicted. Mistake count: 6.</li>
                <li>Week 10: You have no players left to choose. Mistake count remains 6.</li>
                <li>You win the consolation prize for having the most mistakes.</li>
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
            <p className="mb-4">If someone quits during the first HOH, it counts as the first eviction. Your second eviction spot will then be locked in as of the premiere. It is advisable to set your team lineup one or two rounds in advance.</p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">Contact Us</h3>
            <p className="mb-4">For any questions or more information, please contact us at <a href="mailto:contact@fantasybigbrother.com" className="text-blue-500">contact@fantasybigbrother.com</a>.</p>
            </div>

    )
}