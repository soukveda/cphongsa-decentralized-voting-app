import React, { useContext, useEffect, useState } from 'react'
import ContractContext from '../../context/contractContext'

const VotingForm = ({ candidates = []}) => {
    const app = useContext(ContractContext)
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [hasVoted, setHasVoted] = useState(false)

    useEffect(() => {
        // set voting status
        setHasVoted(app.hasVoted)
    }, [])

    const renderCandidates = (candidate) => {
        return <option value={candidate[0]}>{candidate[1]}</option>
    }

    const castVote = async (e) => {
        e.preventDefault()
        
        await app.contract.methods.vote(selectedCandidate).send({ from: app.accounts[0]})
        
        setHasVoted(true)
    }

    const handleChange = (event) => {
        setSelectedCandidate(event.target.value)
    }
    
    return (
        <form onSubmit={castVote}>
            <label>
                Select Candidate
                <select onChange={handleChange}>
                    {!selectedCandidate ? <option value={'#'} selected>Select a candidate</option> : null}
                    {
                        candidates.map((candidate) => {
                            return renderCandidates(candidate)
                        })
                    }
                </select>    
            </label>
            <input type='submit' value='Vote' disabled={hasVoted}/>
        </form>
    )
}

export default VotingForm
