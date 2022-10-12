//Mail Template for user verificatiion
export function emailVerificationView(id: string, token: unknown): string {
  const link = `${process.env.ROOT_URL}/user/verify/${id}`;
  const home = `${process.env.APP_URL}`;
  let temp = `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <!--[if (gte mso 9)|(IE)]><!-->
        <link rel="noopener" target="_blank" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <!--<![endif]-->
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      </style>
    </head>
    <body>
      <div style="position: relative;
      background: #E5E5E5;
      height: 100vh;
      min-width: 200px;
      font-family: 'Inter', sans-serif;
      box-sizing: border-box;">
        <div style="position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 745px;
        max-width: 90%;
        height: 626px;
        background: #FFFFFF;
        box-sizing: border-box;
        display: table;
        text-align: center;
        padding-top: 20%;">
          <a href="${home}" style="text-decoration: none;">
            <div style="width: 151px;
            height: 56px;
            display: flex;
            margin: 0 auto 20px;
            justify-content: space-between;
            font-family: 'Inter', sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 19px;">
              <img src="https://res.cloudinary.com/deqb447mp/image/upload/v1664044669/airtime2Cash/u8pxu0260n2wumj3wpkj.png" alt="logo" border="0" width=32 height=56 style="width: 32px; height: 56px;">
              <p style="
              display: flex;">
                <span style="color: #DE3D6D;">Airtime</span>
                <span style="color: #F5844C;">2Cash</span>
              </p>
            </div>
          </a>
          <h1 style="color: #21334F;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 25px;
          margin: 0 0 20px;
          padding: 0;">Hurray! Almost There</h1>
          <p style="font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 15px;
          margin: 15px 0 20px;">Click the button to verify your email and activate your account</p>
          <form action='${link}' method='post'>
            <input type='hidden' name='token' value='${token}' />
            <input type='submit' value='Verify Email' style="font-family: 'Inter', sans-serif;
            border: none;
            align-self: stretch;
            padding: 16.5px 32px;
            margin-bottom: 20px;
            gap: 10px;
            background: linear-gradient(92.1deg, #DE3D6D 55.67%, #F5844C 101.51%);
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;">
          </form>
          <p style="font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 15px;
          margin: 10px 0 0 0;">Verification link expired? <a href="${link}" style="color: rgb(223, 62, 110); cursor: pointer;">Resend Verification Email</a></p>
        </div>
      </div>
    </body>
  </html>
  `;
  return temp;
};


//Mail Template for user password reset
export function passwordMailTemplate(id: string, token: unknown): string {
  const link = `${process.env.ROOT_URL}/user/resetPassword/${id}`;
  const home = `${process.env.APP_URL}`;
  let temp = `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <!--[if (gte mso 9)|(IE)]><!-->
        <link rel="noopener" target="_blank" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <!--<![endif]-->
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      </style>
    </head>
    <body>
      <div style="position: relative;
      background: #E5E5E5;
      height: 100vh;
      min-width: 200px;
      font-family: 'Inter', sans-serif;
      box-sizing: border-box;">
        <div style="position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 745px;
        max-width: 90%;
        height: 626px;
        background: #FFFFFF;
        box-sizing: border-box;
        display: table;
        text-align: center;
        padding-top: 20%;">
          <a href="${home}" style="text-decoration: none;">
            <div style="width: 151px;
            height: 56px;
            display: flex;
            margin: 0 auto 20px;
            justify-content: space-between;
            font-family: 'Inter', sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 19px;">
              <img src="https://res.cloudinary.com/deqb447mp/image/upload/v1664044669/airtime2Cash/u8pxu0260n2wumj3wpkj.png" alt="logo" border="0" width=32 height=56 style="width: 32px; height: 56px;">
              <p style="
              display: flex;">
                <span style="color: #DE3D6D;">Airtime</span>
                <span style="color: #F5844C;">2Cash</span>
              </p>
            </div>
          </a>
          <h1 style="color: #21334F;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 25px;
          margin: 0 0 20px;
          padding: 0;">Set Your New Password</h1>
          <p style="font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 15px;
          margin: 15px 0 20px;">To reset your password click on the button below</p>
          <form action='${link}' method='post'>
            <input type='hidden' name='token' value='${token}' />
            <input type='submit' value='Reset Password' style="font-family: 'Inter', sans-serif;
            border: none;
            align-self: stretch;
            padding: 16.5px 32px;
            margin-bottom: 20px;
            gap: 10px;
            background: linear-gradient(92.1deg, #DE3D6D 55.67%, #F5844C 101.51%);
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;">
          </form>
          <p style="font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 15px;
          margin: 10px 0 0 0;">Set your new password within 10 minutes of receiving this mail</p>
        </div>
      </div>
    </body>
  </html>
  `;
  return temp;
};


