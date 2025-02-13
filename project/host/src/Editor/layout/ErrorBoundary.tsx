import type { FC, PropsWithChildren } from 'react';
import {
	type FallbackProps,
	ErrorBoundary as ReactErrorBoundary,
} from 'react-error-boundary';

const fallbackRender = ({ error }: FallbackProps) => (
	<div role="alert" className="w-full max-w-full">
		<p className="text-3xl text-center text-red-600 font-bold my-10">
			Something went wrong.
		</p>
		<div className="rounded-lg m-4 p-4 ring-1 ring-slate-900/10 bg-red-50 overflow-x-auto">
			<pre className="font-bold text-red-600">{error.message}</pre>
			<pre className="text-red-500">{error?.stack}</pre>
		</div>
	</div>
);

export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => (
	<ReactErrorBoundary fallbackRender={fallbackRender}>
		{children}
	</ReactErrorBoundary>
);
