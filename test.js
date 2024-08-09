import axios from 'axios';
import Head from 'next/head';
import { useContext } from 'react';
import ApplicationContext from '~/context/ApplicationContext';

const sleep = (millis = 500) => new Promise((r) => setTimeout(r, millis));

export default function Stripe() {
  const {
    user: {
      stripeBankAccountId: stripeConnectAccount,
      bankAccountOnboardComplete: hasStripeConnectOnboarded,
    } = {},
    authorizationHeader,
    setLoading,
  } = useContext(ApplicationContext);
  const hasOnboarded = stripeConnectAccount && hasStripeConnectOnboarded;

  const stripeApi = axios.create({
    baseURL: `${process.env.ServerUrl}/api/stripe`,
    headers: {
      Authorization: `Bearer ${authorizationHeader}`,
    },
  });

  const getConnectUrl = async () => {
    console.log('retrieving url...');
    const {
      data: { url },
    } = await stripeApi.get('/payout/stripeaccount');

    return url;
  };

  const startOnboarding = async () => {
    setLoading(true);

    try {
      const [url] = await Promise.all([getConnectUrl(), sleep()]);
      window.location = url;
    } catch (error) {
      console.error(error.response.data);
      await sleep(250);
    }

    setLoading(false);
  };

  const getDeleteUrl = async () => {
    const response = await stripeApi.delete('/payout/stripeaccount');
    return response;
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const [response] = await Promise.all([getDeleteUrl(), sleep()]);
      console.log(response);
    } catch (error) {
      console.error(error.response.data);
      await sleep(250);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto mt-24">
      <Head>
        <title>StayApp - Stripe Onboarding Test</title>
      </Head>

      <h1 className="text-center font-bold">Stripe</h1>

      {!hasOnboarded && (
        <button
          className="p-3 bg-primary hover:bg-tertiary focus:outline-none focus:ring-0 rounded text-white font-semibold m-auto block my-6"
          onClick={startOnboarding}
        >
          Connect with Stripe
        </button>
      )}
      <button
        className="p-3 bg-primary hover:bg-tertiary focus:outline-none focus:ring-0 rounded text-white font-semibold m-auto block my-6"
        onClick={deleteAccount}
      >
        Delete account
      </button>

      <p>{stripeConnectAccount}</p>
      <p>{hasStripeConnectOnboarded}</p>
    </div>
  );
}
