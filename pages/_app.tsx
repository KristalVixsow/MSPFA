import App from 'next/app'; // @server-only
import type { AppProps, AppContext } from 'next/app';
import type { NextPageContext } from 'next';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { authenticate } from 'modules/server/auth'; // @server-only
import { getPrivateUser } from 'modules/server/users'; // @server-only
import env from 'modules/client/env';
import { UserContext, useUserMerge, useUserState } from 'modules/client/users';
import type { PrivateUser } from 'modules/client/users';
import * as MSPFA from 'modules/client/MSPFA'; // @client-only
import type { PageRequest } from 'modules/server/pages';
import { useEffect } from 'react';
import { setTheme } from 'modules/client/themes';
import { useRouter } from 'next/router';
import _ from 'lodash';
import 'styles/global.scss';

(global as any).MSPFA = MSPFA; // @client-only

export type MyAppInitialProps = {
	env: Partial<typeof process.env>,
	user?: PrivateUser
};

export type MyAppProps = Omit<AppProps, 'pageProps'> & {
	/** An object with the app's `pageProps` on all server-side renders and the first client-side render, but an empty object on subsequent renders. */
	pageProps: Record<string, undefined> | {
		readonly [key: string]: unknown,
		initialProps: MyAppInitialProps
	}
};

const MyApp = ({
	Component,
	pageProps
}: MyAppProps) => {
	Object.assign(env, pageProps.initialProps?.env);

	const user = useUserState(pageProps.initialProps?.user);
	const [userMerge] = useUserMerge();
	const mergedUser = userMerge ? _.merge({}, user, userMerge) : user;

	const theme = mergedUser?.settings.theme ?? 'standard';

	useEffect(() => {
		setTheme(theme);
	}, [theme]);

	return (
		<>
			<Head>
				<title>MS Paint Fan Adventures</title>
				<meta name="description" content="Hello, welcome to the bath house" />
				<meta name="author" content="MS Paint Fan Adventures" />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="MS Paint Fan Adventures" />
				<meta property="og:description" content="Hello, welcome to the bath house" />
				<meta property="og:title" content="MS Paint Fan Adventures" />
				<meta property="og:image" content="/images/icon.png" />
				<link rel="icon" href="/images/icon.png" /* Perfectly generic icon by heyitskane */ />
			</Head>
			<SWRConfig
				value={{
					revalidateOnMount: true,
					revalidateOnFocus: false,
					revalidateOnReconnect: false
				}}
			>
				<UserContext.Provider value={mergedUser}>
					<Component
						{
							// It is necessary that the props object passed here is the original `pageProps` object and not a shallow clone thereof, because props from a page's `getServerSideProps` are assigned to the original `pageProps` object and would otherwise not be passed into the page component.
							...pageProps as any
						}
					/>
				</UserContext.Provider>
			</SWRConfig>
		</>
	);
};

// @server-only {
/** This runs server-side on every page request (only for initial requests by the browser, not by the Next router). */
MyApp.getInitialProps = async (appContext: AppContext) => {
	const appProps = await App.getInitialProps(appContext) as MyAppProps;

	const initialProps: MyAppInitialProps = {
		env: {
			HCAPTCHA_SITE_KEY: process.env.HCAPTCHA_SITE_KEY,
			GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
			DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID
		}
	};

	// This exposes `initialProps` to `MyApp` (on the server and the client) and to every page's props (on the client).
	appProps.pageProps.initialProps = initialProps;

	// `req` and `res` below are exposed to every page's `getServerSideProps` (on the server) and `pages/_document` (on the server).
	const { req, res } = appContext.ctx as NextPageContext & {
		req: PageRequest,
		res: NonNullable<NextPageContext['res']>
	};

	req.initialProps = initialProps;

	const { user } = await authenticate(req, res);
	if (user) {
		req.user = user;

		appProps.pageProps.initialProps.user = getPrivateUser(user);
	}

	return appProps;
};
// @server-only }

export default MyApp;