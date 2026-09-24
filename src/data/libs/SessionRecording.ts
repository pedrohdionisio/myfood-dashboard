import Clarity from '@microsoft/clarity';
import { env } from 'data/config/env';

function init() {
	if (env.clarityProjectId) {
		Clarity.init(env.clarityProjectId);
	}
}

function identify(userId: string | null) {
	if (env.clarityProjectId && userId) {
		Clarity.identify(userId);
	}
}

export const SessionRecording = {
	init,
	identify
};
