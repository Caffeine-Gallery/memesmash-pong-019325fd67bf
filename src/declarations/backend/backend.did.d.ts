import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Score { 'player' : bigint, 'score' : bigint }
export interface _SERVICE {
  'getHighScores' : ActorMethod<[], Array<Score>>,
  'saveScore' : ActorMethod<[bigint, bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
