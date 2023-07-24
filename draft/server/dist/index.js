"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = require("./routes");
var body_parser_1 = __importDefault(require("body-parser"));
// Configure and start the HTTP server.
var port = 8088;
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
//app.get("/api/dummy", Dummy);
app.get("/api/list", routes_1.ListChoices);
app.get("/api/turn", routes_1.WhoseTurn);
app.get("/api/complete", routes_1.DraftComplete);
app.post("/api/add", routes_1.NewDraft);
app.get("/api/pick", routes_1.RecordPick);
app.get("/api/history", routes_1.PicksMade);
app.get("/api/validID", routes_1.ValidID);
app.get("/api/validDrafter", routes_1.ValidDrafter);
app.listen(port, function () { return console.log("Server listening on ".concat(port)); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBOEI7QUFDOUIsbUNBQXlIO0FBQ3pILDREQUFxQztBQUdyQyx1Q0FBdUM7QUFDdkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLElBQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQ3RCLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLCtCQUErQjtBQUMvQixHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxvQkFBVyxDQUFDLENBQUM7QUFDbEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsa0JBQVMsQ0FBQyxDQUFDO0FBQ2hDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLHNCQUFhLENBQUMsQ0FBQztBQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxpQkFBUSxDQUFDLENBQUM7QUFDL0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsbUJBQVUsQ0FBQyxDQUFDO0FBQ2pDLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLGtCQUFTLENBQUMsQ0FBQztBQUNuQyxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxnQkFBTyxDQUFDLENBQUM7QUFDakMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxxQkFBWSxDQUFDLENBQUM7QUFDM0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBTSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQXVCLElBQUksQ0FBRSxDQUFDLEVBQTFDLENBQTBDLENBQUMsQ0FBQyJ9