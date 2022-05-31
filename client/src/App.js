import React, { useEffect, useState } from "react";
import ElectionContract from './contracts/Election.json'
import getWeb3 from "./getWeb3";
import "./App.css";
import VotingResults from "./components/VotingResults/VotingResults";
import { ContractProvider } from "./context/contractContext";

const App = () => {
  const [numCandidates, setNumCandidates] = useState(0)
  const [candidates, setCandidates] = useState([])
  const [web3, setWeb3] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [contract, setContract] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    async function fetchWeb3Data () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();

        const deployedNetwork = ElectionContract.networks[networkId];
        const instance = new web3.eth.Contract(
          ElectionContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        // Check if user has voted
        const checkVoteStatus = (await instance.methods.hasVoted().call({from: accounts[0]}))
        setHasVoted(checkVoteStatus)

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3)
        setAccounts(accounts)
        setContract(instance)

        // Get the value from the contract to prove it worked.
        getCandidatesInfo(instance)

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }

    fetchWeb3Data()
  }, [])
  
  const getCandidatesInfo = async (instance) => {
    let candidates = [], candidatesCount
    await instance.methods.candidatesCount().call().then(async (count) => {
      candidatesCount = parseInt(count)
      for(let i = 1; i <= candidatesCount; i++) {
        let candidate = await instance.methods.candidates(i).call()
          candidates.push(candidate)  
      }
      // Update state with the result.
      setNumCandidates(candidatesCount)
      setCandidates(candidates)
    })
  }

  const candidateListener = (event) => {
    // fetch new candidate info
    getCandidatesInfo(contract)
  }

  useEffect(() => {
    if(contract) {
      contract.events.votedEvent()
        .on('data', event => candidateListener(event))
    }
  }, [contract])

  if (!web3 && !contract) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <h1>Voting Dapp</h1>
      <p>Your new and innovative way to ensure privacy and legitmacy of your elections.</p>
      <p>
        Please connect you wallet and vote below.
      </p>
      <div>Wallet connected: {accounts[0]}</div>
      <div>The number of candidates is: {numCandidates}</div>
      <ContractProvider value={{accounts, contract, hasVoted}}>
        <VotingResults candidates={candidates}/>
      </ContractProvider>
    </div>
  )
}

export default App;
