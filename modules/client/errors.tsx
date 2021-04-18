import { useUser } from 'modules/client/users';
import Router from 'next/router';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { MyGetServerSideProps } from 'modules/server/pages';

const ErrorPage = dynamic(() => import('pages/_error'));

/** Wraps a page's component to serve an error page instead of the page component when a `statusCode` prop is passed to the page. */
export const withErrorPage = <
	/** The props of the page's component. */
	Props extends Record<string, any> = Record<string, unknown>
>(Component: (props: Props & { statusCode?: undefined }) => JSX.Element) => (
	({ statusCode, ...props }: Props) => {
		const user = useUser();

		useEffect(() => () => {
			// When the client switches users, reload the page so its server-side props are requested again, possibly updating `statusCode`.
			// For example, if a client is signed out on a page which they need to sign into in order to access, `statusCode === 403`. If they then sign in, the server-side props will return no `statusCode`, as well is any necessary data which only that user has access to for that page.
			// This incidentally causes a real window reload if the server tries to send the client an HTTP error status code.
			Router.replace(Router.asPath);
		}, [user?.id]);

		return (
			statusCode === undefined
				? <Component {...props as any} />
				: <ErrorPage statusCode={statusCode} />
		);
	}
);

/** Sets `res.statusCode` based on the returned `statusCode` prop. */
export const withStatusCode = <
	ServerSideProps extends Record<string, any> = {}
>(getServerSideProps: MyGetServerSideProps<ServerSideProps>): MyGetServerSideProps<ServerSideProps> => (
	async props => {
		const serverSideProps = await getServerSideProps(props);

		if (serverSideProps.props.statusCode) {
			// This ESLint comment is necessary because I'm pretty sure there's no race condition here.
			// eslint-disable-next-line require-atomic-updates
			props.res.statusCode = serverSideProps.props.statusCode;
		}

		return serverSideProps;
	}
);