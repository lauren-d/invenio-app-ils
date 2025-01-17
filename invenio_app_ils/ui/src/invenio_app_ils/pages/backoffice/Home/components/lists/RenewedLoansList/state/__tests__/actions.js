import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../actions';
import { initialState } from '../reducer';
import * as types from '../types';
import { loan as loanApi } from '../../../../../../../../common/api';
import { toShortDate } from '../../../../../../../../common/api/date';
import { DateTime } from 'luxon';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockResponse = {
  data: {
    hits: {
      hits: [
        {
          id: 123,
          updated: '2018-01-01T11:05:00+01:00',
          created: '2018-01-01T11:05:00+01:00',
          metadata: {},
        },
      ],
    },
  },
};

const mockLoanList = jest.fn();
loanApi.list = mockLoanList;

let store;
beforeEach(() => {
  mockLoanList.mockClear();

  store = mockStore({ latestRenewedLoans: initialState });
  store.clearActions();
});

describe('Loans renewed more then 3 times (last week) fetch tests', () => {
  let date = toShortDate(DateTime.local().minus({ days: 7 }));

  it('should dispatch a loading action when fetching loans', done => {
    mockLoanList.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.IS_LOADING,
    };

    store.dispatch(actions.fetchRenewedLoans()).then(() => {
      expect(mockLoanList).toHaveBeenCalledWith(
        `(_updated:%7B${date}%20TO%20*%7D AND extension_count:>=3)`
      );
      const actions = store.getActions();
      expect(actions[0]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch a success action when loans fetch succeeds', done => {
    mockLoanList.mockResolvedValue(mockResponse);

    const expectedAction = {
      type: types.SUCCESS,
      payload: mockResponse.data,
    };

    store.dispatch(actions.fetchRenewedLoans()).then(() => {
      expect(mockLoanList).toHaveBeenCalledWith(
        `(_updated:%7B${date}%20TO%20*%7D AND extension_count:>=3)`
      );
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });

  it('should dispatch an error action when loans fetch fails', done => {
    mockLoanList.mockRejectedValue([500, 'Error']);

    const expectedAction = {
      type: types.HAS_ERROR,
      payload: [500, 'Error'],
    };

    store.dispatch(actions.fetchRenewedLoans()).then(() => {
      expect(mockLoanList).toHaveBeenCalledWith(
        `(_updated:%7B${date}%20TO%20*%7D AND extension_count:>=3)`
      );
      const actions = store.getActions();
      expect(actions[1]).toEqual(expectedAction);
      done();
    });
  });
});
