// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QuizStamp
 * @notice A simple educational smart contract allowing users to record their quiz scores on Botchain Mainnet.
 * @dev Note: Quiz answers are validated in the frontend browser before submission.
 *      The contract verifies that scores are within the valid range [0, 5], but cannot
 *      independently verify whether the questions were answered honestly off-chain.
 */
contract QuizStamp {
    // Total submissions across all wallets
    uint256 public totalSubmissions;

    // Mapping from wallet address to their personal best score (0-5)
    mapping(address => uint256) public bestScores;

    // Mapping from wallet address to their total submission count
    mapping(address => uint256) public submissionCounts;

    // Event emitted whenever a user submits a valid score
    event ScoreSubmitted(
        address indexed user,
        uint256 score,
        uint256 personalBest
    );

    /**
     * @notice Save a quiz score for the calling wallet.
     * @param score Quiz score out of 5 (must be between 0 and 5 inclusive).
     */
    function saveScore(uint256 score) external {
        require(score <= 5, "Score must be between 0 and 5");

        // Increment user's personal submission count and global count
        submissionCounts[msg.sender] += 1;
        totalSubmissions += 1;

        // Update personal best if the new score is strictly higher
        if (score > bestScores[msg.sender]) {
            bestScores[msg.sender] = score;
        }

        uint256 currentBest = bestScores[msg.sender];

        emit ScoreSubmitted(msg.sender, score, currentBest);
    }

    /**
     * @notice Get the caller's personal best score.
     * @return The caller's best score out of 5 (default 0).
     */
    function getMyBestScore() external view returns (uint256) {
        return bestScores[msg.sender];
    }

    /**
     * @notice Get the caller's total submission count.
     * @return The number of times the caller has submitted a score.
     */
    function getMySubmissions() external view returns (uint256) {
        return submissionCounts[msg.sender];
    }

    /**
     * @notice Get the total number of submissions made across all wallets.
     * @return The total submission count.
     */
    function getTotalSubmissions() external view returns (uint256) {
        return totalSubmissions;
    }
}
