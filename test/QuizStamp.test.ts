import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("QuizStamp Smart Contract", function () {
  let quizStamp: any;
  let owner: any;
  let alice: any;
  let bob: any;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const QuizStampFactory = await ethers.getContractFactory("QuizStamp");
    quizStamp = await QuizStampFactory.deploy();
    await quizStamp.waitForDeployment();
  });

  describe("Initial State", function () {
    it("should initialize with zero global submissions and zero user scores", async function () {
      expect(await quizStamp.getTotalSubmissions()).to.equal(0);
      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(0);
      expect(await quizStamp.connect(alice).getMySubmissions()).to.equal(0);
    });
  });

  describe("Requirement 1: Saving a valid score", function () {
    it("should allow a wallet to save a valid score between 0 and 5", async function () {
      await quizStamp.connect(alice).saveScore(4);
      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(4);
      expect(await quizStamp.connect(alice).getMySubmissions()).to.equal(1);
    });

    it("should allow saving 0 and 5 boundary scores", async function () {
      await quizStamp.connect(alice).saveScore(0);
      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(0);
      expect(await quizStamp.connect(alice).getMySubmissions()).to.equal(1);

      await quizStamp.connect(alice).saveScore(5);
      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(5);
      expect(await quizStamp.connect(alice).getMySubmissions()).to.equal(2);
    });
  });

  describe("Requirement 2: Rejecting a score greater than 5", function () {
    it("should revert when submitting a score strictly greater than 5", async function () {
      await expect(quizStamp.connect(alice).saveScore(6)).to.be.revertedWith(
        "Score must be between 0 and 5"
      );
      await expect(quizStamp.connect(alice).saveScore(100)).to.be.revertedWith(
        "Score must be between 0 and 5"
      );
    });
  });

  describe("Requirement 3: Updating personal best when a higher score is submitted", function () {
    it("should update personal best score when higher score is submitted", async function () {
      await quizStamp.connect(alice).saveScore(2);
      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(2);

      await quizStamp.connect(alice).saveScore(4);
      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(4);
    });
  });

  describe("Requirement 4: Preserving personal best when a lower score is submitted", function () {
    it("should retain personal best when subsequent score is lower or equal", async function () {
      await quizStamp.connect(alice).saveScore(5);
      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(5);

      // Submit lower score
      await quizStamp.connect(alice).saveScore(3);
      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(5);

      // Submit equal score
      await quizStamp.connect(alice).saveScore(5);
      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(5);
    });
  });

  describe("Requirement 5: Counting submissions correctly", function () {
    it("should increment the caller's submission count on each valid submission", async function () {
      expect(await quizStamp.connect(alice).getMySubmissions()).to.equal(0);

      await quizStamp.connect(alice).saveScore(1);
      expect(await quizStamp.connect(alice).getMySubmissions()).to.equal(1);

      await quizStamp.connect(alice).saveScore(2);
      expect(await quizStamp.connect(alice).getMySubmissions()).to.equal(2);

      await quizStamp.connect(alice).saveScore(0);
      expect(await quizStamp.connect(alice).getMySubmissions()).to.equal(3);
    });
  });

  describe("Requirement 6: Tracking submissions separately for different wallets", function () {
    it("should maintain independent scores and counts for different wallets", async function () {
      await quizStamp.connect(alice).saveScore(3);
      await quizStamp.connect(alice).saveScore(5);

      await quizStamp.connect(bob).saveScore(2);

      expect(await quizStamp.connect(alice).getMyBestScore()).to.equal(5);
      expect(await quizStamp.connect(alice).getMySubmissions()).to.equal(2);

      expect(await quizStamp.connect(bob).getMyBestScore()).to.equal(2);
      expect(await quizStamp.connect(bob).getMySubmissions()).to.equal(1);
    });
  });

  describe("Requirement 7: Returning the correct global submission count", function () {
    it("should return the total number of submissions made across all wallets", async function () {
      expect(await quizStamp.getTotalSubmissions()).to.equal(0);

      await quizStamp.connect(alice).saveScore(3);
      expect(await quizStamp.getTotalSubmissions()).to.equal(1);

      await quizStamp.connect(bob).saveScore(4);
      expect(await quizStamp.getTotalSubmissions()).to.equal(2);

      await quizStamp.connect(owner).saveScore(1);
      expect(await quizStamp.getTotalSubmissions()).to.equal(3);
    });
  });

  describe("Requirement 8: Emitting the expected event", function () {
    it("should emit ScoreSubmitted with user address, score, and personalBest", async function () {
      // First score: 3 (new best is 3)
      await expect(quizStamp.connect(alice).saveScore(3))
        .to.emit(quizStamp, "ScoreSubmitted")
        .withArgs(alice.address, 3, 3);

      // Lower score: 1 (best remains 3)
      await expect(quizStamp.connect(alice).saveScore(1))
        .to.emit(quizStamp, "ScoreSubmitted")
        .withArgs(alice.address, 1, 3);

      // Higher score: 5 (new best is 5)
      await expect(quizStamp.connect(alice).saveScore(5))
        .to.emit(quizStamp, "ScoreSubmitted")
        .withArgs(alice.address, 5, 5);
    });
  });
});
