import { views, type ExtensionContext } from 'editor';

export const activate = (ctx: ExtensionContext) => {
	
	ctx.subscriptions.push(
		views.onActivityBarActive('demo1', () => {
			console.log('demo1');
			console.log("extension loaded", ctx);
		})
	);
};
