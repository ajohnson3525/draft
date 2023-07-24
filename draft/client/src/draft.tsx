import React, { Component, ChangeEvent } from "react";

type Drafted = {
    pick: string;
    drafter: string;
}

interface DraftProps {
    //** Initial state of the file. */
    onBack: () => void;
    draftID: number;
    user: string;
}

interface DraftState {
    // the draft we are in
    draftID: number;
    draftComplete: boolean;
    user: string;
    pick: string;
    picks: string[];
    currentDrafter?: string;
    history: Drafted[];
}

export class Draft extends Component<DraftProps, DraftState> {

    constructor(props: any) {
        super(props);
        
        this.state = {draftID: props.draftID, user: props.user, pick: '', picks: [], history: [], draftComplete: false};
        this.handleRefresh();
    }

    render = (): JSX.Element => {

        let turnStatus: JSX.Element;
        if (this.state.draftComplete) {
            turnStatus = (
                <div><p>Draft is Complete.</p></div>
            );
        } else {
            if(this.state.currentDrafter === this.state.user) {
                let options: JSX.Element[] = [];
                let i: number = 0;
                while (i < this.state.picks.length) {
                    let option: string = this.state.picks[i];
                    options.push(
                        <option value={option}>{option}</option>
                    );
                    i++;
                }
                turnStatus = (
                    <div>
                        <p>It's your pick!</p>
                        <select value={this.state.pick} onChange={this.handlePick}>
                            {options}
                        </select>
                        <button type="button" onClick={this.handleDraft}>Draft</button>
                    </div>
                );
            } else {
                turnStatus = (
                    <div>
                        <p>Waiting for {this.state.currentDrafter} to pick.</p>
                        <button type="button" onClick={this.handleRefresh}>Refresh</button>
                    </div>
                );
            }
        }

        let table: JSX.Element[] = [];
        table.push(<tr>
            <th>Num</th>
            <th>Pick</th>
            <th>Drafter</th>
            </tr>
        );
        let i: number = 1;
        while (i <= this.state.history.length) {
            let entry: Drafted = this.state.history[i-1];
            table.push(
                <tr>
                    <td>{i}</td>
                    <td>{entry.pick}</td>
                    <td>{entry.drafter}</td>
                </tr>
            );
            i++;
        }

        return (
            <div>
                <div><p>Status of Draft {this.state.draftID}</p></div>
                <div>
                <table>{table}</table>
                </div>
                <div>{turnStatus}</div>
                <div><button type="button" onClick={this.handleBack}>Back To Menu</button></div>
            </div>
        );
    };

    handleBack = (_: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onBack();
    };

    handleRefresh = (): void => {
        let url = "/api/turn"+"?draftID=" + encodeURIComponent(this.state.draftID);
        fetch(url).then(this.handleCurrentDrafter).catch(this.handleServerError);
        url = "/api/history"+"?draftID=" + encodeURIComponent(this.state.draftID);
        fetch(url).then(this.handleHistory).catch(this.handleServerError);
        url = "/api/complete"+"?draftID=" + encodeURIComponent(this.state.draftID);
        fetch(url).then(this.handleComplete).catch(this.handleServerError);
        url = "/api/list"+"?draftID=" + encodeURIComponent(this.state.draftID);
        fetch(url).then(this.handleOptions).catch(this.handleServerError);
    }

    handleCurrentDrafter = (res: Response): void => {
        res.json().then(this.handleCurrentDrafterJSON).catch(this.handleServerError);
    };

    handleCurrentDrafterJSON = (vals: any): void => {
        if (typeof vals !== "object" || vals === null || !('currentDrafter' in vals) ||
                typeof vals.currentDrafter !== 'string') {
            console.error("bad data from /turn: no currentDrafter", vals);
            return;
        }
        this.setState({currentDrafter: vals.currentDrafter});
    };

    handleHistory = (res: Response): void => {
        res.json().then(this.handleHistoryJSON).catch(this.handleServerError);
    };

    handleHistoryJSON = (vals: any): void => {
        if (typeof vals !== "object" || vals === null || !('picks' in vals) ||
                !Array.isArray(vals.picks)) {
            console.error("bad data from /history: no picks", vals);
            return;
        }
        this.setState({history: vals.picks});
    };

    handleComplete = (res: Response): void => {
        res.json().then(this.handleCompleteJSON).catch(this.handleServerError);
    };

    handleCompleteJSON = (vals: any): void => {
        if (typeof vals !== "object" || vals === null || !('complete' in vals) ||
                typeof vals.complete !== 'boolean') {
            console.error("bad data from /complete: no picks", vals);
            return;
        }
        this.setState({draftComplete: vals.complete});
    };
 
    handlePick = (event: ChangeEvent<HTMLSelectElement>): void => {
        this.setState({pick: event.target.value});
    };

    handleOptions = (res: Response): void => {
        res.json().then(this.handleOptionsJSON).catch(this.handleServerError);
    };

    handleOptionsJSON = (vals: any): void => {
        if (typeof vals !== "object" || vals === null || !('choices' in vals) ||
                !Array.isArray(vals.choices)) {
            console.error("bad data from /list: no choices", vals);
            return;
        }
        this.setState({picks: vals.choices, pick: vals.choices[0]});
    };

    handleDraft = (): void => {
        let url = "/api/pick"+"?draftID=" + encodeURIComponent(this.state.draftID)
                +"&pick=" + encodeURIComponent(this.state.pick);
        fetch(url).then(this.handleDraftConfirmation).catch(this.handleServerError).then(this.handleRefresh);
    }; 

    handleDraftConfirmation = (res: Response): void => {
        if (res.status !== 200) {
            this.handleServerError(res);
        }
    };

    handleServerError = (_: Response): void => {
        console.error('unkonwn error talking to server');
    };

    
}
