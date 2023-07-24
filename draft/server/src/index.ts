import express from "express";
import { ListChoices, WhoseTurn, DraftComplete, NewDraft, RecordPick, PicksMade, ValidID, ValidDrafter } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
//app.get("/api/dummy", Dummy);
app.get("/api/list", ListChoices);
app.get("/api/turn", WhoseTurn);
app.get("/api/complete", DraftComplete);
app.post("/api/add", NewDraft);
app.get("/api/pick", RecordPick);
app.get("/api/history", PicksMade);
app.get("/api/validID", ValidID);
app.get("/api/validDrafter", ValidDrafter);
app.listen(port, () => console.log(`Server listening on ${port}`));
