import { state, mutations } from 'src/game/store';
import { BLACK, WHITE } from 'src/game/color';
const { PLAYER_TURN, PASS_TURN, NEW_GAME } = mutations;

describe('game store', () => {
  describe('starting a new game', () => {
    var s;

    beforeAll(() => {
      s = Object.assign({}, state);

      NEW_GAME(s, 13);
      PLAYER_TURN(s, 0, 0);
      PLAYER_TURN(s, 0, 1);
      PLAYER_TURN(s, 10, 10);
      PLAYER_TURN(s, 1, 0);

      NEW_GAME(s, 19);
    });

    it('has the specified size',
       () => expect(s.size).toBe(19));

    it('has a game type of "local"',
       () => expect(s.gameType).toBe('local'));

    it('has 0 captures for both colors', () => {
      expect(s.captures[BLACK]).toBe(0);
      expect(s.captures[WHITE]).toBe(0);
    });

    it('has no previous passes',
      () => expect(s.pass_last_turn).toBe(false));

    it('is not done',
      () => expect(s.game_done).toBe(false));

    it('has the correct number of rows',
       () => expect(s.board.length).toBe(19));
    it('has the correct first turn',
       () => expect(s.current_turn).toBe(BLACK));
  });

  describe('game play', () => {
    describe('without an active game', () => {
      it('player turn does nothing', () => {
        let s = Object.assign({}, state);
        PLAYER_TURN(s, 1, 2);

        expect(s).toEqual(state);
      });
    });

    describe('with an active game', () => {
      let s = Object.assign({}, state);
      beforeEach(() => NEW_GAME(s, 19));

      describe('player turn', () => {
        it('should update the board', () => {
          PLAYER_TURN(s, 1, 2);

          expect(s.board[2][1]).toBe(BLACK);
          expect(s.current_turn).toBe(WHITE);
          expect(s.pass_last_turn).toBe(false);
        });
      });

      describe('passing a turn', () => {
        it('should leave the board as is, and change the current turn', () => {
          PASS_TURN(s);

          // TODO: Validate no changes to board.
          expect(s.current_turn).toBe(WHITE);
          expect(s.pass_last_turn).toBe(true);
        });
      });

      describe('two consecutive passes', () => {
        it('should mark the game as done', () => {
          PASS_TURN(s);
          PASS_TURN(s);

          expect(s.current_turn).toBeNull();
          expect(s.game_done).toBe(true);
        })
      })

      describe('player turn to capture a piece', () => {
        beforeEach(() => {
          PLAYER_TURN(s, 0, 0);
          PLAYER_TURN(s, 0, 1);
          PLAYER_TURN(s, 10, 10);
        });

        it('should update the captures appropriately', () => {
          let turn = s.current_turn;
          PLAYER_TURN(s, 1, 0);

          expect(s.captures[turn]).toBe(1);
        });
      });

      describe('attempting to play an occupied location', () => {
        let s = Object.assign({}, state);
        beforeEach(() => {
          NEW_GAME(s, 19);
          PLAYER_TURN(s, 1, 1);
        });

        it('should not update the board', () => {
          PLAYER_TURN(s, 1, 1);

          expect(s.board[1][1]).toBe(BLACK);
          expect(s.current_turn).toBe(WHITE);
        });
      });
    });
  });
});
