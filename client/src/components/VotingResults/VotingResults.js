import React from 'react'
import VotingForm from '../VotingForm/VotingForm'
import styles from './VotingResults.module.css'

const VotingResults = ({candidates = []}) => {
    const renderCandidates = (candidate) => {
        return (
            <tr>
                <td className={styles.td}>{candidate[0]}</td>
                <td className={styles.td}>{candidate[1]}</td>
                <td className={styles.td}>{candidate[2]}</td>
            </tr>
        )
    }

    const loader = () =>{
        return (
            <div id='loader'>
                <p className='text-center'>Loading...</p>
            </div>
        )
    }

    const table = () => {
        return (
            <>
                <table className={styles.tableContainer}>
                    <tr>
                        <th className={styles.th}>#</th>
                        <th className={styles.th}>Name</th>
                        <th className={styles.th}>Votes</th>
                    </tr>
                    <tbody id='candidatesResults'>
                        {
                            candidates.map((candidate) => {
                                return renderCandidates(candidate)
                            })
                        }
                    </tbody>
                </table>
                <p id='accountAddress' className='text-center'></p>
            </>
        )
    }

    return (
        <>
            <div className={styles.resultContainer}>
                <h1 className='text-center'>Election Results</h1>
                {
                    candidates.length ? table() : loader()
                }
            </div>
            <VotingForm candidates={candidates} />
        </>
    )
}

export default VotingResults