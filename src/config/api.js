
const API_BASE_URL = 'http://51.79.181.161:5000';

const API_ENDPOINTS = {
  users: '/users',
  userDetail: '/user',
  lockStatus: '/lock-status/:account_number',
  account: '/account',
  deleteUser: '/users/:account_number',
  login: '/login',
  rentalPlans: '/rental-plans',
  rentalPlanDetail: '/rental-plans/:id',
  createRentalPlan: '/rental-plans',
  updateRentalPlan: '/rental-plans/:id',
  deleteRentalPlan: '/rental-plans/:id',
  qrCodes: '/qr-codes',
  updateQrCode: '/qr-codes',
  payment: '/payment',
  activateAccount: '/activate-account/:account_number',
};

export { API_BASE_URL, API_ENDPOINTS };
