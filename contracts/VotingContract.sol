// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    struct Candidate {
        uint256 id;
        string name;
        string description;
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint256 votedFor;
    }

    address public owner;
    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) public voters;
    uint256 public candidatesCount;
    bool public votingOpen;

    event VoteCast(uint256 indexed candidateId, address indexed voter);
    event CandidateAdded(uint256 indexed candidateId, string name);
    event VotingStatusChanged(bool isOpen);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier votingIsOpen() {
        require(votingOpen, "Voting is currently closed");
        _;
    }

    constructor() {
        owner = msg.sender;
        votingOpen = true;
    }

    function addCandidate(string memory _name, string memory _description) public onlyOwner {
        require(!votingOpen, "Cannot add candidates while voting is open");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _description, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function vote(uint256 _candidateId) public votingIsOpen {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        require(!voters[msg.sender].hasVoted, "You have already voted");

        voters[msg.sender] = Voter(true, _candidateId);
        candidates[_candidateId].voteCount++;
        emit VoteCast(_candidateId, msg.sender);
    }

    function setVotingStatus(bool _isOpen) public onlyOwner {
        votingOpen = _isOpen;
        emit VotingStatusChanged(_isOpen);
    }

    function getCandidate(uint256 _candidateId) public view returns (uint256, string memory, string memory, uint256) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.description, candidate.voteCount);
    }

    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter].hasVoted;
    }
} 