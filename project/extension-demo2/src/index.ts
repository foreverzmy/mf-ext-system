import { views, type ExtensionContext } from 'editor';

export const activate = (ctx: ExtensionContext) => {
	
	ctx.subscriptions.push(
		views.onActivityBarActive('demo2', () => {
			console.log('demo2');
			console.log("extension loaded", ctx);
		})
	);
};
