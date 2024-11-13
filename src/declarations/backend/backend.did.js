export const idlFactory = ({ IDL }) => {
  const Score = IDL.Record({ 'player' : IDL.Nat, 'score' : IDL.Nat });
  return IDL.Service({
    'getHighScores' : IDL.Func([], [IDL.Vec(Score)], ['query']),
    'saveScore' : IDL.Func([IDL.Nat, IDL.Nat], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
