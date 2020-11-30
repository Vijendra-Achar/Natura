import axios from 'axios';
import { showAlert } from './alerts';
import { stripePublicKey } from './environment';

const stripe = Stripe(stripePublicKey);

export const bookTour = async (tourId) => {
  try {
    // 1 --> Get the session from the server / API
    const session = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/booking/checkout/${tourId}`,
    });

    // 2 --> Display the checkout form and charge the card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err.message);
  }
};
