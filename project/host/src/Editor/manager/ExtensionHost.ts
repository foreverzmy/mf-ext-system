import type {
	Disposable,
	Extension,
	ExtensionConfig,
	ExtensionContext,
	ExtensionContributes,
	ExtensionModule,
} from '../types';

export class ExtensionHost<T = any> implements Extension<T>, Disposable {
	readonly uri: string;
	readonly title: string;
	#isActive = false;
	#exports: T | undefined;
	contributes: ExtensionContributes | undefined;

	#subscriptions = [] as Array<Disposable>;
	#loadFn?: () => Promise<ExtensionModule | undefined>;
	#activate?: (ctx: ExtensionContext) => Promise<void>;
	#deactivate?: () => void;

	constructor(config: ExtensionConfig) {
		this.uri = config.name;
		this.title = config.title;
		this.contributes = config.contributes;
		this.#loadFn = config.onload;
	}

	get name() {
		return this.uri;
	}

	get isActive() {
		return this.#isActive;
	}

	get exports() {
		return this.#exports as T;
	}

	async init() {
		if (!this.#loadFn) {
			return;
		}

		const { activate, deactivate } = (await this.#loadFn()) ?? {};
		this.#activate = activate;
		this.#deactivate = deactivate;
	}

	activate = async () => {
		try {
			this.#exports = (await this.#activate?.({
				uri: this.uri,
				extension: this,
				subscriptions: this.#subscriptions,
			})) as T;
		} catch (error) {
			console.error(error);
		}
		this.#isActive = true;
	};

	deactivate = () => {
		this.#deactivate?.();
	};

	dispose = () => {
		this.#exports = undefined;
		this.deactivate?.();
		this.#subscriptions.forEach((sub) => sub?.dispose?.());
		this.#subscriptions = [];
	};
}