//Mail Template for sending notificaiton to Admin
export function adminTransactionTemplate(id: string, phone: string, network: string, amountToSell: string, amountToReceive: string): string {
  const link = `${process.env.ROOT_URL}/transfer/updateStatus/${id}`;
  const home = `${process.env.APP_URL}`;
  let temp = `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <!--[if (gte mso 9)|(IE)]><!-->
        <link rel="noopener" target="_blank" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <!--<![endif]-->
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      </style>
    </head>
    <body>
      <div style="position: relative;
      background: #E5E5E5;
      height: 100vh;
      min-width: 200px;
      font-family: 'Inter', sans-serif;
      box-sizing: border-box;">
        <div style="position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 745px;
        max-width: 90%;
        height: 626px;
        background: #FFFFFF;
        box-sizing: border-box;
        display: table;
        text-align: center;
        padding-top: 20%;">
          <a href="${home}" style="text-decoration: none;">
            <div style="width: 151px;
            height: 56px;
            display: flex;
            margin: 0 auto 20px;
            justify-content: space-between;
            font-family: 'Inter', sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 19px;">
              <img src="https://res.cloudinary.com/deqb447mp/image/upload/v1664044669/airtime2Cash/u8pxu0260n2wumj3wpkj.png" alt="logo" border="0" width=32 height=56 style="width: 32px; height: 56px;">
              <p style="
              display: flex;">
                <span style="color: #DE3D6D;">Airtime</span>
                <span style="color: #F5844C;">2Cash</span>
              </p>
            </div>
          </a>
          <h1 style="color: #21334F;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 25px;
          margin: 0 0 20px;
          padding: 0;">Airtime Transaction from customer</h1>
          <p style="font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 15px;
          margin: 15px 0 20px;">Please confirm that the airtime was successfull using the details below</p>
          <p>Phonenumber: ${phone}</p>
          <p>Network:${network} </p>
          <p>Airtime sent: #${amountToSell} </p>
          <p>Amount To Receive: #${amountToReceive} </p>
          <form action='${link}' method='post'>
            <input type='hidden' name='token' value='${id}' />
            <input type='submit' value='Update Transaction Status' style="font-family: 'Inter', sans-serif;
            border: none;
            align-self: stretch;
            padding: 16.5px 32px;
            margin-bottom: 20px;
            gap: 10px;
            background: linear-gradient(92.1deg, #DE3D6D 55.67%, #F5844C 101.51%);
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;">
          </form>
          <p style="font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 15px;
          margin: 10px 0 0 0;">Please confirm that transaction was received before updating status</p>
        </div>
      </div>
    </body>
  </html>
  `;
  return temp;
};


//Mail Template for sending notificaiton to Customer
export function userTransactionTemplate() {
  const home = `${process.env.APP_URL}`;
  let temp = `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <!--[if (gte mso 9)|(IE)]><!-->
        <link rel="noopener" target="_blank" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <!--<![endif]-->
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      </style>
    </head>
    <body>
      <div style="position: relative;
      background: #E5E5E5;
      height: 100vh;
      min-width: 200px;
      font-family: 'Inter', sans-serif;
      box-sizing: border-box;">
        <div style="position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 745px;
        max-width: 90%;
        height: 626px;
        background: #FFFFFF;
        box-sizing: border-box;
        display: table;
        text-align: center;
        padding-top: 20%;">
          <a href="${home}" style="text-decoration: none;">
            <div style="width: 151px;
            height: 56px;
            display: flex;
            margin: 0 auto 20px;
            justify-content: space-between;
            font-family: 'Inter', sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 19px;">
              <img src="https://res.cloudinary.com/deqb447mp/image/upload/v1664044669/airtime2Cash/u8pxu0260n2wumj3wpkj.png" alt="logo" border="0" width=32 height=56 style="width: 32px; height: 56px;">
              <p style="
              display: flex;">
                <span style="color: #DE3D6D;">Airtime</span>
                <span style="color: #F5844C;">2Cash</span>
              </p>
            </div>
          </a>
          <h1 style="color: #21334F;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 25px;
          margin: 0 0 20px;
          padding: 0;">THANKS FOR USING AIRTIME2CASH</h1>
          <p style="font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 15px;
          margin: 15px 0 20px;">
            Please check your wallet after some minutes to confirm that your account has been credited
          </p>
          <p style="font-family: 'Inter', sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 15px;
          margin: 10px 0 0 0;">Admin will send notification incase of any delay</p>
        </div>
      </div>
    </body>
  </html>
  `;
  return temp;
};


//Mail Teemplate to notify user of successful wallet credit
export function walletNotification(updatedWallet: number, amount: number) {
  let temp = `
    <div style="background: #E5E5E5; height: 100%; padding-bottom: 30px;">
      <div style="max-width: 600px;text-align: center;background: #fff; text-transform: uppercase;
        margin:auto; padding: 50px 20px; font-size: 16px; margin-bottom: 25px;">

        <div style=" text-align:center; display:flex; justify-content: center; align-items:center;">
          <p style="color: #DE3D6D; font-size: 25px; display:flex; justify-content: center; align-items:center; margin: auto;"><img src="https://res.cloudinary.com/deqb447mp/image/upload/v1664044669/airtime2Cash/u8pxu0260n2wumj3wpkj.png" alt="logo" border="0" style="width: 25px; height: 35px;">Airtime<span style="color: #F5844C;">2Cash</span></p>
        </div>
        <div style="text-align:center; background:#DE3D6D; border-radius: 10px; padding: 20px 15px;">
          <div style="margin: 15px auto;">
            <h3 style="color:#fff; padding-top: 12px;">Description:Credit Alert</h3>
            <h3 style="color:#fff;">Credit: &#8358;${amount}</h3>
            <h3 style="color: #fff; padding-bottom: 12px;">Available Balance: <span>&#8358;${updatedWallet}</span></h3>
          </div>
        </div>
      </div>
    </div>
  `;
  return temp
};
