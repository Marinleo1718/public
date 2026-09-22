const { YooCheckout } = require('@a2seven/yoo-checkout');
const express = require('express');
const path = require('path');
const app = express();

const checkout = new YooCheckout({ 
  shopId: process.env.SHOP_ID || 'test', 
  secretKey: process.env.SECRET_KEY || 'test' 
});

app.use(express.json());
// Раздаем файл index.html из корневой папки
app.use(express.static(__dirname));

app.post('/create-payment', async (req, res) => {
  try {
    const { amount, description, customerName, customerPhone, testName } = req.body;
    const createQuery = {
      amount: { value: `${amount}.00`, currency: 'RUB' },
      payment_method_data: { type: 'bank_card' },
      confirmation: { type: 'redirect', return_url: 'https://leonovauchi.ru/' },
      capture: true,
      description: description,
      metadata: { customerName, customerPhone, testName }
    };
    const payment = await checkout.createPayment(createQuery);
    res.json({ confirmationUrl: payment.confirmation.confirmation_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
