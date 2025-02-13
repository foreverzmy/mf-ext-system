import type { FC, ReactNode } from 'react';

export interface TitleBarProps {
	title?: ReactNode;
}

export const TitleBar: FC<TitleBarProps> = ({ title }) => {
	if (!title) {
		return null;
	}

	return (
		<div
			className="w-full centered shadow shadow-slate-300"
			style={{ height: "50px", marginBottom: "1px" }}
		>
			{title}
		</div>
	);
};
