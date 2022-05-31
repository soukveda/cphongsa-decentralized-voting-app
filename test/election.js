var Election = artifacts.require('./Election.sol')

contract('Election', (accounts) => {

    describe('initialization', () => {
        let election;
        
        beforeEach(async () => {
            election = await Election.deployed()
        })
    
        it('initializes with three candidates', async () => {
            const candidateCount = await election.candidatesCount()
            assert.equal(candidateCount, 3)
        })
        
        it('initializes the candidates with the correct values', async () => {
            const [candidate1, candidate2, candidate3] = await Promise.all([election.candidates(1), election.candidates(2), election.candidates(3)])

            // candidate1 assertions
            assert.equal(candidate1[0], 1, "contains the correct id")
            assert.equal(candidate1[1], 'Candidate 1', 'contains the correct name')
            assert.equal(candidate1[2], 0, 'contains the correct votes count')
    
            // candidate2 assertions
            assert.equal(candidate2[0], 2, "contains the correct id")
            assert.equal(candidate2[1], 'Candidate 2', 'contains the correct name')
            assert.equal(candidate2[2], 0, 'contains the correct votes count')
    
            // candidate3 assertions
            assert.equal(candidate3[0], 3, "contains the correct id")
            assert.equal(candidate3[1], 'Candidate 3', 'contains the correct name')
            assert.equal(candidate3[2], 0, 'contains the correct votes count')
        })
    })

    describe('voting function', () => {
        let election;
        
        beforeEach(async () => {
            election = await Election.deployed()
        })

        it('allows a voter to cast a vote', async () => {
            const candidateId = 1
            const receipt = await election.vote(candidateId, { from: accounts[0] })
            
            const voted = await election.voters(accounts[0])
            const candidate = await election.candidates(candidateId)
            const voteCount = candidate[2]
            
            assert.equal(receipt.logs.length, 1, 'an event was triggered')
            assert.equal(receipt.logs[0].event, 'votedEvent', 'the event type is correct')
            assert.equal(receipt.logs[0].args._candidateId, candidateId, 'the candidate id is correct')
            assert(voted, 'the voter was marked as voted')
            assert(voteCount, 1, "increments the candidate's vote count") 
        })

        it('throws an exception for invalid candidates', async () => {
            try {
                await election.vote(99, { from: accounts[1] })
            } catch (error) {
                assert(error.message.indexOf('revert') >= 0, 'error message must contain revert')
            }
            const candidateId1 = 1
            const candidateId2 = 2
            const [candidate1, candidate2] = await Promise.all([election.candidates(candidateId1), election.candidates(candidateId2)])

            const voteCount1 = candidate1[2]
            const voteCount2 = candidate2[2]

            assert.equal(voteCount1, 1, 'candidate 1 did not receive any votes')
            assert.equal(voteCount2, 0, 'candidate 2 did not receive any votes')
        })

        it('throws an exception for double voting', async () => {
            const candidateId1 = 1
            const candidateId2 = 2
            await election.vote(candidateId2, { from: accounts[1] })
            
            let candidate2 = await election.candidates(candidateId2)
            let voteCount2 = candidate2[2]

            assert.equal(voteCount2, 1, 'accepts first vote')

            try {
                await election.vote(candidateId2, { from: accounts[1] })
            } catch (error) {
                assert(error.message.indexOf('revert') >= 0, `error message must contain revert`)
            }

            let candidate1 = await election.candidates(candidateId1)
            let voteCount1 = candidate1[2]
            assert.equal(voteCount1, 1, 'candidate 1 did not receive any votes')

            candidate2 = await election.candidates(candidateId2)
            voteCount2 = candidate2[2]
            assert.equal(voteCount2, 1, 'candidate 2 did not receive any votes')
        })

        it('does not allow double voting for account 2', async () => {
            const hasVoted = await election.hasVoted({ from: accounts[1]})

            assert.equal(hasVoted, true, '1st vote already submitted')
        })
    })
})
