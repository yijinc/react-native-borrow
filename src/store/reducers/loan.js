import {
    FETCH_CURRENT_LOAN,
    RECEIVE_CURRENT_LOAN,

    FETCH_HISTORY_LOANS,
    RECEIVE_HISTORY_LOANS,
    LOGOUT_SUCCESS
} from '../constants';

const initialState = {
    isFetching: false,
    hasCurrentLoan: false,          // 当前 是否有借贷订单

    // amount: 0,                      //贷款金额 ,
    // createDate: '2012/12/12',       //租赁日期 ,
    // loanLimit: 0,                   //租赁期限 ,
    // message:'',                     //审核信息 ,
    // repayStatus: 0,                 //订单偿还状态:0.未还清,1.已还清,2.已还部分,3.已逾期 ,
    // repaymentDate: '',              //最后一期偿还日期 ,
    // repaymentInfoDto: null,         //(用户偿还计划对象, optional): 当期偿还计划 ,
    // status: 0,                      //(integer, optional): 订单状态:0.未审核,1.审核中,2.审核通过,放款中,3.审核不通过,4.需重填资料,5.放款成功,6.放款失败,7.已完成,8.已取消 ,
    // totalRepayAmount:0,             //(number, optional): 总应还金额 ,
    // userId: 0,                      // (integer, optional): 用户Id
};


export const currentLoan = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CURRENT_LOAN: return {
            ...state,
            isFetching: true,
        };
        case RECEIVE_CURRENT_LOAN:
            return {
                ...state,
                ...action.loan,
                isFetching: false,
                hasCurrentLoan: !!action.loan.status 
            };
        case LOGOUT_SUCCESS:
            return initialState;
        default:
            return state;
    }
};










const initialHistoryLoanState = {
    isFetching: false,
    page: 1,
    pageSize: 20,
    total: 0,
    list: []
}

export const historyLoan = (state = initialHistoryLoanState, action) => {
    let loans;
    switch (action.type) {
        case FETCH_HISTORY_LOANS: return {
            ...state,
            isFetching: true,
        };
        case RECEIVE_HISTORY_LOANS:
            if (action.loans.page === 1) {
                if (action.loans.list.length>0 && state.list.length>0 && action.loans.list[0].orderNo === state.list[0].orderNo) {
                    // 使用缓存，当第二次进入请求的数据与之前的一样时，使用之前请求过的缓存数据
                    return state;
                }
                loans = {...action.loans}
            } else {
                loans = {
                    ...action.loans,
                    list: [...state.list, ...action.loans.list]
                }
            }
            return {
                ...state,
                ...loans,
                isFetching: false
            }
        default:
            return state;
    }
};