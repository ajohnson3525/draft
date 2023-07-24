"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidDrafter = exports.ValidID = exports.PicksMade = exports.RecordPick = exports.NewDraft = exports.DraftComplete = exports.WhoseTurn = exports.ListChoices = void 0;
var drafts = [];
var nextDraftID = 0;
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
function ListChoices(req, res) {
    var draftID = Number(req.query.draftID);
    if (isNaN(draftID)) {
        res.status(400).send("missing 'draftID' parameter");
        return;
    }
    res.json({ choices: drafts[draftID].picksRemaining });
}
exports.ListChoices = ListChoices;
// returns the name of whose turn it is
function WhoseTurn(req, res) {
    var draftID = Number(req.query.draftID);
    if (isNaN(draftID)) {
        res.status(400).send("missing 'draftID' parameter");
        return;
    }
    var turnIndex = (drafts[draftID].picksMade) % drafts[draftID].numDrafters;
    res.json({ currentDrafter: drafts[draftID].drafters[turnIndex] });
}
exports.WhoseTurn = WhoseTurn;
// returns whether or not the draft is complete
function DraftComplete(req, res) {
    var draftID = Number(req.query.draftID);
    if (isNaN(draftID)) {
        res.status(400).send("missing 'draftID' parameter");
        return;
    }
    var picksLeft = drafts[draftID].picksLeft;
    var complete = (picksLeft <= 0);
    res.json({ complete: complete });
}
exports.DraftComplete = DraftComplete;
// inserts a new draft and returns its ID
function NewDraft(req, res) {
    var drafterList = req.body.drafters;
    if (drafterList === undefined || typeof drafterList !== 'string') {
        res.status(400).send("missing 'drafters' parameter");
        return;
    }
    var drafters = drafterList.split("\n");
    var picksList = req.body.picks;
    if (picksList === undefined || typeof picksList !== 'string') { // this may already return an array. please check
        res.status(400).send("missing 'picks' parameter");
        return;
    }
    var picks = picksList.split("\n");
    picks.sort();
    var rounds = Number(req.body.rounds);
    if (isNaN(rounds)) {
        res.status(400).send("missing 'rounds' parameter");
        return;
    }
    var numDrafters = drafters.length;
    var picksLeft = (rounds * numDrafters);
    if (picksLeft > picks.length) {
        picksLeft = picks.length;
    }
    var draftID = nextDraftID;
    nextDraftID++;
    var newDraft = {
        drafters: drafters,
        picksRemaining: picks,
        numDrafters: numDrafters,
        picks: [],
        picksMade: 0,
        picksLeft: picksLeft,
    };
    drafts.push(newDraft);
    res.json({ draftID: draftID });
}
exports.NewDraft = NewDraft;
// records a new pick
// parameters: what was picked, draftID
// returns number of picks remaining
function RecordPick(req, res) {
    var draftID = Number(req.query.draftID);
    if (isNaN(draftID)) {
        res.status(400).send("missing 'draftID' parameter");
        return;
    }
    var thisDraft = drafts[draftID];
    var pick = req.query.pick;
    if (pick === undefined || typeof (pick) !== 'string') {
        res.status(400).send("missing 'pick' parameter");
        return;
    }
    var turnIndex = (drafts[draftID].picksMade) % drafts[draftID].numDrafters;
    var currentDrafter = drafts[draftID].drafters[turnIndex];
    var pickIndex = drafts[draftID].picksRemaining.indexOf(pick);
    thisDraft.picksRemaining[pickIndex] = thisDraft.picksRemaining[thisDraft.picksRemaining.length - 1];
    thisDraft.picksRemaining.pop();
    thisDraft.picksRemaining.sort();
    thisDraft.picks.push({ pick: pick, drafter: currentDrafter });
    thisDraft.picksMade++;
    thisDraft.picksLeft--;
    res.json({ picksRemaining: drafts[draftID].picksLeft });
}
exports.RecordPick = RecordPick;
// returns the picks that have been made
function PicksMade(req, res) {
    var draftID = Number(req.query.draftID);
    if (isNaN(draftID)) {
        res.status(400).send("missing 'draftID' parameter");
        return;
    }
    res.json({ picks: drafts[draftID].picks });
}
exports.PicksMade = PicksMade;
// returns whether or not the given draftID is a valid ID
function ValidID(req, res) {
    var testID = Number(req.query.draftID);
    if (isNaN(testID)) {
        res.status(400).send("missing 'draftID' parameter");
        return;
    }
    var valid = testID >= 0 && testID < drafts.length;
    res.json({ valid: valid });
}
exports.ValidID = ValidID;
// returns whether or not the given Drafter is a valid Drafter
function ValidDrafter(req, res) {
    var draftID = Number(req.query.draftID);
    var testDrafter = req.query.drafter;
    if (typeof testDrafter !== 'string') {
        res.status(400).send("missing 'drafter' parameter");
        return;
    }
    var valid;
    if (draftID >= nextDraftID) {
        valid = false;
    }
    else {
        valid = drafts[draftID].drafters.includes(testDrafter);
    }
    res.json({ valid: valid });
}
exports.ValidDrafter = ValidDrafter;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUF1QkEsSUFBSSxNQUFNLEdBQVksRUFBRSxDQUFDO0FBQ3pCLElBQUksV0FBVyxHQUFXLENBQUMsQ0FBQztBQUU1QixrREFBa0Q7QUFDbEQsdURBQXVEO0FBQ3ZELHdDQUF3QztBQUN4Qyw4QkFBOEI7QUFDOUIsd0RBQXdEO0FBQ3hELGFBQWE7QUFDYiwrQkFBK0I7QUFDL0IsTUFBTTtBQUNOLElBQUk7QUFFSiwwQ0FBMEM7QUFDMUMsU0FBZ0IsV0FBVyxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQ3JELElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDcEQsT0FBTztLQUNSO0lBRUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxFQUFDLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBUkQsa0NBUUM7QUFFRCx1Q0FBdUM7QUFDdkMsU0FBZ0IsU0FBUyxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQ25ELElBQU0sT0FBTyxHQUFXLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDcEQsT0FBTztLQUNSO0lBRUQsSUFBTSxTQUFTLEdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENB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