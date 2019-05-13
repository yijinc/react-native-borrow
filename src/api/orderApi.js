import axios from './request/axios';


/**
 * POST /sea-loan-service/api/v1/loan/transaction/create-order
 * 创建租赁订单数据 @param {Object} data
 * @param {string} amount           租赁金额
 * @param {number} bankCardId       打款银行
 * @param {string} idCard           身份证号
 * @param {number} limitUnit        期限单位
 * @param {number} loanLimit        租赁期限
 * @param {number} loanPurpose      租赁用途
 * @param {number} productId        产品编码
 * @param {string} userId           用户Id
 * @param {string} userName         用户姓名
 */
export function createOrder(data) {
    return axios.post('/loan/transaction/create-order', data)
}





/**
 * GET /sea-loan-service/api/v1/loan/transaction/current-order
 * 获取用户当前租赁订单详情
 */
export function fetchCurrentOrder() {
    return axios.get('/loan/transaction/current-order')
}





/**
 * GET /sea-loan-service/api/v1/loan/transaction/order-list
 * 获取用户租赁订单列表接口
 */
export function fetchOrderList(page, pageSize=20) {
    return axios.get(`/loan/transaction/order-list?pageNum=${page}&pageSize=${pageSize}`)
}




/**
 * GET /sea-loan-service/api/v1/loan/transaction/{orderNo}/info
 * 获取租赁订单详情接口
 * @param {string} orderNo         订单编号
 */
export function fetchOrder(orderNo) {
    return axios.get(`/loan/transaction/${orderNo}/info`)
}




/**
 * POST /sea-loan-service/api/v1/loan/transaction/{orderNo}/re-audit
 * 重新提交审核接口
 * @param {string} orderNo         订单编号
 */
export function orderReAudit(orderNo) {
    return axios.post(`/loan/transaction/${orderNo}/re-audit`)
}




/**
 * GET /sea-loan-service/api/v1/loan/transaction/{orderNo}/repayment-info
 * 获取用户偿还码信息接口
 * @param {string} orderNo         订单编号
 * @param {number} codeType        codeType 偿还码类型:1.银行卡;2.便利店
 */
export function fetchRepaymentCode(orderNo, codeType) {
    return axios.get(`/loan/transaction/${orderNo}/repayment-info`, {
        headers: {
            'codeType': codeType
        }
    })
}