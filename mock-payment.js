import axios from "axios";
let data = JSON.stringify({
  price_amount: 2,
  price_currency: "usd",
  order_id: "vaultO949u4e0jsf",
  order_description: "Vault",
  ipn_callback_url:
    "https://5bc74e6b958f.ngrok-free.app/api/rumman/v1/user/paynow",
  success_url: "https://5bc74e6b958f.ngrok-free.app",
  cancel_url: "https://5bc74e6b958f.ngrok-free.app",
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://api.nowpayments.io/v1/invoice",
  headers: {
    "x-api-key": "8D5JWMB-34TM9BT-NZSBF90-2QN0F7Z",
    "Content-Type": "application/json",
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
