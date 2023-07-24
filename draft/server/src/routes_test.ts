import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { ListChoices, WhoseTurn, DraftComplete, NewDraft, RecordPick, PicksMade, ValidID, ValidDrafter } from './routes';


describe('routes', function() {

  // it('Dummy', function() {
  //   const req1 = httpMocks.createRequest(
  //       {method: 'GET', url: '/api/dummy', query: {name: 'Kevin'}});
  //   const res1 = httpMocks.createResponse();
  //   Dummy(req1, res1);
  //   assert.strictEqual(res1._getStatusCode(), 200);
  //   assert.deepEqual(res1._getJSONData(), 'Hi, Kevin');
  // });

  it('Tests', function() {
    // test NewDraft
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {drafters: "John\nPaul\nGeorge\nRingo", 
        picks: "red\norange\nyellow\ngreen\nblue\nindigo\nviolet\npink", rounds: 2}});
    const res1 = httpMocks.createResponse();
    NewDraft(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getJSONData(), {draftID: 0});

    // test PicksMade is empty
    const req2 = httpMocks.createRequest({method: 'GET', url: '/api/history', query: {draftID: 0}});
    const res2 = httpMocks.createResponse();
    PicksMade(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getJSONData(), {picks: []});

    // test ListChoices is all choices
    const req3 = httpMocks.createRequest({method: 'GET', url: '/api/list', query: {draftID: 0}});
    const res3 = httpMocks.createResponse();
    ListChoices(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getJSONData(), {choices: ["blue", "green", "indigo", "orange", "pink", "red", "violet", "yellow"]});

    // test WhoseTurn in John
    const req4 = httpMocks.createRequest({method: 'GET', url: '/api/turn', query: {draftID: 0}});
    const res4 = httpMocks.createResponse();
    WhoseTurn(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getJSONData(), {currentDrafter: "John"});

    // test DraftComplete is False
    const req5 = httpMocks.createRequest({method: 'GET', url: '/api/complete', query: {draftID: 0}});
    const res5 = httpMocks.createResponse();
    DraftComplete(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getJSONData(), {complete: false});
    
    // test RecordPick with John picking orange
    const req6 = httpMocks.createRequest({method: 'GET', url: '/api/pick', query: {draftID: 0, pick: "orange"}});
    const res6 = httpMocks.createResponse();
    RecordPick(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getJSONData(), {picksRemaining: 7});    

    // test WhoseTurn is Paul
    const req7 = httpMocks.createRequest({method: 'GET', url: '/api/turn', query: {draftID: 0}});
    const res7 = httpMocks.createResponse();
    WhoseTurn(req7, res7);
    assert.deepStrictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getJSONData(), {currentDrafter: "Paul"});

    // test PicksMade has one entry (orange)
    const req8 = httpMocks.createRequest({method: 'GET', url: '/api/history', query: {draftID: 0}});
    const res8 = httpMocks.createResponse();
    PicksMade(req8, res8);
    assert.deepStrictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getJSONData(), {picks: [{pick: "orange", drafter: "John"}]});

    // test ListChoices is all colors except orange
    const req9 = httpMocks.createRequest({method: 'GET', url: '/api/list', query: {draftID: 0}});
    const res9 = httpMocks.createResponse();
    ListChoices(req9, res9);
    assert.deepStrictEqual(res9._getStatusCode(), 200);
    assert.deepStrictEqual(res9._getJSONData(), {choices: ["blue", "green", "indigo", "pink", "red", "violet", "yellow"]});

    // test RecordPick through the first round
    const req10a = httpMocks.createRequest({method: 'GET', url: '/api/pick', query: {draftID: 0, pick: "green"}});
    const res10a = httpMocks.createResponse();
    RecordPick(req10a, res10a);
    assert.deepStrictEqual(res10a._getStatusCode(), 200);
    assert.deepStrictEqual(res10a._getJSONData(), {picksRemaining: 6});

    const req10b = httpMocks.createRequest({method: 'GET', url: '/api/pick', query: {draftID: 0, pick: "indigo"}});
    const res10b = httpMocks.createResponse();
    RecordPick(req10b, res10b);
    assert.deepStrictEqual(res10b._getStatusCode(), 200);
    assert.deepStrictEqual(res10b._getJSONData(), {picksRemaining: 5});

    const req10c = httpMocks.createRequest({method: 'GET', url: '/api/pick', query: {draftID: 0, pick: "violet"}});
    const res10c = httpMocks.createResponse();
    RecordPick(req10c, res10c);
    assert.deepStrictEqual(res10c._getStatusCode(), 200);
    assert.deepStrictEqual(res10c._getJSONData(), {picksRemaining: 4});

    // test WhoseTurn is John
    const req11 = httpMocks.createRequest({method: 'GET', url: '/api/turn', query: {draftID: 0}});
    const res11 = httpMocks.createResponse();
    WhoseTurn(req11, res11);
    assert.deepStrictEqual(res11._getStatusCode(), 200);
    assert.deepStrictEqual(res11._getJSONData(), {currentDrafter: "John"});

    // test ListChoices
    const req12 = httpMocks.createRequest({method: 'GET', url: '/api/list', query: {draftID: 0}});
    const res12 = httpMocks.createResponse();
    ListChoices(req12, res12);
    assert.deepStrictEqual(res12._getStatusCode(), 200);
    assert.deepStrictEqual(res12._getJSONData(), {choices: ["blue", "pink", "red", "yellow"]});

    // test PicksMade
    const req13 = httpMocks.createRequest({method: 'GET', url: '/api/history', query: {draftID: 0}});
    const res13 = httpMocks.createResponse();
    PicksMade(req13, res13);
    assert.deepStrictEqual(res13._getStatusCode(), 200);
    assert.deepStrictEqual(res13._getJSONData(), {picks: [{pick: "orange", drafter: "John"}, {pick: "green", drafter: "Paul"}, 
            {pick: "indigo", drafter: "George"}, {pick: "violet", drafter: "Ringo"}]});

    // test RecordPick through the end
    const req14a = httpMocks.createRequest({method: 'GET', url: '/api/pick', query: {draftID: 0, pick: "blue"}});
    const res14a = httpMocks.createResponse();
    RecordPick(req14a, res14a);
    assert.deepStrictEqual(res14a._getStatusCode(), 200);
    assert.deepStrictEqual(res14a._getJSONData(), {picksRemaining: 3});

    const req14b = httpMocks.createRequest({method: 'GET', url: '/api/pick', query: {draftID: 0, pick: "yellow"}});
    const res14b = httpMocks.createResponse();
    RecordPick(req14b, res14b);
    assert.deepStrictEqual(res14b._getStatusCode(), 200);
    assert.deepStrictEqual(res14b._getJSONData(), {picksRemaining: 2});

    const req14c = httpMocks.createRequest({method: 'GET', url: '/api/pick', query: {draftID: 0, pick: "pink"}});
    const res14c = httpMocks.createResponse();
    RecordPick(req14c, res14c);
    assert.deepStrictEqual(res14c._getStatusCode(), 200);
    assert.deepStrictEqual(res14c._getJSONData(), {picksRemaining: 1});

    const req14d = httpMocks.createRequest({method: 'GET', url: '/api/pick', query: {draftID: 0, pick: "red"}});
    const res14d = httpMocks.createResponse();
    RecordPick(req14d, res14d);
    assert.deepStrictEqual(res14d._getStatusCode(), 200);
    assert.deepStrictEqual(res14d._getJSONData(), {picksRemaining: 0});

    // test DraftComplete
    const req15 = httpMocks.createRequest({method: 'GET', url: '/api/complete', query: {draftID: 0}});
    const res15 = httpMocks.createResponse();
    DraftComplete(req15, res15);
    assert.deepStrictEqual(res15._getStatusCode(), 200);
    assert.deepStrictEqual(res15._getJSONData(), {complete: true});

    // test NewDraft again
    const req16 = httpMocks.createRequest({method: 'POST', url: '/api/add', body: {drafters: "Gerard\nRay\nMikey\nFrank", 
    picks: "apple\norange\nbanana\npear", rounds: 1}});
    const res16 = httpMocks.createResponse();
    NewDraft(req16, res16);
    assert.deepStrictEqual(res16._getStatusCode(), 200);
    assert.deepStrictEqual(res16._getJSONData(), {draftID: 1});

    // test that first draft PicksMade still works
    const req17 = httpMocks.createRequest({method: 'GET', url: '/api/history', query: {draftID: 0}});
    const res17 = httpMocks.createResponse();
    PicksMade(req17, res17);
    assert.deepStrictEqual(res17._getStatusCode(), 200); 
    assert.deepStrictEqual(res17._getJSONData(), {picks: [{pick: "orange", drafter: "John"}, {pick: "green", drafter: "Paul"},
          {pick: "indigo", drafter: "George"}, {pick: "violet", drafter: "Ringo"}, {pick: "blue", drafter: "John"}, {pick: "yellow", drafter: "Paul"},
          {pick: "pink", drafter: "George"}, {pick: "red", drafter: "Ringo"}]});

    // test new drafts' List Choices
    const req18 = httpMocks.createRequest({method: 'GET', url: '/api/list', query: {draftID: 1}});
    const res18 = httpMocks.createResponse();
    ListChoices(req18, res18);
    assert.deepStrictEqual(res18._getStatusCode(), 200);
    assert.deepStrictEqual(res18._getJSONData(), {choices: ["apple", "banana", "orange", "pear"]});
    
    // test ValidID - true
    const req19 = httpMocks.createRequest({method: 'GET', url: '/api/validID', query: {draftID: 1}});
    const res19 = httpMocks.createResponse();
    ValidID(req19, res19);
    assert.deepStrictEqual(res19._getStatusCode(), 200);
    assert.deepStrictEqual(res19._getJSONData(), {valid: true});

    // test ValidID - false
    const req20 = httpMocks.createRequest({method: 'GET', url: '/api/validID', query: {draftID: 3}});
    const res20 = httpMocks.createResponse();
    ValidID(req20, res20);
    assert.deepStrictEqual(res20._getStatusCode(), 200);
    assert.deepStrictEqual(res20._getJSONData(), {valid: false});

    // test ValidDrafter - true
    const req21 = httpMocks.createRequest({method: 'GET', url: '/api/validDrafter', query: {draftID: 0, drafter: "George"}});
    const res21 = httpMocks.createResponse();
    ValidDrafter(req21, res21);
    assert.deepStrictEqual(res21._getStatusCode(), 200);
    assert.deepStrictEqual(res21._getJSONData(), {valid: true});

    // test ValidDrafter - false
    const req22 = httpMocks.createRequest({method: 'GET', url: '/api/ValidDrafter', query: {draftID: 1, drafter: "John"}});
    const res22 = httpMocks.createResponse();
    ValidDrafter(req22, res22);
    assert.deepStrictEqual(res22._getStatusCode(), 200);
    assert.deepStrictEqual(res22._getJSONData(), {valid: false});

   
    // if you have time - add tests for errors

  
  });

});
