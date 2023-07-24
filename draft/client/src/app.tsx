import React, { Component, ChangeEvent } from "react";
import { Draft } from './draft';
//import { concat } from "./webpack.config";


interface AppState {
  menu: boolean;
  user: string;
  drafts: number;
  validID: boolean;
  validDrafter: boolean;
  validDrafterNew: boolean;
  draftID: string;

  rounds?: number;
  drafters?: string;
  options?: string;
  edError?: string;
  ndError?: string;
}


export class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);

    this.state = {menu: true, user: '', drafts: 0, validID: false, validDrafter: false, validDrafterNew: false, draftID: ''};
  }
  
  render = (): JSX.Element => {
    
    if (!this.state.menu) {
      return <Draft draftID={Number(this.state.draftID)}
                    user = {this.state.user}
                    onBack={this.handleBack}/>
    }

    
    let user = (
      <div>
        <div>Drafter:
          <input id="user" type="text" value={this.state.user} onChange={this.handleUser}></input>
        </div>
      </div>
    );

    let existingDraft = (
      <div>
        <div><p><b>Join Existing Draft</b></p></div>
        <div>Draft ID:
          <input id="draftID" type="text" value = {this.state.draftID} onChange={this.handleDraftID}>
        </input></div>
        <div><button type="button" onClick={this.handleJoin}>Join</button></div>
      </div>
    );

    let rows: number = 25;
    let cols: number = 30;
    let newDraft = (
      <div>
        <p><b>Create New Draft</b></p>
        <div>Rounds: 
          <input id="rounds" type="text" value = {this.state.rounds} onChange={this.handleRounds}></input>
        </div>
        <div><p>
          <label htmlFor="options">Options (one per line)</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <label htmlFor="drafters">Drafters (one per line, in order)</label>
          <br></br>
          <textarea id="options" name="options" rows={rows} cols={cols} onChange={this.handleOptions}></textarea>
          <textarea id="drafters" name="drafters" rows={rows} cols={cols} onChange={this.handleDrafters}></textarea>
        </p></div>
        <div><button type="button" onClick={this.handleCreate}>Create</button></div>
      </div>
    );


    let existingDraftError: any = '';
    if (this.state.edError) {
      existingDraftError = <p><b>Error: </b>{this.state.edError}</p>
    }

    let newDraftError: any = '';
    if (this.state.ndError) {
      newDraftError = <p><b>Error: </b>{this.state.ndError}</p>
    }
    
    return (
      <div>
      <div>{user}</div>
      <div>{existingDraft}</div>
      <div>{existingDraftError}</div>
      <div>{newDraft}</div>
      <div>{newDraftError}</div>
      </div>
    );
  };


  handleUser = (event: ChangeEvent<HTMLInputElement>): void => {    
    // check for valid drafter - existing draft
    if (this.state.draftID !== undefined && this.state.user != '') {
      let url = "/api/validDrafter"+"?draftID=" + encodeURIComponent(this.state.draftID) +"&drafter="+ encodeURIComponent(event.target.value);
      fetch(url).then(this.handleValidDrafter).catch(this.handleServerError);
    }

    // check for valid drafter - new draft
    let validUserNew: boolean = false;
    if (this.state.drafters !== undefined) {
      const drafters: string[] = this.state.drafters.split("\n");
      validUserNew = drafters.includes(event.target.value);
    }

    this.setState({user: event.target.value, validDrafterNew: validUserNew});
  };

  handleDraftID = (event: ChangeEvent<HTMLInputElement>): void => {
    // check for valid DraftID
    if (event.target.value !== undefined){
      let url = "/api/validID"+"?draftID=" + encodeURIComponent(event.target.value);
      fetch(url).then(this.handleValidID).catch(this.handleServerError);
    }

    this.setState({draftID: event.target.value});
  };
  
  handleRounds = (event: ChangeEvent<HTMLInputElement>): void => {
    this.setState({rounds: Number(event.target.value)});
  };
  
  handleOptions = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({options: event.target.value});
  };

  handleDrafters = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    let validUser: boolean = false;
    // check for valid drafter - new draft
    if (event.target.value !== undefined) {
      const drafters: string[] = event.target.value.split("\n");
      validUser = drafters.includes(this.state.user);
    }

    this.setState({drafters: event.target.value, validDrafterNew: validUser});
  };

  handleJoin = (): void => {
    if(this.state.user === '') {
      this.setState({edError: "Please enter a Drafter."});
    } else if (this.state.draftID === undefined) {
      this.setState({edError: "Please enter a DraftID."});
    } else if (!this.state.validID){
      this.setState({edError: "DraftID is invalid."})
    } else if (!this.state.validDrafter){
      this.setState({edError: "Drafter is invalid."});
    } else{
      this.setState({menu: false});
    }
  };
  
  handleCreate = (): void => {
    if(this.state.user === '') {
      this.setState({ndError: "Please enter a Drafter."});
    } else if (!this.state.validDrafterNew) {
      this.setState({ndError: "Drafter is invalid. "});
    } else if (this.state.rounds === 0) {
      this.setState({ndError: "Rounds must be greater than 0."});
    } else if (this.state.options === undefined) {
      this.setState({ndError: "Please enter list of Options."});
    } else if (this.state.drafters === undefined) {
      this.setState({ndError: "Please enter list of Drafters."});
    } else {
      fetch("/api/add", {method: "POST", body: JSON.stringify(
        {drafters: this.state.drafters, picks: this.state.options, rounds: this.state.rounds}), 
        headers: {'Content-Type': 'application/json'}}).then(this.handleCreated).catch(this.handleServerError);  
    }
  };
  
  handleCreated = (res: Response): void => {
    res.json().then(this.handleCreatedJSON).catch(this.handleServerError);
  };

  handleCreatedJSON = (vals: any): void => {
    if (typeof vals !== "object" || vals === null || !('draftID' in vals) ||
                typeof vals.draftID !== 'number') {
            console.error("bad data from /add: no draftID", vals);
            return;
        }
    this.setState({draftID: String(vals.draftID), menu: false});
  };

  handleValidID = (res: Response): void => {
    res.json().then(this.handleValidIDJSON).catch(this.handleServerError);
  };

  handleValidIDJSON = (vals: any): void => {
    if (typeof vals !== "object" || vals === null || !('valid' in vals) ||
                typeof vals.valid !== 'boolean') {
            console.error("bad data from /validID: no valid", vals);
            return;
    }
      this.setState({validID: vals.valid});
  };

  handleValidDrafter = (res: Response): void => {
    res.json().then(this.handleValidDrafterJSON).catch(this.handleServerError);
  };

  handleValidDrafterJSON = (vals: any): void => {
    if (typeof vals !== "object" || vals === null || !('valid' in vals) ||
                typeof vals.valid !== 'boolean') {
            console.error("bad data from /validDrafter: no valid", vals);
            return;
    }
    this.setState({validDrafter: vals.valid});
  };

  handleBack = (): void => {
    this.setState({menu: true, user: '', draftID: '', drafters: undefined, 
      options: undefined, rounds: undefined, edError: undefined, ndError: undefined,
      validDrafter: false, validDrafterNew: false, validID: false});
  };

  handleServerError = (_: Response): void => {
    console.error('unkonwn error talking to server');
  };

}
