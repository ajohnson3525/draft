import { Request, Response } from "express";

// // Description of an item that's been Drafted
// type Drafted = {
//   pick: string,
//   drafter: string
// }

type Drafted = {
  pick: string;
  drafter: string;
}

// Description of an individual Draft
type Draft = {
  drafters: string[],
  picksRemaining: string[],
  numDrafters: number,
  picks: Drafted[],
  picksMade: number,
  picksLeft: number,
}

let drafts: Draft[] = [];
let nextDraftID: number = 0; 

/** Returns a list of all the named save files. */
// export function Dummy(req: Request, res: Response) {
//   const name = first(req.query.name);
//   if (name === undefined) {
//     res.status(400).send('missing "name" parameter');
//   } else {
//     res.json(`Hi, ${name}`);
//   }
// }

// returns an array of the remaining picks
export function ListChoices(req: Request, res: Response) {
  const draftID = Number(req.query.draftID);
  if (isNaN(draftID)) {
    res.status(400).send("missing 'draftID' parameter");
    return;
  }

  res.json({choices: drafts[draftID].picksRemaining});
}

// returns the name of whose turn it is
export function WhoseTurn(req: Request, res: Response) {
  const draftID: number = Number(req.query.draftID);
  if (isNaN(draftID)) {
    res.status(400).send("missing 'draftID' parameter");
    return;
  }

  const turnIndex: number = (drafts[draftID].picksMade) % drafts[draftID].numDrafters;
  res.json({currentDrafter: drafts[draftID].drafters[turnIndex]});
 }

// returns whether or not the draft is complete
export function DraftComplete(req: Request, res: Response) {
  const draftID: number = Number(req.query.draftID);
  if (isNaN(draftID)) {
    res.status(400).send("missing 'draftID' parameter");
    return;
  }
  
  const picksLeft: number = drafts[draftID].picksLeft;

  const complete: boolean = (picksLeft <= 0);
  res.json({complete: complete});
}

// inserts a new draft and returns its ID
export function NewDraft(req: Request, res: Response) {
  const drafterList = req.body.drafters;
  if (drafterList === undefined || typeof drafterList !== 'string') {
    res.status(400).send("missing 'drafters' parameter");
    return;
  }
  const drafters: string[] = drafterList.split("\n");

  const picksList = req.body.picks;
  if (picksList === undefined || typeof picksList !== 'string') { // this may already return an array. please check
    res.status(400).send("missing 'picks' parameter");
    return;
  }
  const picks: string[] = picksList.split("\n");
  picks.sort();
  
  const rounds: number = Number(req.body.rounds);
  if (isNaN(rounds)) {
    res.status(400).send("missing 'rounds' parameter");
    return;
  }
  
  const numDrafters: number = drafters.length;
  let picksLeft: number = (rounds * numDrafters);
  if (picksLeft > picks.length) {
    picksLeft = picks.length;
  }
  const draftID: number = nextDraftID;
  nextDraftID++;

  let newDraft: Draft = {
    drafters: drafters,
    picksRemaining: picks,
    numDrafters: numDrafters,
    picks: [],
    picksMade: 0,
    picksLeft: picksLeft,
  };
  
  drafts.push(newDraft);
  res.json({draftID: draftID});
}

// records a new pick
// parameters: what was picked, draftID
// returns number of picks remaining
export function RecordPick(req: Request, res: Response) {
  const draftID = Number(req.query.draftID);
  if (isNaN(draftID)) {
    res.status(400).send("missing 'draftID' parameter");
    return;
  }

  const thisDraft: Draft = drafts[draftID];

  const pick = req.query.pick;
  if (pick === undefined || typeof(pick) !== 'string') {
    res.status(400).send("missing 'pick' parameter");
    return;
  }

  const turnIndex: number = (drafts[draftID].picksMade) % drafts[draftID].numDrafters;
  const currentDrafter: string = drafts[draftID].drafters[turnIndex];

  const pickIndex = drafts[draftID].picksRemaining.indexOf(pick);
  thisDraft.picksRemaining[pickIndex] = thisDraft.picksRemaining[thisDraft.picksRemaining.length - 1];
  thisDraft.picksRemaining.pop();
  thisDraft.picksRemaining.sort();

  thisDraft.picks.push({pick: pick, drafter: currentDrafter});  
  thisDraft.picksMade++;
  thisDraft.picksLeft--;
  res.json({picksRemaining: drafts[draftID].picksLeft});
}

// returns the picks that have been made
export function PicksMade(req: Request, res: Response) {
  const draftID = Number(req.query.draftID);
  if (isNaN(draftID)) {
    res.status(400).send("missing 'draftID' parameter");
    return;
  }

  res.json({picks: drafts[draftID].picks});
}

// returns whether or not the given draftID is a valid ID
export function ValidID(req: Request, res: Response) {
  const testID = Number(req.query.draftID);
  if (isNaN(testID)) {
    res.status(400).send("missing 'draftID' parameter");
    return;
  }

  let valid: boolean = testID >= 0 && testID < drafts.length;

  res.json({valid: valid});
}

// returns whether or not the given Drafter is a valid Drafter
export function ValidDrafter(req: Request, res: Response) {
  const draftID = Number(req.query.draftID);
  const testDrafter = req.query.drafter;
  
  if (typeof testDrafter !== 'string') {
    res.status(400).send("missing 'drafter' parameter");
    return;
  }

  let valid: boolean;
  if (draftID >= nextDraftID) {
    valid = false;
  } else {
    valid = drafts[draftID].drafters.includes(testDrafter);
  }

  res.json({valid: valid});
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
// function first(param: any): string|undefined {
//   if (Array.isArray(param)) {
//     return first(param[0]);
//   } else if (typeof param === 'string') {
//     return param;
//   } else {
//     return undefined;
//   }
// }
