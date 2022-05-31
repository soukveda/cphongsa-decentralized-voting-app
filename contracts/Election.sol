// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

contract Election {
    // Candidate attributes
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Read/write a list of candidates
    mapping(uint => Candidate) public candidates;

    // Store accounts that have voted
    mapping(address => bool) public voters;

    // Storing candidates vote count
    uint public candidatesCount;

    // voting event
    event votedEvent (uint indexed _candidateId);

    // Constructor
    constructor() {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
        addCandidate("Candidate 3");
    } 


    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount++;

        // emit trigger voted event to frontend
        emit votedEvent(_candidateId);
    }

    function hasVoted() public view returns (bool) {
        return voters[msg.sender];
    }
}