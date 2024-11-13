import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Order "mo:base/Order";

actor {
    // Define the Score type
    type Score = {
        player: Nat;
        score: Nat;
    };

    // Stable variable to store high scores
    stable var highScores : [Score] = [];
    let maxScores = 5;

    // Save a new score
    public func saveScore(player: Nat, score: Nat) : async () {
        let newScore : Score = {
            player = player;
            score = score;
        };

        let scoresBuffer = Buffer.Buffer<Score>(maxScores);
        
        // Add existing scores to buffer
        for (existingScore in highScores.vals()) {
            scoresBuffer.add(existingScore);
        };
        
        // Add new score
        scoresBuffer.add(newScore);

        // Sort scores in descending order
        let sortedScores = Buffer.toArray(scoresBuffer);
        let sorted = Array.sort<Score>(sortedScores, func(a: Score, b: Score) : Order.Order {
            if (b.score > a.score) { #less }
            else if (b.score < a.score) { #greater }
            else { #equal }
        });

        // Keep only top scores
        if (sorted.size() > maxScores) {
            highScores := Array.subArray(sorted, 0, maxScores);
        } else {
            highScores := sorted;
        };
    };

    // Get high scores
    public query func getHighScores() : async [Score] {
        highScores
    };

    // System functions for upgrade persistence
    stable var stableScores : [Score] = [];

    system func preupgrade() {
        stableScores := highScores;
    };

    system func postupgrade() {
        highScores := stableScores;
    };
}
